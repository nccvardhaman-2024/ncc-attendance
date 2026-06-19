import { useState } from 'react';
import { login } from '../services/api';
import Logo from '../components/Logo';

export default function LoginPage({ onLogin, onBack, setError }) {
  const [regimentalNumber, setRegimentalNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const timer = setTimeout(() => {
      setError('Waking up backend server (Render Free Tier). This may take up to a minute, please wait...');
    }, 2500);

    const result = await login(regimentalNumber.trim(), password);
    clearTimeout(timer);
    setLoading(false);

    if (result.token && result.user) {
      onLogin(result.user, result.token);
    } else {
      setError(result.error || 'Unable to sign in. Please check your credentials.');
    }
  }

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/40 sm:min-h-[calc(100vh-2rem)] sm:rounded-[2rem]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(23,37,84,.08),transparent_28%),radial-gradient(circle_at_88%_75%,rgba(216,35,42,.05),transparent_26%)]" />
      <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full border-[55px] border-slate-900/[0.01]" />
      <Logo className="pointer-events-none absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.02] mix-blend-multiply sm:h-[34rem] sm:w-[34rem] lg:left-[76%]" />

      <div className="relative z-10 grid min-h-screen lg:min-h-[calc(100vh-2rem)] lg:grid-cols-[1.08fr_0.92fr]">
        <div className="flex flex-col justify-between px-5 pb-6 pt-8 text-slate-800 sm:p-10 lg:p-16">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white p-1 shadow-sm ring-4 ring-slate-100 border border-slate-200">
              <Logo className="h-12 w-12 sm:h-16 sm:w-16" />
            </div>
            <div>
              <p className="font-display text-lg font-extrabold text-slate-900">NCC Vardhaman</p>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--ncc-navy)]">Attendance command</p>
            </div>
          </div>

          <div className="max-w-xl py-10 sm:py-14">
            <div className="mb-5 h-1 w-16 bg-gradient-to-r from-[var(--ncc-red)] via-[var(--ncc-navy)] to-[var(--ncc-sky)] sm:mb-7 sm:w-20" />
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500 sm:text-sm sm:tracking-[0.3em]">Unity and discipline</p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:mt-5 sm:text-5xl lg:text-6xl text-slate-900">
              Every parade.<br />Every cadet.<br /><span className="bg-gradient-to-r from-[var(--ncc-navy)] to-blue-800 bg-clip-text text-transparent">Accounted for.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 font-medium">
              A focused attendance portal built for officers and cadets of NCC Vardhaman.
            </p>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500/50">Secure unit access portal</p>
        </div>

        <div className="flex items-center justify-center px-4 pb-8 sm:p-10 lg:p-14">
          <form onSubmit={handleSubmit} className="relative w-full max-w-md overflow-hidden rounded-[1.35rem] border border-slate-200/80 bg-white/95 p-5 shadow-[0_25px_60px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:p-10">
            {/* NCC Tri-color accent stripe on top of form */}
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[var(--ncc-red)] via-[var(--ncc-navy)] to-[var(--ncc-sky)]" />
            <p className="ncc-kicker">Welcome back</p>
            <h2 className="mt-3 text-2xl font-extrabold text-slate-900 sm:text-3xl">Sign in to your portal</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 font-medium">Use the credentials issued by your unit administrator.</p>

            <div className="mt-8 space-y-5">
              <label className="block text-sm font-semibold text-slate-700">
                Regimental number
                <input
                  value={regimentalNumber}
                  onChange={(e) => setRegimentalNumber(e.target.value)}
                  placeholder="e.g. TS2024SDA020001"
                  className="ncc-input focus:border-[var(--ncc-navy)] focus:ring-[var(--ncc-navy)]/10"
                  autoComplete="username"
                  required
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="ncc-input focus:border-[var(--ncc-navy)] focus:ring-[var(--ncc-navy)]/10"
                  autoComplete="current-password"
                  required
                />
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="ncc-primary mt-8 w-full !bg-gradient-to-r !from-[var(--ncc-navy)] !to-blue-800 hover:!from-blue-850 hover:!to-blue-900 shadow-[var(--ncc-navy)]/10"
            >
              {loading ? 'Signing in...' : 'Sign in securely'}
            </button>
            <button type="button" onClick={onBack} className="mt-3 w-full rounded-xl px-5 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800">
              Back to home
            </button>

            <div className="mt-7 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--ncc-red)] via-[var(--ncc-navy)] to-[var(--ncc-sky)] text-sm font-bold text-white shadow-md">i</span>
              <p className="text-xs leading-5 text-slate-600 font-medium">New cadet accounts are created and managed by the unit administrator.</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
