import { useEffect, useMemo, useState } from 'react';
import { fetchAnalytics } from '../services/api';
import Logo from '../components/Logo';
import RankInsignia from '../components/RankInsignia';

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
    <div className="ncc-panel sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="ncc-kicker">Analytics</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Attendance overview</h1>
          <p className="mt-1 text-sm text-slate-600 font-medium">Totals, daily summary, and filters by batch and gender.</p>
        </div>
        <div className="flex items-center gap-3">
          <Logo className="h-12 w-12 shrink-0 drop-shadow-md" />
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500 font-medium">Loading analytics...</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 border-l-4 border-l-[#8b5cf6] shadow-sm">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Total</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{topMetrics.total}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 border-l-4 border-l-[#06b6d4] shadow-sm">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Present (total)</p>
              <p className="mt-2 text-2xl font-bold text-cyan-700">{topMetrics.present}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 border-l-4 border-l-indigo-500 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Present (SD)</p>
              <p className="mt-2 text-2xl font-bold text-indigo-700">{topMetrics.presentSD}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 border-l-4 border-l-purple-500 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Present (SW)</p>
              <p className="mt-2 text-2xl font-bold text-purple-700">{topMetrics.presentSW}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 border-l-4 border-l-[#ef4444] shadow-sm">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Absent (SD)</p>
              <p className="mt-2 text-2xl font-bold text-rose-600">{topMetrics.absentSD}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 border-l-4 border-l-[#ef4444] shadow-sm">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Absent (SW)</p>
              <p className="mt-2 text-2xl font-bold text-rose-600">{topMetrics.absentSW}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-7 border-l-4 border-l-[#22c55e] flex items-center justify-between gap-4 shadow-sm">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Present % (filtered)</p>
                <p className="mt-2 text-3xl font-extrabold text-[#22c55e]">{topMetrics.percentage}%</p>
              </div>
              <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${topMetrics.percentage}%` }} />
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Filter Batch</label>
              <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-all duration-200 hover:border-slate-300 focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10 sm:ml-2 sm:w-auto shadow-sm">
                <option value="all">All</option>
                {batchOptions.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Filter Gender</label>
              <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-all duration-200 hover:border-slate-300 focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10 sm:ml-2 sm:w-auto shadow-sm">
                <option value="all">All</option>
                {genderOptions.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <h2 className="text-xl font-bold text-slate-900">Cadet summary</h2>
            <div className="mt-5 grid gap-3">
              {filteredSummary.slice(0, 200).map((c) => (
                <div key={c.regimentalNumber} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between hover:scale-[1.01] shadow-sm">
                  <div className="flex gap-3 items-start">
                    <RankInsignia rank={c.rank} className="w-8 h-11 shrink-0 bg-slate-50 rounded" />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 flex items-center gap-1.5 flex-wrap">
                        {c.name}
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-[var(--ncc-gold)] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                          {c.rank === 'Cadet' ? 'CDT' : c.rank === 'Lance Corporal' ? 'L/CPL' : c.rank === 'Corporal' ? 'CPL' : c.rank === 'Sergeant' ? 'SGT' : c.rank === 'Cadet Under Officer' ? 'CUO' : 'CSUO'}
                        </span>
                      </p>
                      <p className="break-words text-xs text-slate-500 mt-1">{c.regimentalNumber} • {c.unit}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-semibold text-slate-700">{c.totals.percentage}% attendance</span>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold border ${c.totals.percentage >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                      {c.totals.present}P • {c.totals.absent}A
                    </span>
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
