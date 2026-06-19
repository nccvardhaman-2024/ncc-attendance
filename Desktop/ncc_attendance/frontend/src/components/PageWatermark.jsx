import Logo from './Logo';

export default function PageWatermark() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
      <Logo className="absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.03] sm:h-[28rem] sm:w-[28rem] lg:h-[38rem] lg:w-[38rem] xl:h-[44rem] xl:w-[44rem]" />
      <div className="absolute left-0 top-1/3 h-px w-1/3 bg-gradient-to-r from-[#8b5cf6]/10 to-transparent" />
      <div className="absolute right-0 top-1/4 h-px w-1/2 bg-gradient-to-l from-[#06b6d4]/10 to-transparent" />
    </div>
  );
}
