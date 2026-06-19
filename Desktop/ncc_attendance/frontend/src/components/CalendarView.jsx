const statusClasses = {
  Present: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  Absent: 'bg-rose-50 text-rose-700 border-rose-200/60',
  Late: 'bg-amber-50 text-amber-700 border-amber-200/60'
};

export default function CalendarView({ attendance }) {
  const dates = attendance.slice(0, 12).map((record) => ({ date: record.date, status: record.status }));

  return (
    <div className="mt-6 space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {dates.map((record) => (
          <div key={record.date} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#4f46e5]/30 hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">{record.date}</p>
            <div className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold border ${statusClasses[record.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
              {record.status}
            </div>
          </div>
        ))}
      </div>
      {attendance.length > 12 && <p className="text-sm font-medium text-slate-500">Showing the most recent {dates.length} records.</p>}
    </div>
  );
}
