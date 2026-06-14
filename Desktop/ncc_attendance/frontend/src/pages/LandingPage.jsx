import Logo from '../components/Logo';

const features = [
  { number: '01', title: 'Cadet management', description: 'Create and maintain cadet profiles with unit-ready credentials.' },
  { number: '02', title: 'Fast attendance', description: 'Record an entire parade day from one clear attendance sheet.' },
  { number: '03', title: 'Personal records', description: 'Give every cadet secure access to their own attendance history.' },
  { number: '04', title: 'Command insights', description: 'Review strength, presence, and trends with focused analytics.' }
];

export default function LandingPage({ onLogin }) {
  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-white/60 bg-white/90 shadow-[0_32px_90px_rgba(17,27,95,.16)] backdrop-blur-xl sm:rounded-[2rem]">
      <div className="relative isolate overflow-hidden bg-[linear-gradient(120deg,#070d35_0%,#111b5f_55%,#1c55c9_100%)] px-5 py-14 text-white sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="absolute -right-24 -top-28 h-96 w-96 rounded-full border-[80px] border-[#2878ff]/25" />
        <div className="absolute bottom-0 left-0 h-1.5 w-3/5 bg-gradient-to-r from-[#f02232] via-[#ff5160] to-transparent" />
        <div className="absolute right-[4%] top-1/2 hidden h-80 w-80 -translate-y-1/2 rounded-full bg-white/5 p-7 ring-1 ring-white/15 lg:block">
          <Logo className="h-full w-full drop-shadow-[0_20px_40px_rgba(0,0,0,.35)]" />
        </div>
        <Logo className="absolute -right-16 top-1/2 h-72 w-72 -translate-y-1/2 opacity-[0.07] lg:hidden" />
        <div className="relative z-10 max-w-3xl">
          <p className="inline-flex items-center gap-3 rounded-full border border-[#5eb8f2]/30 bg-[#5eb8f2]/10 px-4 py-2 text-[0.68rem] font-extrabold uppercase tracking-[0.22em] text-[#a8ddff] sm:text-xs sm:tracking-[0.28em]">
            <span className="h-2 w-2 rounded-full bg-[#f02232] shadow-[0_0_14px_#f02232]" />
            NCC Vardhaman Attendance
          </p>
          <h1 className="mt-7 text-4xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">
            Discipline in action.<br /><span className="bg-gradient-to-r from-[#ff4250] to-[#ff8b94] bg-clip-text text-transparent">Clarity in command.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-blue-100/75 sm:text-lg">
            A professional digital attendance system designed to keep cadet records accurate, accessible, and ready for every parade.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-4">
            <button onClick={onLogin} className="ncc-primary w-full px-8 py-3.5 sm:w-auto">Access the portal</button>
            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.07] px-5 py-3 text-sm font-semibold text-blue-100 backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#5eb8f2]" />
              Admin and cadet access
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-12 px-5 py-12 sm:px-10 lg:grid-cols-[0.65fr_1.35fr] lg:px-16 lg:py-16">
        <div>
          <p className="ncc-kicker">Built for the unit</p>
          <h2 className="mt-4 text-2xl font-extrabold leading-tight text-[#101b66] sm:text-3xl">One dependable place for daily attendance.</h2>
          <p className="mt-4 leading-7 text-slate-600">Simple enough for quick parade entry, structured enough for meaningful reporting.</p>
          <div className="mt-8 flex items-center gap-4 rounded-2xl bg-[#edf6ff] p-4 ring-1 ring-[#d6e8f8]">
            <Logo className="h-14 w-14 shrink-0 drop-shadow-md" />
            <div>
              <p className="font-display font-bold text-[#101b66]">NCC Vardhaman</p>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#1c55c9]">Unity and discipline</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <article key={feature.title} className="group relative overflow-hidden rounded-2xl border border-[#dce7f4] bg-white p-6 shadow-[0_10px_28px_rgba(17,27,95,.06)] transition duration-200 hover:-translate-y-1 hover:border-[#8bb9ee] hover:shadow-[0_18px_38px_rgba(17,27,95,.12)]">
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#f02232] to-[#2878ff] opacity-0 transition group-hover:opacity-100" />
              <span className="font-display text-3xl font-extrabold text-[#dce9f9] transition group-hover:text-[#f02232]">{feature.number}</span>
              <h3 className="mt-3 text-lg font-extrabold text-[#111b5f]">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
