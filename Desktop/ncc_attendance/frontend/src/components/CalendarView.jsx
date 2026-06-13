const statusClasses = {
  Present: 'bg-[#2457a7] text-white',
  Absent: 'bg-[#ed1c24] text-white',
  Late: 'bg-[#5795c7] text-white'
};

export default function CalendarView({ attendance }) {
  const dates = attendance.slice(0, 12).map((record) => ({ date: record.date, status: record.status }));

  return (
    <div className="mt-6 space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {dates.map((record) => (
          <div key={record.date} className="rounded-3xl border border-[#d9e6f1] bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{record.date}</p>
            <div className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusClasses[record.status] || 'bg-slate-200 text-slate-800'}`}>
              {record.status}
            </div>
          </div>
        ))}
      </div>
      {attendance.length > 6 && <p className="text-sm text-slate-500">Showing the most recent {dates.length} records.</p>}
    </div>
  );
}
