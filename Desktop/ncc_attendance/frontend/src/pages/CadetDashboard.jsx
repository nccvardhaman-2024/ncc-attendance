import { useEffect, useMemo, useState } from 'react';
import { fetchCadetAttendance } from '../services/api';
import AttendanceTable from '../components/AttendanceTable';
import CalendarView from '../components/CalendarView';
import RankInsignia from '../components/RankInsignia';
import BeretIcon from '../components/BeretIcon';

export default function CadetDashboard({ user, token }) {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchCadetAttendance(token).then((res) => setAttendance(res.attendance || []));
  }, [token]);

  const summary = useMemo(() => {
    const total = attendance.length;
    const present = attendance.filter((record) => record.status === 'Present').length;
    const absent = attendance.filter((record) => record.status === 'Absent').length;
    const late = attendance.filter((record) => record.status === 'Late').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    const latest = attendance.slice().sort((a, b) => b.date.localeCompare(a.date))[0] || null;
    const targetPercent = 80;
    const remainingDays = total === 0
      ? 5
      : Math.max(0, Math.ceil((targetPercent * total - present) / (100 - targetPercent)));
    let suggestion = '';

    if (total === 0) {
      suggestion = 'No attendance records yet. Attend at least 4 of the next 5 sessions to hit 80% soon.';
    } else if (percentage >= targetPercent) {
      suggestion = `Good progress — keep this pace to stay above ${targetPercent}%.`;
    } else {
      suggestion = `Attend the next ${remainingDays} session${remainingDays === 1 ? '' : 's'} to reach ${targetPercent}% overall.`;
    }

    return { total, present, absent, late, percentage, latest, remainingDays, suggestion, targetPercent };
  }, [attendance]);

  return (
    <section className="mx-auto max-w-7xl py-2 sm:py-6 animate-fade-up">
      <div className="ncc-panel sm:p-8">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] items-stretch">
          <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 border border-slate-200 border-l-4 border-l-[var(--ncc-navy)] shadow-sm">
            <div>
              <p className="ncc-kicker">Cadet view</p>
              <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">Welcome, {user.name}</h1>
              <p className="mt-2 text-sm text-slate-600 font-medium leading-relaxed">Your attendance record, official unit credentials, and rank insignias are managed below.</p>
            </div>
            
            <div className="mt-6 grid gap-4 grid-cols-2 border-t border-slate-200/60 pt-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Regimental Number</p>
                <p className="mt-1.5 break-all text-sm font-extrabold text-[var(--ncc-navy)] uppercase tracking-wide sm:text-base">{user.regimentalNumber}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Unit / Directorate</p>
                <p className="mt-1.5 text-sm font-extrabold text-slate-800 sm:text-base">{user.unit}</p>
              </div>
            </div>
          </div>

          {/* Military Badge & Rank Insignia Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--ncc-red)]/5 via-transparent to-[var(--ncc-sky)]/5 p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            {/* Top decorative stripe */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--ncc-red)] via-[var(--ncc-navy)] to-[var(--ncc-sky)]" />
            
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500 font-extrabold">Active Rank</p>
                <h2 className="mt-1.5 text-lg font-black text-[var(--ncc-navy)] sm:text-xl">{user.rank || 'Cadet'}</h2>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--ncc-gold)]">National Cadet Corps</p>
              </div>
              <div className="flex shrink-0 gap-2 items-center">
                <BeretIcon className="w-12 h-10 drop-shadow-sm" />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-slate-100 shadow-inner">
              <RankInsignia rank={user.rank} className="w-14 h-20 drop-shadow-md transition-transform duration-300 hover:scale-105" />
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 border-l-4 border-l-[var(--ncc-navy)] p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Attendance percentage</p>
            <p className="mt-3 text-4xl font-extrabold text-slate-900">{summary.percentage}%</p>
            <p className="mt-2 text-xs text-slate-500">Based on your completed attendance records.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 border-l-4 border-l-[var(--ncc-sky)] p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Present</p>
            <p className="mt-3 text-4xl font-extrabold text-[var(--ncc-navy)]">{summary.present} / {summary.total}</p>
            <p className="mt-2 text-xs text-slate-500">Total parade sessions attended.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 border-l-4 border-l-[var(--ncc-gold)] p-6 shadow-sm sm:col-span-2 lg:col-span-1">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Target</p>
            <p className="mt-3 text-4xl font-extrabold text-[var(--ncc-gold)]">{summary.targetPercent}%</p>
            <p className="mt-2 text-xs text-slate-500">Stay above this threshold.</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 border-l-4 border-l-[var(--ncc-red)] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Attendance suggestion</h2>
          <p className="mt-3 text-sm text-slate-600 font-medium">{summary.suggestion}</p>
          {summary.total > 0 && summary.percentage < summary.targetPercent && (
            <p className="mt-2 text-sm font-semibold text-rose-600">Need {summary.remainingDays} more full attendance day{summary.remainingDays === 1 ? '' : 's'} to cross {summary.targetPercent}%.</p>
          )}
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[0.8fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 border-l-4 border-l-[var(--ncc-navy)] p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Latest attendance</h2>
            {summary.latest ? (
              <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm border border-slate-200 border-l-4 border-l-[var(--ncc-red)]">
                <p className="text-xs text-slate-500 font-bold">{summary.latest.date}</p>
                <p className="mt-3 text-2xl font-bold text-slate-800">{summary.latest.status}</p>
                <p className="mt-2 text-sm text-slate-600 font-medium">{summary.latest.note || 'No note added.'}</p>
              </div>
            ) : (
              <p className="mt-5 text-sm text-slate-500 font-medium">No attendance records yet.</p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 border-l-4 border-l-[var(--ncc-sky)] p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Attendance calendar</h2>
            <p className="mt-2 text-sm text-slate-500 font-medium">Recent records are shown with status highlights.</p>
            <CalendarView attendance={attendance} />
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50/80 border-l-4 border-l-[var(--ncc-navy)] p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Attendance history</h2>
          <AttendanceTable records={attendance} isCadetView />
        </div>
      </div>
    </section>
  );
}
