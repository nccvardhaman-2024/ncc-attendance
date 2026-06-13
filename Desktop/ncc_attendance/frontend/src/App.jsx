import { useEffect, useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import CadetDashboard from './pages/CadetDashboard';
import { fetchMe } from './services/api';
import Logo from './components/Logo';
import PageWatermark from './components/PageWatermark';

const adminNavItems = [
  { key: 'home', label: 'Home' },
  { key: 'add', label: 'Add Cadet' },
  { key: 'attendance', label: 'Record Attendance' },
  { key: 'cadets', label: 'Cadet List' },
  { key: 'analytics', label: 'Analytics' }
];

const cadetNavItems = [{ key: 'dashboard', label: 'Dashboard' }];

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('landing');
  const [dashboardSection, setDashboardSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('ncc-token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetchMe(token)
      .then((result) => {
        if (result.user) {
          setUser(result.user);
          setScreen('dashboard');
        } else {
          localStorage.removeItem('ncc-token');
          localStorage.removeItem('ncc-user');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function handleLogin(userData, token) {
    localStorage.setItem('ncc-token', token);
    localStorage.setItem('ncc-user', JSON.stringify(userData));
    setUser(userData);
    setScreen('dashboard');
    setDashboardSection(userData.role === 'admin' ? 'home' : 'dashboard');
    setError('');
  }

  function handleLogout() {
    localStorage.removeItem('ncc-token');
    localStorage.removeItem('ncc-user');
    setUser(null);
    setScreen('landing');
    setDashboardSection('home');
    setMobileMenuOpen(false);
  }

  function handleNavigate(sectionKey) {
    setDashboardSection(sectionKey);
    setMobileMenuOpen(false);
  }

  function renderContent() {
    if (loading) {
      return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
    }

    if (screen === 'login') {
      return <LoginPage onLogin={handleLogin} onBack={() => setScreen('landing')} setError={setError} />;
    }

    if (screen === 'dashboard' && user) {
      return user.role === 'admin' ? (
        <AdminDashboard
          user={user}
          token={localStorage.getItem('ncc-token')}
          section={dashboardSection}
          onSectionChange={handleNavigate}
        />
      ) : (
        <CadetDashboard user={user} token={localStorage.getItem('ncc-token')} onLogout={handleLogout} />
      );
    }

    return <LandingPage onLogin={() => setScreen('login')} />;
  }

  const isLoginScreen = screen === 'login' && !user;

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden text-slate-900">
      <PageWatermark />
      {!isLoginScreen && <header className="sticky top-0 z-20 border-b border-[#d9e6f1] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 sm:flex sm:flex-wrap sm:justify-between sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Logo className="h-11 w-11" />
            <div>
              <p className="font-display text-sm font-extrabold text-[#101b66]">NCC Vardhaman</p>
              {user ? (
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#5795c7]">{user.role === 'admin' ? 'Admin command' : 'Cadet portal'}</p>
              ) : (
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#5795c7]">Attendance command</p>
              )}
            </div>
          </div>

          {user ? (
            <>
              <button
                type="button"
                className="col-start-2 row-start-1 inline-flex items-center gap-2 rounded-xl border border-[#c9d8ea] bg-white px-3 py-2 text-sm font-bold text-[#101b66] shadow-sm transition hover:bg-[#eef6fc] lg:hidden"
                onClick={() => setMobileMenuOpen((open) => !open)}
              >
                Menu
                <span aria-hidden="true">☰</span>
              </button>

              <nav className="hidden flex-1 items-center justify-center gap-2 lg:flex">
                {(user.role === 'admin' ? adminNavItems : cadetNavItems).map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleNavigate(item.key)}
                    className={`rounded-xl px-4 py-2 text-sm font-bold transition ${dashboardSection === item.key ? 'bg-[#101b66] text-white shadow-md' : 'text-slate-600 hover:bg-[#eef6fc] hover:text-[#101b66]'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="col-span-2 flex items-center justify-between gap-3 border-t border-[#e5edf5] pt-3 sm:col-auto sm:border-0 sm:pt-0">
                <span className="hidden sm:inline text-sm text-slate-600">Welcome, {user.name}</span>
                <button onClick={handleLogout} className="ncc-primary !rounded-xl !px-4 !py-2.5 sm:!px-5">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <button onClick={() => setScreen('login')} className="ncc-primary !rounded-xl !px-5 !py-2.5">
              Sign in
            </button>
          )}
        </div>

        {user && mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
            <nav className="space-y-2">
              {(user.role === 'admin' ? adminNavItems : cadetNavItems).map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavigate(item.key)}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition ${dashboardSection === item.key ? 'bg-[#101b66] text-white' : 'bg-[#eef6fc] text-[#101b66] hover:bg-[#dcecf8]'}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>}

      <main className={`relative z-10 mx-auto w-full ${isLoginScreen ? 'max-w-[1600px] p-0 sm:p-4' : 'max-w-7xl px-4 py-6 sm:px-6 lg:px-8'}`}>{renderContent()}</main>

      {error && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-rose-500 px-5 py-3 text-white shadow-xl">
          {error}
        </div>
      )}
    </div>
  );
}

export default App;
