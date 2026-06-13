import { useEffect, useMemo, useState } from 'react';
import { fetchCadetAttendance } from '../services/api';
import AttendanceTable from '../components/AttendanceTable';
import CalendarView from '../components/CalendarView';

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
    <section className="mx-auto max-w-7xl py-2 sm:py-6">
      <div className="rounded-[2rem] bg-white p-5 shadow-lg border-t-4 border-yellow-500 sm:p-8">
        <div className="grid gap-4 md:grid-cols-[1fr_0.9fr] md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-bold">Cadet view</p>
            <h1 className="mt-3 text-3xl font-bold text-blue-900">Welcome, {user.name}</h1>
            <p className="mt-2 text-slate-700">Your attendance record and analytics are shown below to help track your progress.</p>
          </div>
          <div className="rounded-3xl bg-blue-50 p-6 border-l-4 border-yellow-500">
            <p className="text-sm text-slate-600 font-semibold">Regimental number</p>
            <p className="mt-2 break-all text-lg font-bold text-blue-900 sm:text-xl">{user.regimentalNumber}</p>
            <p className="mt-1 text-sm text-slate-700">Unit: {user.unit}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border-l-4 border-yellow-500 border border-slate-200 bg-blue-50 p-6">
            <p className="text-sm text-slate-600 font-semibold">Attendance percentage</p>
            <p className="mt-3 text-4xl font-bold text-blue-900">{summary.percentage}%</p>
            <p className="mt-2 text-sm text-slate-700">Based on your completed attendance records.</p>
          </div>
          <div className="rounded-3xl border-l-4 border-blue-600 border border-slate-200 bg-amber-50 p-6">
            <p className="text-sm text-slate-600 font-semibold">Present</p>
            <p className="mt-3 text-3xl font-bold text-amber-700">{summary.present}</p>
          </div>
          <div className="rounded-3xl border-l-4 border-red-500 border border-slate-200 bg-red-50 p-6">
            <p className="text-sm text-slate-600 font-semibold">Target</p>
            <p className="mt-3 text-3xl font-bold text-blue-900">{summary.targetPercent}%</p>
            <p className="mt-2 text-sm text-slate-700">Stay above this threshold.</p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-blue-50 p-6 border-l-4 border-yellow-500">
          <h2 className="text-lg font-bold text-blue-900">Attendance suggestion</h2>
          <p className="mt-3 text-sm text-slate-700">{summary.suggestion}</p>
          {summary.total > 0 && summary.percentage < summary.targetPercent && (
            <p className="mt-2 text-sm font-medium text-red-700">Need {summary.remainingDays} more full attendance day{summary.remainingDays === 1 ? '' : 's'} to cross {summary.targetPercent}%.</p>
          )}
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[0.8fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-blue-50 p-6 border-l-4 border-yellow-500">
            <h2 className="text-xl font-bold text-blue-900">Latest attendance</h2>
            {summary.latest ? (
              <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm border-l-4 border-yellow-500">
                <p className="text-sm text-slate-500 font-semibold">{summary.latest.date}</p>
                <p className="mt-3 text-2xl font-bold text-blue-900">{summary.latest.status}</p>
                <p className="mt-2 text-sm text-slate-700">{summary.latest.note || 'No note added.'}</p>
              </div>
            ) : (
              <p className="mt-5 text-sm text-slate-700">No attendance records yet.</p>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-blue-50 p-6 border-l-4 border-yellow-500">
            <h2 className="text-xl font-bold text-blue-900">Attendance calendar</h2>
            <p className="mt-2 text-sm text-slate-700">Recent records are shown with status highlights.</p>
            <CalendarView attendance={attendance} />
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-blue-50 p-6 border-l-4 border-yellow-500">
          <h2 className="text-xl font-bold text-blue-900">Attendance history</h2>
          <AttendanceTable records={attendance} isCadetView />
        </div>
      </div>
    </section>
  );
}
