import { useEffect, useMemo, useState } from 'react';
import { fetchAttendanceAll, fetchAttendanceByDate, fetchAttendanceDates, fetchCadets, submitAttendanceBatch } from '../services/api';
import AttendanceTable from '../components/AttendanceTable';

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
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[2rem] bg-white p-5 shadow-lg border-t-4 border-yellow-500 sm:p-8">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-bold">Attendance sheet</p>
          <h1 className="mt-3 text-3xl font-bold text-blue-900">Mark cadets present or absent</h1>
          <p className="mt-2 text-sm text-slate-700">Use the list below to set attendance for all cadets on a selected date.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_auto]">
          <div>
            <label className="block text-sm font-semibold text-blue-900">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 w-full rounded-3xl border-2 border-yellow-500 bg-blue-50 px-4 py-3 outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-500/50 text-blue-900 font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-blue-900">Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="mt-2 w-full rounded-3xl border-2 border-yellow-500 bg-blue-50 px-4 py-3 text-blue-900 font-medium outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-500/50"
            >
              <option value="all">All batches</option>
              {batchOptions.map((batch) => (
                <option key={batch} value={batch}>Batch {batch}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end sm:col-span-2 xl:col-span-1">
            <button onClick={handleSubmit} className="w-full rounded-3xl bg-yellow-500 px-6 py-3 text-sm font-bold text-blue-900 transition hover:bg-yellow-400 shadow-md xl:min-w-48">
              Save attendance for date
            </button>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-blue-50">
          <div className="grid gap-px bg-[linear-gradient(110deg,#070d35,#111b5f_70%,#1c55c9)] px-4 py-3 text-sm font-semibold text-white sm:grid-cols-[3fr_1fr]">
            <span>Cadet ({filteredCadets.length})</span>
            <span className="text-right">Present / Absent</span>
          </div>
          <div className="divide-y divide-slate-200 bg-white">
            {cadets.length === 0 ? (
              <div className="p-6 text-sm text-slate-600">Add cadets first to record attendance.</div>
            ) : filteredCadets.length === 0 ? (
              <div className="p-6 text-sm text-slate-600">No cadets found for batch {selectedBatch}.</div>
            ) : (
              filteredCadets.map((cadet) => (
                <div key={cadet.regimentalNumber} className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{cadet.name}</p>
                    <p className="mt-1 break-words text-sm text-slate-500">{cadet.regimentalNumber} • {cadet.unit}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Today: {cadet.todayStatus}</span>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">Attendance {cadet.totals.percentage}%</span>
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
                    className={`w-full rounded-full px-5 py-2 text-sm font-semibold transition sm:w-auto ${statuses[cadet.regimentalNumber] === 'Present' ? 'bg-blue-100 text-blue-800 border-2 border-yellow-500' : 'bg-red-100 text-red-800 border-2 border-red-400'}`}
                  >
                    {statuses[cadet.regimentalNumber] === 'Present' ? 'Present' : 'Absent'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {message && <p className="mt-4 text-sm text-blue-700 font-semibold">✓ {message}</p>}
        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
      </section>

      <aside className="space-y-6">
        <div className="rounded-[2rem] bg-white p-5 shadow-lg border-t-4 border-yellow-500 sm:p-8">
          <div className="mb-4">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-bold">Attendance sheets</p>
            <h2 className="mt-3 text-2xl font-bold text-blue-900">Saved dates</h2>
            <p className="mt-2 text-sm text-slate-700">Click a date to view or export its attendance sheet.</p>
          </div>
          {dates.length === 0 ? (
            <p className="rounded-3xl border border-slate-200 bg-blue-50 p-4 text-sm text-slate-700">No saved sheets yet.</p>
          ) : (
            <div className="space-y-3">
              {dates.map((sheetDate) => (
                <button
                  key={sheetDate}
                  onClick={() => loadSheet(sheetDate)}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${selectedDate === sheetDate ? 'border-[#2878ff] bg-[#edf6ff] text-[#111b5f] font-bold shadow-[0_8px_20px_rgba(40,120,255,.12)]' : 'border-slate-200 bg-white text-slate-800 hover:border-[#9ac2ed] hover:bg-blue-50'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>{sheetDate}</span>
                    {selectedDate === sheetDate && <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-blue-900">Open</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700 font-semibold">Full attendance sheet export</p>
              <p className="text-xs text-slate-600">Includes all cadets, all dates, and 1/0 attendance values per date.</p>
            </div>
            <button
              type="button"
              onClick={handleExportFull}
              disabled={loadingExport}
              className="w-full rounded-3xl bg-blue-900 px-5 py-3 text-sm font-bold text-yellow-300 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 shadow-md border border-yellow-500 sm:w-auto"
            >
              {loadingExport ? 'Preparing export...' : 'Export full attendance sheet'}
            </button>
          </div>
        </div>

        {activeRecords.length > 0 && (
          <div className="rounded-[2rem] bg-white p-5 shadow-lg border-t-4 border-yellow-500 sm:p-8">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-bold">Sheet preview</p>
                <h2 className="mt-3 text-2xl font-bold text-blue-900">{selectedDate}</h2>
              </div>
              <button
                onClick={() => downloadSheet(activeRecords, selectedDate)}
                className="w-full rounded-3xl bg-blue-900 px-5 py-3 text-sm font-bold text-yellow-300 transition hover:bg-blue-800 shadow-md border border-yellow-500 sm:w-auto"
              >
                Export CSV
              </button>
            </div>
            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
              <AttendanceTable records={activeRecords} />
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
