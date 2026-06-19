import { useEffect, useMemo, useState } from 'react';
import { fetchAttendanceAll, fetchAttendanceByDate, fetchAttendanceDates, fetchCadets, submitAttendanceBatch } from '../services/api';
import AttendanceTable from '../components/AttendanceTable';
import RankInsignia from '../components/RankInsignia';

const defaultDate = new Date().toISOString().slice(0, 10);

function csvEscape(value) {
  if (value == null) return '';
  const text = String(value).replace(/"/g, '""');
  return `"${text}"`;
}

function downloadSheet(records, date) {
  const headers = ['Date', 'Regimental Number', 'Cadet Name', 'Status', 'Note', 'Recorded By', 'Recorded At'];
  const rows = records.map((record) => [
    record.date,
    record.regimentalNumber,
    record.cadetName,
    record.status,
    record.note || '',
    record.recordedBy,
    record.recordedAt
  ]);
  const content = [headers, ...rows].map((row) => row.map(csvEscape).join(',')).join('\r\n');
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `attendance-${date}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function downloadFullSheet(cadets, attendanceRecords) {
  const dates = Array.from(new Set(attendanceRecords.map((record) => record.date))).sort();
  const header = ['Seq', 'Name', 'Regimental Number', ...dates];

  const attendanceMap = attendanceRecords.reduce((acc, record) => {
    const key = `${record.regimentalNumber}|${record.date}`;
    acc[key] = record.status === 'Present' ? 1 : 0;
    return acc;
  }, {});

  const rows = cadets
    .slice()
    .sort((a, b) => {
      const aMatch = a.regimentalNumber?.match(/(\d{4})$/);
      const bMatch = b.regimentalNumber?.match(/(\d{4})$/);
      return (aMatch ? Number(aMatch[1]) : 0) - (bMatch ? Number(bMatch[1]) : 0);
    })
    .map((cadet, index) => {
      const values = dates.map((date) => attendanceMap[`${cadet.regimentalNumber}|${date}`] || 0);
      return [index + 1, cadet.name, cadet.regimentalNumber, ...values];
    });

  const content = [header, ...rows].map((row) => row.map(csvEscape).join(',')).join('\r\n');
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'cadet-attendance-full-sheet.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function AttendancePage({ token }) {
  const [cadets, setCadets] = useState([]);
  const [date, setDate] = useState(defaultDate);
  const [statuses, setStatuses] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [viewRecords, setViewRecords] = useState([]);
  const [loadingExport, setLoadingExport] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('all');

  useEffect(() => {
    fetchCadets(token).then((res) => setCadets(res.cadets || []));
    fetchAttendanceDates(token).then((res) => setDates(res.dates || []));
  }, [token]);

  useEffect(() => {
    if (cadets.length > 0) {
      const map = {};
      cadets.forEach((cadet) => {
        map[cadet.regimentalNumber] = 'Present';
      });
      setStatuses(map);
    }
  }, [cadets]);

  const activeRecords = useMemo(() => {
    return dates.includes(selectedDate) ? viewRecords : [];
  }, [selectedDate, viewRecords, dates]);

  const batchOptions = useMemo(() => {
    const batches = cadets
      .map((cadet) => cadet.regimentalNumber?.match(/(20\d{2})/)?.[0])
      .filter(Boolean);

    return Array.from(new Set(batches)).sort();
  }, [cadets]);

  const sortedCadets = useMemo(() => {
    return [...cadets].sort((a, b) => {
      const aSuffix = a.regimentalNumber?.match(/(\d{4})$/)?.[1];
      const bSuffix = b.regimentalNumber?.match(/(\d{4})$/)?.[1];
      const suffixDifference = Number(aSuffix ?? Number.MAX_SAFE_INTEGER)
        - Number(bSuffix ?? Number.MAX_SAFE_INTEGER);

      if (suffixDifference !== 0) return suffixDifference;
      return (a.regimentalNumber || '').localeCompare(b.regimentalNumber || '');
    });
  }, [cadets]);

  const filteredCadets = useMemo(() => {
    if (selectedBatch === 'all') return sortedCadets;
    return sortedCadets.filter(
      (cadet) => cadet.regimentalNumber?.match(/(20\d{2})/)?.[0] === selectedBatch
    );
  }, [selectedBatch, sortedCadets]);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!date) {
      setError('Please select a date.');
      return;
    }

    if (filteredCadets.length === 0) {
      setError('No cadets are available in the selected batch.');
      return;
    }

    const payload = filteredCadets.map((cadet) => ({
      regimentalNumber: cadet.regimentalNumber,
      date,
      status: statuses[cadet.regimentalNumber] || 'Present',
      note: ''
    }));

    const result = await submitAttendanceBatch(token, payload);
    if (result.error) {
      setError(result.error);
      return;
    }

    const batchLabel = selectedBatch === 'all' ? 'all batches' : `batch ${selectedBatch}`;
    setMessage(`Attendance saved for ${filteredCadets.length} cadet${filteredCadets.length === 1 ? '' : 's'} in ${batchLabel} on ${date}.`);
    fetchAttendanceDates(token).then((res) => setDates(res.dates || []));
    if (selectedDate === date) {
      loadSheet(date);
    }
  }

  async function loadSheet(sheetDate) {
    const result = await fetchAttendanceByDate(token, sheetDate);
    setSelectedDate(sheetDate);
    setViewRecords(result.attendance || []);
  }

  async function handleExportFull() {
    setLoadingExport(true);
    setError('');
    try {
      const result = await fetchAttendanceAll(token);
      const attendanceRecords = result.attendance || [];
      if (attendanceRecords.length === 0) {
        setError('No attendance data available for export.');
      } else {
        downloadFullSheet(cadets, attendanceRecords);
      }
    } catch (err) {
      setError('Unable to export full attendance sheet.');
    } finally {
      setLoadingExport(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] animate-fade-up">
      <section className="ncc-panel sm:p-8">
        <div className="mb-6">
          <p className="ncc-kicker">Attendance sheet</p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Mark cadets present or absent</h1>
          <p className="mt-2 text-sm text-slate-600 font-medium">Use the list below to set attendance for all cadets on a selected date.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_auto]">
          <div>
            <label className="block text-sm font-semibold text-slate-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#4f46e5] focus:bg-white focus:ring-4 focus:ring-[#4f46e5]/10 font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 font-medium outline-none transition-all duration-200 hover:border-slate-300 focus:border-[#4f46e5] focus:bg-white focus:ring-4 focus:ring-[#4f46e5]/10"
            >
              <option value="all">All batches</option>
              {batchOptions.map((batch) => (
                <option key={batch} value={batch}>Batch {batch}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end sm:col-span-2 xl:col-span-1">
            <button onClick={handleSubmit} className="ncc-primary w-full xl:min-w-48 !py-3.5 !rounded-xl">
              Save attendance
            </button>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/60">
          <div className="grid gap-px bg-slate-100 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 sm:grid-cols-[3fr_1fr] border-b border-slate-200">
            <span>Cadet ({filteredCadets.length})</span>
            <span className="text-right hidden sm:inline">Present / Absent</span>
          </div>
          <div className="divide-y divide-slate-200 bg-transparent">
            {cadets.length === 0 ? (
              <div className="p-6 text-sm text-slate-500 font-medium">Add cadets first to record attendance.</div>
            ) : filteredCadets.length === 0 ? (
              <div className="p-6 text-sm text-slate-500 font-medium">No cadets found for batch {selectedBatch}.</div>
            ) : (
              filteredCadets.map((cadet) => (
                <div key={cadet.regimentalNumber} className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between transition hover:bg-slate-100/50">
                  <div className="flex gap-3 items-start">
                    <RankInsignia rank={cadet.rank} className="w-8 h-11 shrink-0 bg-slate-50 rounded" />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 flex items-center gap-1.5 flex-wrap">
                        {cadet.name}
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-[var(--ncc-gold)] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                          {cadet.rank === 'Cadet' ? 'CDT' : cadet.rank === 'Lance Corporal' ? 'L/CPL' : cadet.rank === 'Corporal' ? 'CPL' : cadet.rank === 'Sergeant' ? 'SGT' : cadet.rank === 'Cadet Under Officer' ? 'CUO' : 'CSUO'}
                        </span>
                      </p>
                      <p className="mt-1 break-words text-xs text-slate-500">{cadet.regimentalNumber} • {cadet.unit}</p>
                      <div className="mt-2.5 flex flex-wrap gap-2 text-[11px]">
                        <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-slate-600">Today: {cadet.todayStatus}</span>
                        <span className="rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-emerald-700 font-semibold">Attendance {cadet.totals.percentage}%</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setStatuses((prev) => ({
                        ...prev,
                        [cadet.regimentalNumber]: prev[cadet.regimentalNumber] === 'Present' ? 'Absent' : 'Present'
                      }))
                    }
                    className={`w-full rounded-xl px-5 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-200 border sm:w-auto ${
                      statuses[cadet.regimentalNumber] === 'Present'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    {statuses[cadet.regimentalNumber] === 'Present' ? 'Present' : 'Absent'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {message && <p className="mt-4 text-sm text-emerald-600 font-semibold">✓ {message}</p>}
        {error && <p className="mt-4 text-sm text-rose-600 font-semibold">{error}</p>}
      </section>

      <aside className="space-y-6">
        <div className="ncc-panel sm:p-8">
          <div className="mb-4">
            <p className="ncc-kicker">Attendance sheets</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">Saved dates</h2>
            <p className="mt-2 text-sm text-slate-600 font-medium">Click a date to view or export its attendance sheet.</p>
          </div>
          {dates.length === 0 ? (
            <p className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-sm text-slate-500 font-medium">No saved sheets yet.</p>
          ) : (
            <div className="space-y-3">
              {dates.map((sheetDate) => (
                <button
                  key={sheetDate}
                  onClick={() => loadSheet(sheetDate)}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-bold transition-all duration-200 ${
                    selectedDate === sheetDate
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>{sheetDate}</span>
                    {selectedDate === sheetDate && (
                      <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-sm">Open</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
          <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-6">
            <div>
              <p className="text-sm text-slate-800 font-semibold">Full attendance sheet export</p>
              <p className="text-xs text-slate-500 mt-1">Includes all cadets, all dates, and 1/0 attendance values per date.</p>
            </div>
            <button
              type="button"
              onClick={handleExportFull}
              disabled={loadingExport}
              className="ncc-secondary w-full sm:w-auto"
            >
              {loadingExport ? 'Preparing export...' : 'Export full sheet (CSV)'}
            </button>
          </div>
        </div>

        {activeRecords.length > 0 && (
          <div className="ncc-panel sm:p-8">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="ncc-kicker">Sheet preview</p>
                <h2 className="mt-3 text-2xl font-bold text-slate-900">{selectedDate}</h2>
              </div>
              <button
                onClick={() => downloadSheet(activeRecords, selectedDate)}
                className="ncc-secondary w-full sm:w-auto"
              >
                Export CSV
              </button>
            </div>
            <div className="mt-2">
              <AttendanceTable records={activeRecords} />
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
