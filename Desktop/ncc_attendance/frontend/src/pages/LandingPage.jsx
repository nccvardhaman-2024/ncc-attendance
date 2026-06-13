import Logo from '../components/Logo';

const features = [
  { number: '01', title: 'Cadet management', description: 'Create and maintain cadet profiles with unit-ready credentials.' },
  { number: '02', title: 'Fast attendance', description: 'Record an entire parade day from one clear attendance sheet.' },
  { number: '03', title: 'Personal records', description: 'Give every cadet secure access to their own attendance history.' },
  { number: '04', title: 'Command insights', description: 'Review strength, presence, and trends with focused analytics.' }
];

export default function LandingPage({ onLogin }) {
  return (
    <section className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_28px_90px_rgba(16,27,102,.12)] sm:rounded-[2.5rem]">
      <div className="relative isolate overflow-hidden bg-[#101b66] px-5 py-12 text-white sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <div className="absolute inset-y-0 right-0 w-2/5 bg-[#ed1c24]" />
        <div className="absolute -right-20 top-1/2 h-[32rem] w-[32rem] -translate-y-1/2 rounded-full border-[70px] border-white/10" />
        <Logo className="absolute right-[5%] top-1/2 h-72 w-72 -translate-y-1/2 opacity-95 drop-shadow-2xl max-lg:opacity-10" />
        <div className="relative z-10 max-w-3xl">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#9bc5e6] sm:text-xs sm:tracking-[0.32em]">NCC Vardhaman Attendance</p>
          <h1 className="mt-5 text-3xl font-extrabold leading-[1.08] sm:mt-6 sm:text-5xl lg:text-7xl">
            Discipline in action.<br /><span className="text-[#ff4b52]">Clarity in command.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-blue-100/80 sm:text-lg">
            A professional digital attendance system designed to keep cadet records accurate, accessible, and ready for every parade.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-4">
            <button onClick={onLogin} className="ncc-primary w-full px-8 py-3.5 sm:w-auto">Access the portal</button>
            <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-[#65b5e8]" />
              Admin and cadet access
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-10 px-5 py-10 sm:px-10 sm:py-12 lg:grid-cols-[0.7fr_1.3fr] lg:px-16 lg:py-16">
        <div>
          <p className="ncc-kicker">Built for the unit</p>
          <h2 className="mt-4 text-2xl font-extrabold leading-tight text-[#101b66] sm:text-3xl">One dependable place for daily attendance.</h2>
          <p className="mt-4 leading-7 text-slate-600">Simple enough for quick parade entry, structured enough for meaningful reporting.</p>
          <div className="mt-8 flex items-center gap-4 border-l-4 border-[#ed1c24] pl-5">
            <Logo className="h-12 w-12 shrink-0" />
            <div>
              <p className="font-display font-bold text-[#101b66]">NCC Vardhaman</p>
              <p className="text-sm text-slate-500">Unity and discipline</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <article key={feature.title} className="group rounded-3xl border border-[#d9e6f1] bg-[#f7fbff] p-6 transition hover:-translate-y-1 hover:border-[#8db6d7] hover:shadow-lg">
              <span className="text-xs font-extrabold tracking-[0.2em] text-[#ed1c24]">{feature.number}</span>
              <h3 className="mt-5 text-lg font-extrabold text-[#101b66]">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
