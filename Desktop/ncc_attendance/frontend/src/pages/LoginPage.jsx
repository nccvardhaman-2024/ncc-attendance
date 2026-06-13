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

    const result = await login(regimentalNumber.trim(), password);
    setLoading(false);

    if (result.token && result.user) {
      onLogin(result.user, result.token);
    } else {
      setError(result.error || 'Unable to sign in. Please check your credentials.');
    }
  }

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#08113f] sm:min-h-[calc(100vh-2rem)] sm:rounded-[2.5rem]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(87,149,199,.42),transparent_30%),radial-gradient(circle_at_83%_78%,rgba(237,28,36,.25),transparent_28%)]" />
      <Logo className="pointer-events-none absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.055] mix-blend-screen sm:h-[34rem] sm:w-[34rem] lg:left-[76%]" />

      <div className="relative z-10 grid min-h-screen lg:min-h-[calc(100vh-2rem)] lg:grid-cols-[1.08fr_0.92fr]">
        <div className="flex flex-col justify-between px-5 pb-6 pt-8 text-white sm:p-10 lg:p-16">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white p-1 shadow-xl ring-2 ring-white/30"><Logo className="h-12 w-12 sm:h-16 sm:w-16" /></div>
            <div>
              <p className="font-display text-lg font-extrabold">NCC Vardhaman</p>
              <p className="text-xs uppercase tracking-[0.24em] text-[#9bc5e6]">Attendance command</p>
            </div>
          </div>

          <div className="max-w-xl py-10 sm:py-14">
            <div className="mb-5 h-1 w-16 rounded-full bg-[#ed1c24] sm:mb-7 sm:w-20" />
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8fc3ea] sm:text-sm sm:tracking-[0.3em]">Unity and discipline</p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:mt-5 sm:text-5xl lg:text-6xl">
              Every parade.<br />Every cadet.<br /><span className="text-[#ff4b52]">Accounted for.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-blue-100/80">
              A focused attendance portal built for officers and cadets of NCC Vardhaman.
            </p>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200/60">Secure unit access portal</p>
        </div>

        <div className="flex items-center justify-center px-4 pb-8 sm:p-10 lg:p-14">
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[1.5rem] border border-white/70 bg-white/95 p-5 shadow-[0_30px_90px_rgba(0,0,0,.35)] backdrop-blur-xl sm:rounded-[2rem] sm:p-10">
            <p className="ncc-kicker">Welcome back</p>
            <h2 className="mt-3 text-2xl font-extrabold text-[#101b66] sm:text-3xl">Sign in to your portal</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Use the credentials issued by your unit administrator.</p>

            <div className="mt-8 space-y-5">
              <label className="block text-sm font-bold text-[#101b66]">
                Regimental number
                <input
                  value={regimentalNumber}
                  onChange={(e) => setRegimentalNumber(e.target.value)}
                  placeholder="e.g. TS2024SDA020001"
                  className="ncc-input"
                  autoComplete="username"
                  required
                />
              </label>

              <label className="block text-sm font-bold text-[#101b66]">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="ncc-input"
                  autoComplete="current-password"
                  required
                />
              </label>
            </div>

            <button type="submit" disabled={loading} className="ncc-primary mt-8 w-full">
              {loading ? 'Signing in...' : 'Sign in securely'}
            </button>
            <button type="button" onClick={onBack} className="mt-3 w-full rounded-2xl px-5 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-[#101b66]">
              Back to home
            </button>

            <div className="mt-7 flex items-center gap-3 rounded-2xl bg-[#eef6fc] p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#101b66] text-sm font-bold text-white">i</span>
              <p className="text-xs leading-5 text-slate-600">New cadet accounts are created and managed by the unit administrator.</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
