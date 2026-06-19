export default function AttendanceTable({ records, isCadetView = false }) {
  if (!records || records.length === 0) {
    return <p className="mt-6 text-sm text-slate-500 font-medium">No attendance records yet.</p>;
  }

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
            <tr>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-xs text-slate-500">Date</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-xs text-slate-500">Status</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-xs text-slate-500">Note</th>
              {!isCadetView && <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-xs text-slate-500">Recorded by</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {records.map((record) => (
              <tr key={record.id} className="transition hover:bg-slate-50/50">
                <td className="px-5 py-4 text-slate-800 font-medium">{record.date}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold border ${
                    record.status === 'Present' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                      : record.status === 'Late' 
                        ? 'bg-amber-50 text-amber-700 border-amber-200/60' 
                        : 'bg-rose-50 text-rose-700 border-rose-200/60'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-600 font-medium">{record.note || '-'}</td>
                {!isCadetView && <td className="px-5 py-4 text-slate-600 font-medium">{record.recordedBy}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
