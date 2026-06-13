export default function AnalyticsCard({ item }) {
  return (
    <div className="rounded-3xl border border-[#d9e6f1] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{item.name}</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">{item.regimentalNumber}</h3>
        </div>
        <p className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{item.totals.total} records</p>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl bg-slate-50 p-4 text-center">
          <p className="text-sm text-slate-500">Present</p>
          <p className="mt-2 text-xl font-semibold text-blue-700">{item.totals.present}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4 text-center">
          <p className="text-sm text-slate-500">Absent</p>
          <p className="mt-2 text-xl font-semibold text-rose-700">{item.totals.absent}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4 text-center">
          <p className="text-sm text-slate-500">Late</p>
          <p className="mt-2 text-xl font-semibold text-sky-700">{item.totals.late}</p>
        </div>
      </div>
    </div>
  );
}
