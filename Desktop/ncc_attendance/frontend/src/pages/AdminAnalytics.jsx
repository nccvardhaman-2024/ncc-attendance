import { useEffect, useMemo, useState } from 'react';
import { fetchAnalytics } from '../services/api';
import Logo from '../components/Logo';

export default function AnalyticsPage({ token }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');

  useEffect(() => {
    fetchAnalytics(token).then((res) => {
      setAnalytics(res);
      setLoading(false);
    });
  }, [token]);

  const batchOptions = useMemo(() => {
    if (!analytics || !analytics.byBatch) return [];
    return Object.keys(analytics.byBatch).sort();
  }, [analytics]);

  const genderOptions = useMemo(() => {
    if (!analytics || !analytics.byGender) return [];
    return Object.keys(analytics.byGender).sort();
  }, [analytics]);

  const filteredSummary = useMemo(() => {
    if (!analytics) return [];
    return analytics.summary.filter((c) => {
      if (selectedBatch !== 'all') {
        const m = c.regimentalNumber.match(/(20\d{2})/);
        if (!m || m[0] !== selectedBatch) return false;
      }
      if (selectedGender !== 'all') {
        const gm = c.regimentalNumber.match(/(SD|SW)/i);
        const g = gm ? gm[0].toUpperCase() : 'UNKNOWN';
        if (g !== selectedGender) return false;
      }
      return true;
    });
  }, [analytics, selectedBatch, selectedGender]);

  const filteredDailyRecords = useMemo(() => {
    if (!analytics || !analytics.dailyRecords) return [];
    return analytics.dailyRecords.filter((rec) => {
      if (selectedBatch !== 'all') {
        const m = rec.regimentalNumber && rec.regimentalNumber.match(/(20\d{2})/);
        if (!m || m[0] !== selectedBatch) return false;
      }
      if (selectedGender !== 'all') {
        const gm = rec.regimentalNumber && rec.regimentalNumber.match(/(SD|SW)/i);
        const g = gm ? gm[0].toUpperCase() : 'UNKNOWN';
        if (g !== selectedGender) return false;
      }
      return true;
    });
  }, [analytics, selectedBatch, selectedGender]);

  const topMetrics = useMemo(() => {
    const total = filteredDailyRecords.length;
    const present = filteredDailyRecords.filter((r) => r.status === 'Present').length;
    const presentSD = filteredDailyRecords.filter((r) => r.status === 'Present' && /SD/i.test(r.regimentalNumber)).length;
    const presentSW = filteredDailyRecords.filter((r) => r.status === 'Present' && /SW/i.test(r.regimentalNumber)).length;
    const absentSD = filteredDailyRecords.filter((r) => r.status === 'Absent' && /SD/i.test(r.regimentalNumber)).length;
    const absentSW = filteredDailyRecords.filter((r) => r.status === 'Absent' && /SW/i.test(r.regimentalNumber)).length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, presentSD, presentSW, absentSD, absentSW, percentage };
  }, [filteredDailyRecords]);

  return (
    <div className="rounded-[2rem] bg-white p-4 shadow-lg border-t-4 border-yellow-500 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-bold">Analytics</p>
          <h1 className="mt-2 text-2xl font-bold text-blue-900">Attendance overview</h1>
          <p className="mt-1 text-sm text-slate-700">Totals, daily summary, and filters by batch and gender.</p>
        </div>
        <div className="flex items-center gap-3">
          <Logo className="h-10 w-10" />
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-600">Loading analytics...</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-3xl border border-slate-200 bg-blue-50 p-4 border-l-4 border-yellow-500">
              <p className="text-sm text-slate-600 font-semibold">Today's total</p>
              <p className="mt-2 text-2xl font-bold text-blue-900">{topMetrics.total}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-blue-50 p-4 border-l-4 border-yellow-500">
              <p className="text-sm text-slate-600 font-semibold">Present (total)</p>
              <p className="mt-2 text-2xl font-bold text-yellow-600">{topMetrics.present}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-blue-50 p-4 border-l-4 border-yellow-500">
              <p className="text-sm text-slate-600 font-semibold">Present (SD)</p>
              <p className="mt-2 text-2xl font-bold text-yellow-600">{topMetrics.presentSD}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-blue-50 p-4 border-l-4 border-yellow-500">
              <p className="text-sm text-slate-600 font-semibold">Present (SW)</p>
              <p className="mt-2 text-2xl font-bold text-yellow-600">{topMetrics.presentSW}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-red-50 p-4 border-l-4 border-red-500">
              <p className="text-sm text-slate-600 font-semibold">Absent (SD)</p>
              <p className="mt-2 text-2xl font-bold text-red-700">{topMetrics.absentSD}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-red-50 p-4 border-l-4 border-red-500">
              <p className="text-sm text-slate-600 font-semibold">Absent (SW)</p>
              <p className="mt-2 text-2xl font-bold text-red-700">{topMetrics.absentSW}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-yellow-50 p-4 lg:col-span-6 border-l-4 border-yellow-500">
              <p className="text-sm text-slate-600 font-semibold">Present % (filtered)</p>
              <p className="mt-2 text-3xl font-bold text-blue-900">{topMetrics.percentage}%</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <label className="text-sm text-slate-700 font-semibold">Batch</label>
              <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="w-full rounded-2xl border-2 border-yellow-500 bg-blue-50 px-3 py-2 text-sm text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500/50 sm:ml-2 sm:w-auto">
                <option value="all">All</option>
                {batchOptions.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <label className="text-sm text-slate-700 font-semibold">Gender</label>
              <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)} className="w-full rounded-2xl border-2 border-yellow-500 bg-blue-50 px-3 py-2 text-sm text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500/50 sm:ml-2 sm:w-auto">
                <option value="all">All</option>
                {genderOptions.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-bold text-blue-900">Cadet summary</h2>
            <div className="mt-3 grid gap-3">
              {filteredSummary.slice(0, 200).map((c) => (
                <div key={c.regimentalNumber} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:bg-blue-50 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold text-blue-900">{c.name}</p>
                    <p className="break-words text-sm text-slate-500">{c.regimentalNumber} • {c.unit}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-slate-600">{c.totals.percentage}%</span>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${c.totals.percentage >= 80 ? 'bg-blue-100 text-blue-800 border border-yellow-500' : 'bg-red-100 text-red-800 border border-red-400'}`}>{c.totals.present}P • {c.totals.absent}A</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
