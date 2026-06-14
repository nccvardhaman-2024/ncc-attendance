export default function AttendanceTable({ records, isCadetView = false }) {
  if (!records || records.length === 0) {
    return <p className="mt-6 text-sm text-slate-600">No attendance records yet.</p>;
  }

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-[#d9e6f1] bg-white shadow-[0_12px_30px_rgba(17,27,95,.07)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-[linear-gradient(110deg,#070d35,#111b5f_65%,#1c55c9)] text-white">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Note</th>
            {!isCadetView && <th className="px-4 py-3">Recorded by</th>}
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="border-t border-slate-100 transition hover:bg-[#f1f7ff] last:border-b">
              <td className="px-4 py-4 text-slate-800">{record.date}</td>
              <td className="px-4 py-4">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${record.status === 'Present' ? 'bg-blue-100 text-blue-800' : record.status === 'Late' ? 'bg-sky-100 text-sky-800' : 'bg-red-100 text-red-700'}`}>
                  {record.status}
                </span>
              </td>
              <td className="px-4 py-4 text-slate-600">{record.note || '-'}</td>
              {!isCadetView && <td className="px-4 py-4 text-slate-600">{record.recordedBy}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
