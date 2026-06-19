import { useEffect, useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import CadetDashboard from './pages/CadetDashboard';
import { fetchMe } from './services/api';
import Logo from './components/Logo';
import PageWatermark from './components/PageWatermark';
import vceLogo from './assets/vce-logo.png';

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
  const [showWarmupNotice, setShowWarmupNotice] = useState(false);
  const [dashboardSection, setDashboardSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('ncc-token');
    if (!token) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowWarmupNotice(true);
    }, 2500);

    fetchMe(token)
      .then((result) => {
        if (result.user) {
          setUser(result.user);
          setScreen('dashboard');
          setDashboardSection(result.user.role === 'admin' ? 'home' : 'dashboard');
        } else {
          localStorage.removeItem('ncc-token');
          localStorage.removeItem('ncc-user');
        }
      })
      .catch(() => {
        localStorage.removeItem('ncc-token');
        localStorage.removeItem('ncc-user');
      })
      .finally(() => {
        clearTimeout(timer);
        setShowWarmupNotice(false);
        setLoading(false);
      });
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
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-4 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--ncc-navy)] border-t-transparent"></div>
          <p className="mt-4 font-display text-lg font-bold text-slate-800">Loading NCC Vardhaman...</p>
          {showWarmupNotice && (
            <div className="mt-4 max-w-sm rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm animate-pulse">
              <p className="font-semibold text-[var(--ncc-navy)]">Waking up backend server...</p>
              <p className="mt-1 text-xs text-slate-600">We host on a free-tier server which goes to sleep when inactive. This first load may take up to a minute. Thank you for your patience!</p>
            </div>
          )}
        </div>
      );
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
    <div className="relative isolate min-h-screen overflow-x-hidden text-slate-800 bg-[#f8fafc]">
      <PageWatermark />
      {!isLoginScreen && <header className="ncc-app-header sticky top-0 z-20">
        <div className="relative mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <Logo className="h-12 w-12" />
              {user && user.role === 'admin' && (
                <>
                  <div className="h-8 w-[1px] bg-white/20" />
                  <img src={vceLogo} alt="Vardhaman College of Engineering" className="h-11 object-contain" />
                </>
              )}
            </div>
            <div>
              <p className="font-display text-sm font-extrabold text-white">NCC Vardhaman</p>
              {user ? (
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-400">{user.role === 'admin' ? 'Admin command' : 'Cadet portal'}</p>
              ) : (
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-400">Attendance command</p>
              )}
            </div>
          </div>

          {/* VCE Logo - Centered absolutely on sm+ screens, mixed cleanly without card background/borders. Only visible if not admin. */}
          {(!user || user.role !== 'admin') && (
            <div className="order-3 mt-1.5 flex w-full justify-center sm:order-none sm:mt-0 sm:w-auto sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:z-10 pointer-events-none">
              <div className="flex h-12 items-center justify-center transition-all duration-300 hover:scale-105 pointer-events-auto">
                <img src={vceLogo} alt="Vardhaman College of Engineering" className="h-11 object-contain" />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <nav className="hidden items-center gap-2 lg:flex">
                  {(user.role === 'admin' ? adminNavItems : cadetNavItems).map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleNavigate(item.key)}
                      className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${dashboardSection === item.key ? 'bg-white/15 text-white border border-white/10 shadow-sm' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>

                <div className="flex items-center gap-3">
                  <span className="hidden text-sm text-slate-300 sm:inline">Welcome, {user.name}</span>
                  <button onClick={handleLogout} className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2.5 sm:px-5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:-translate-y-0.5 shadow-sm">
                    Logout
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-white/20 lg:hidden"
                    onClick={() => setMobileMenuOpen((open) => !open)}
                  >
                    Menu
                    <span aria-hidden="true">☰</span>
                  </button>
                </div>
              </>
            ) : (
              <button onClick={() => setScreen('login')} className="rounded-xl bg-[#ef4444] hover:bg-[#dc2626] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:-translate-y-0.5">
                Sign in
              </button>
            )}
          </div>
        </div>

        {user && mobileMenuOpen && (
          <div className="border-t border-slate-800 bg-[#0d1530] px-4 py-4 shadow-lg lg:hidden">
            <nav className="space-y-2">
              {(user.role === 'admin' ? adminNavItems : cadetNavItems).map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavigate(item.key)}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition ${dashboardSection === item.key ? 'bg-white/15 text-white border border-white/10' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>}

      <main className={`ncc-page relative z-10 mx-auto w-full ${isLoginScreen ? 'max-w-[1600px] p-0 sm:p-4' : 'max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8'}`}>{renderContent()}</main>

      {error && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-rose-500 px-5 py-3 text-white shadow-xl">
          {error}
        </div>
      )}
    </div>
  );
}

export default App;
