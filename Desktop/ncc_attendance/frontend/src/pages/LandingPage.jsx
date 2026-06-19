import vceLogo from '../assets/vce-logo.png';
import nccLogo from '../assets/ncc-vardhaman-logo.png';
import Logo from '../components/Logo';

const features = [
  { number: '01', title: 'Cadet management', description: 'Create and maintain cadet profiles with unit-ready credentials.' },
  { number: '02', title: 'Fast attendance', description: 'Record an entire parade day from one clear attendance sheet.' },
  { number: '03', title: 'Personal records', description: 'Give every cadet secure access to their own attendance history.' },
  { number: '04', title: 'Command insights', description: 'Review strength, presence, and trends with focused analytics.' }
];

export default function LandingPage({ onLogin }) {
  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/95 shadow-sm sm:rounded-[2rem]">
      {/* Hero Section with 2-column layout and rich NCC colors */}
      <div className="relative isolate overflow-hidden bg-gradient-to-br from-slate-50/90 via-[#172554]/5 to-slate-100/50 px-5 py-14 text-slate-800 border-b border-slate-200/60 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        
        {/* Background glow orbs - NCC tri-color theme */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-gradient-to-br from-[var(--ncc-navy)]/8 via-[var(--ncc-sky)]/8 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-1/4 h-[30rem] w-[30rem] rounded-full bg-gradient-to-br from-[var(--ncc-sky)]/8 via-[var(--ncc-red)]/6 to-transparent blur-3xl" />

        {/* Official NCC tri-color accent line at bottom (Red, Navy Blue, Sky Blue) */}
        <div className="absolute bottom-0 left-0 h-1.5 w-full bg-gradient-to-r from-[var(--ncc-red)] via-[var(--ncc-navy)] to-[var(--ncc-sky)]" />
        
        <div className="relative z-10 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          
          {/* Left Column: Hero Content */}
          <div className="max-w-3xl">
            {/* Mobile NCC Logo - no float animation, clean highlighting */}
            <div className="mb-8 flex justify-start sm:mb-10 lg:hidden">
              <div className="h-24 rounded-2xl bg-white p-3 shadow-md border-2 border-[var(--ncc-navy)]/10 ring-4 ring-[var(--ncc-navy)]/5 transition hover:scale-105 duration-300">
                <img src={nccLogo} alt="NCC Vardhaman" className="h-full object-contain" />
              </div>
            </div>

            <p className="inline-flex items-center gap-3 rounded-full border border-[var(--ncc-sky)]/20 bg-[var(--ncc-sky)]/5 px-4 py-2 text-[0.68rem] font-extrabold uppercase tracking-[0.22em] text-[var(--ncc-navy)] shadow-sm sm:text-xs sm:tracking-[0.28em]">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--ncc-red)] shadow-[0_0_8px_rgba(216,35,42,0.4)] animate-pulse" />
              NCC Vardhaman Attendance
            </p>
            <h1 className="mt-7 text-4xl font-extrabold leading-[1.05] text-slate-900 sm:text-6xl lg:text-7xl">
              Discipline in action.<br />
              <span className="bg-gradient-to-r from-[var(--ncc-navy)] via-[var(--ncc-navy)] to-[var(--ncc-sky)] bg-clip-text text-transparent">Clarity in command.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              A professional digital attendance system designed to keep cadet records accurate, accessible, and ready for every parade.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-4">
              <button 
                onClick={onLogin} 
                className="w-full rounded-xl bg-gradient-to-r from-[var(--ncc-navy)] to-blue-800 hover:from-blue-800 hover:to-blue-900 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 sm:w-auto"
              >
                Access the portal
              </button>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm">
                <span className="h-2.5 w-2.5 rounded-sm bg-[var(--ncc-navy)]" />
                Admin and cadet access
              </div>
            </div>
          </div>

          {/* Right Column: Large NCC Logo for Desktop - Centered vertically in layout */}
          <div className="hidden justify-center lg:flex relative">
            {/* Layered brand glows for rendering high prominence without dark capsules */}
            <div className="absolute -inset-8 rounded-full bg-gradient-to-tr from-[var(--ncc-navy)]/15 via-[var(--ncc-sky)]/15 to-[var(--ncc-red)]/10 blur-2xl opacity-80" />
            <div className="absolute inset-0 rounded-full border border-[var(--ncc-navy)]/10 scale-105" />
            <div className="absolute inset-4 rounded-full border border-dashed border-[var(--ncc-red)]/10 scale-105" />
            
            <div className="relative z-10 rounded-[2.5rem] bg-white/40 p-8 border border-white/80 shadow-[0_20px_50px_rgba(23,37,84,0.06)] backdrop-blur-md transition-all duration-500 hover:scale-105 hover:bg-white/60 hover:shadow-[0_25px_60px_rgba(23,37,84,0.12)]">
              <img src={nccLogo} alt="NCC Vardhaman" className="h-72 w-72 object-contain" />
            </div>
          </div>

        </div>
      </div>

      {/* Features Grid Section */}
      <div className="grid gap-12 px-5 py-12 sm:px-10 lg:grid-cols-[0.65fr_1.35fr] lg:px-16 lg:py-16">
        <div>
          <p className="ncc-kicker">Built for the unit</p>
          <h2 className="mt-4 text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">One dependable place for daily attendance.</h2>
          <p className="mt-4 leading-7 text-slate-600 font-medium">Simple enough for quick parade entry, structured enough for reporting.</p>
          <div className="mt-8 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/50 p-4 ring-1 ring-[var(--ncc-sky)]/15">
            <Logo className="h-14 w-14 shrink-0 drop-shadow-sm transition-transform duration-500 hover:rotate-12" />
            <div>
              <p className="font-display font-bold text-slate-900">NCC Vardhaman</p>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ncc-navy)]">Unity and discipline</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <article key={feature.title} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1.5 hover:border-[var(--ncc-navy)]/30 hover:shadow-[0_15px_30px_rgba(23,37,84,0.04)]">
              {/* NCC Tri-color sidebar highlight on hover */}
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[var(--ncc-red)] via-[var(--ncc-navy)] to-[var(--ncc-sky)]" opacity-0 transition group-hover:opacity-100 />
              <span className="font-display text-3xl font-extrabold text-slate-200 transition duration-300 group-hover:bg-gradient-to-r group-hover:from-[var(--ncc-navy)] group-hover:to-[var(--ncc-sky)] group-hover:bg-clip-text group-hover:text-transparent">{feature.number}</span>
              <h3 className="mt-3 text-lg font-extrabold text-slate-900 group-hover:text-[var(--ncc-navy)] transition-colors duration-250">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 font-medium">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
