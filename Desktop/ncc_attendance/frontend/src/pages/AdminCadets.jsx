import { useEffect, useMemo, useState } from 'react';
import { fetchCadets, updateCadet } from '../services/api';

export default function CadetListPage({ token }) {
  const [cadets, setCadets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedCadet, setSelectedCadet] = useState(null);
  const [editForm, setEditForm] = useState({ regimentalNumber: '', name: '', unit: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCadets(token).then((res) => {
      setCadets(res.cadets || []);
      setLoading(false);
    });
  }, [token]);

  function refreshCadets() {
    setLoading(true);
    fetchCadets(token).then((res) => {
      setCadets(res.cadets || []);
      setLoading(false);
    });
  }

  function handleEditClick(cadet) {
    setSelectedCadet(cadet);
    setEditForm({
      regimentalNumber: cadet.regimentalNumber,
      name: cadet.name,
      unit: cadet.unit,
      password: ''
    });
    setMessage('');
    setError('');
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!selectedCadet) return;

    const payload = {
      regimentalNumber: editForm.regimentalNumber,
      name: editForm.name,
      unit: editForm.unit,
      password: editForm.password
    };

    const result = await updateCadet(token, selectedCadet.regimentalNumber, payload);
    if (result.error) {
      setError(result.error);
      return;
    }

    setMessage('Cadet updated successfully.');
    setSelectedCadet(null);
    setEditForm({ regimentalNumber: '', name: '', unit: '', password: '' });
    refreshCadets();
  }

  const batchOptions = useMemo(() => {
    const batches = cadets
      .map((cadet) => {
        const match = cadet.regimentalNumber?.match(/(20\d{2})/);
        return match ? match[0] : null;
      })
      .filter(Boolean);
    return Array.from(new Set(batches)).sort();
  }, [cadets]);

  const sortedCadets = useMemo(() => {
    return [...cadets].sort((a, b) => {
      const aMatch = a.regimentalNumber?.match(/(\d{4})$/);
      const bMatch = b.regimentalNumber?.match(/(\d{4})$/);
      const aValue = aMatch ? Number(aMatch[1]) : 0;
      const bValue = bMatch ? Number(bMatch[1]) : 0;
      return aValue - bValue;
    });
  }, [cadets]);

  const filteredCadets = useMemo(() => {
    if (selectedBatch === 'all') return sortedCadets;
    return sortedCadets.filter((cadet) => {
      const match = cadet.regimentalNumber?.match(/(20\d{2})/);
      return match?.[0] === selectedBatch;
    });
  }, [selectedBatch, sortedCadets]);

  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-lg border-t-4 border-yellow-500 sm:p-8">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-bold">Cadet list</p>
        <h1 className="mt-3 text-3xl font-bold text-blue-900">View all cadets</h1>
        <p className="mt-2 text-sm text-slate-700">Check each cadet and use their regimental number for attendance marking.</p>
      </div>

      {selectedCadet && (
        <div className="mb-8 rounded-3xl border border-slate-200 bg-blue-50 p-4 border-l-4 border-yellow-500 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-600">Edit cadet credentials</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">{selectedCadet.name}</h2>
            </div>
            <button onClick={() => setSelectedCadet(null)} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
              Cancel
            </button>
          </div>

          {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
          {message && <p className="mt-4 text-sm text-emerald-700">{message}</p>}

          <form onSubmit={handleUpdate} className="mt-6 grid gap-4 lg:grid-cols-2">
            <label className="block text-sm text-slate-700">
              Regimental number
              <input
                name="regimentalNumber"
                value={editForm.regimentalNumber}
                onChange={handleInputChange}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500"
              />
            </label>
            <label className="block text-sm text-slate-700">
              Name
              <input
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500"
              />
            </label>
            <label className="block text-sm text-slate-700">
              Unit
              <input
                name="unit"
                value={editForm.unit}
                onChange={handleInputChange}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500"
              />
            </label>
            <label className="block text-sm text-slate-700">
              New password
              <input
                name="password"
                type="password"
                value={editForm.password}
                onChange={handleInputChange}
                placeholder="Leave blank to keep current password"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500"
              />
            </label>
            <div className="lg:col-span-2">
              <button type="submit" className="w-full rounded-3xl bg-yellow-500 px-6 py-3 text-sm font-bold text-blue-900 transition hover:bg-yellow-400 shadow-md sm:w-auto">
                Save changes
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-600">Loading cadets...</p>
      ) : cadets.length === 0 ? (
        <p className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">You haven't added any cadets yet.</p>
      ) : (
        <>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-600">Filter by batch</p>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="mt-2 w-full rounded-2xl border bg-white px-4 py-2 text-sm shadow-sm sm:w-auto"
              >
                <option value="all">All batches</option>
                {batchOptions.map((batch) => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
            </div>
            <p className="text-sm text-slate-500">Sorted by regimental number suffix (last 4 digits)</p>
          </div>

          {filteredCadets.length === 0 ? (
            <p className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">No cadets found for the selected batch.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCadets.map((cadet) => (
                <div key={cadet.regimentalNumber} className="rounded-3xl border border-slate-200 bg-blue-50 p-5 border-l-4 border-yellow-500">
                  <div className="flex flex-col items-start gap-3 min-[420px]:flex-row min-[420px]:justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{cadet.name}</p>
                      <p className="mt-2 break-all text-sm text-slate-600">Regimental number: {cadet.regimentalNumber}</p>
                      <p className="text-sm text-slate-600">Unit: {cadet.unit}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEditClick(cadet)}
                      className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Today: {cadet.todayStatus}</span>
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-800 font-bold border border-yellow-500">{cadet.totals.percentage}% attendance</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
