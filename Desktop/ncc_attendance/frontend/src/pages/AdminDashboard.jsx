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
          <div className="ncc-panel space-y-7 p-5 sm:p-8 animate-fade-up">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-slate-50 to-slate-100 border border-slate-200/80 p-6 text-slate-800 sm:p-8 shadow-sm">
              <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full border-[38px] border-slate-900/[0.015]" />
              <div>
                <p className="ncc-kicker">Admin dashboard</p>
                <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">Hello, {user.name}</h1>
                <p className="mt-3 max-w-2xl text-slate-600 font-medium">Use the navigation menu to add cadets, record attendance, manage cadet profiles, or view analytics.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-indigo-500/35 hover:bg-slate-100/60">
                <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-slate-200/70 transition duration-300 group-hover:text-slate-300/80">01</span>
                <p className="relative text-xs font-extrabold uppercase tracking-[0.14em] text-indigo-600">Start here</p>
                <p className="mt-2 text-sm text-slate-600 relative z-10 font-medium">Add cadets before recording attendance. Each cadet receives a regimental number and login password.</p>
              </div>
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-indigo-500/35 hover:bg-slate-100/60">
                <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-slate-200/70 transition duration-300 group-hover:text-slate-300/80">02</span>
                <p className="relative text-xs font-extrabold uppercase tracking-[0.14em] text-cyan-600">Attendance</p>
                <p className="mt-2 text-sm text-slate-600 relative z-10 font-medium">Record attendance for each cadet with a date and status, then review totals in analytics.</p>
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
