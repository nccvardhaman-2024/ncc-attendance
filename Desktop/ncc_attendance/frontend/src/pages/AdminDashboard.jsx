import AddCadetPage from './AdminAddCadet';
import AttendancePage from './AdminAttendance';
import CadetListPage from './AdminCadets';
import AnalyticsPage from './AdminAnalytics';

export default function AdminDashboard({ user, token, section = 'home' }) {
  function renderSection() {
    switch (section) {
      case 'add':
        return <AddCadetPage token={token} />;
      case 'attendance':
        return <AttendancePage token={token} />;
      case 'cadets':
        return <CadetListPage token={token} />;
      case 'analytics':
        return <AnalyticsPage token={token} />;
      default:
        return (
          <div className="ncc-panel space-y-7 p-5 sm:p-8">
            <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(120deg,#09111f,#14213d_64%,#0f766e)] p-6 text-white sm:p-8">
              <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full border-[38px] border-white/5" />
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#7dd3fc]">Admin dashboard</p>
                <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Hello, {user.name}</h1>
                <p className="mt-3 max-w-2xl text-sky-50/75">Use the navigation menu to add cadets, record attendance, manage cadet profiles, or view analytics.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-[#f6fbfb] p-6 shadow-[0_10px_28px_rgba(15,23,42,.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(15,23,42,.11)]">
                <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-slate-100">01</span>
                <p className="relative text-sm font-extrabold uppercase tracking-[0.14em] text-[#d97706]">Start here</p>
                <p className="mt-2 text-sm text-slate-700">Add cadets before recording attendance. Each cadet receives a regimental number and login password.</p>
              </div>
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-[#f6fbfb] p-6 shadow-[0_10px_28px_rgba(15,23,42,.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(15,23,42,.11)]">
                <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-slate-100">02</span>
                <p className="relative text-sm font-extrabold uppercase tracking-[0.14em] text-[#0f766e]">Attendance</p>
                <p className="mt-2 text-sm text-slate-700">Record attendance for each cadet with a date and status, then review totals in analytics.</p>
              </div>
            </div>
          </div>
        );
    }
  }

  return (
    <section className="mx-auto max-w-7xl py-2 sm:py-6">
      <main>{renderSection()}</main>
    </section>
  );
}
