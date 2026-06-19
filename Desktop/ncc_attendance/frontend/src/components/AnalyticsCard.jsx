export default function AnalyticsCard({ item }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:border-indigo-500/20 hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{item.name}</p>
          <h3 className="mt-1 text-xl font-bold text-slate-900">{item.regimentalNumber}</h3>
        </div>
        <p className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold border border-indigo-100 text-indigo-700">{item.totals.total} records</p>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 text-center">
          <p className="text-sm font-semibold text-slate-500">Present</p>
          <p className="mt-2 text-xl font-bold text-[#22c55e]">{item.totals.present}</p>
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 text-center">
          <p className="text-sm font-semibold text-slate-500">Absent</p>
          <p className="mt-2 text-xl font-bold text-[#ef4444]">{item.totals.absent}</p>
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 text-center">
          <p className="text-sm font-semibold text-slate-500">Late</p>
          <p className="mt-2 text-xl font-bold text-[#f59e0b]">{item.totals.late}</p>
        </div>
      </div>
    </div>
  );
}
