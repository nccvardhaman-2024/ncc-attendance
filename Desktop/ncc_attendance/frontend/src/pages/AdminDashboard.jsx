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
          <div className="ncc-panel space-y-6 border-t-4 border-[#ed1c24] p-5 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-bold">Admin dashboard</p>
                <h1 className="mt-3 text-3xl font-bold text-blue-900">Hello, {user.name}</h1>
                <p className="mt-2 max-w-2xl text-slate-700">Use the navigation menu to add cadets, record attendance, manage cadet profiles, or view analytics.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border-l-4 border-[#ed1c24] border border-[#d9e6f1] bg-blue-50 p-6">
                <p className="text-sm font-bold text-blue-900">Start here</p>
                <p className="mt-2 text-sm text-slate-700">Add cadets before recording attendance. Each cadet receives a regimental number and login password.</p>
              </div>
              <div className="rounded-3xl border-l-4 border-[#2457a7] border border-[#d9e6f1] bg-blue-50 p-6">
                <p className="text-sm font-bold text-blue-900">Attendance</p>
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
