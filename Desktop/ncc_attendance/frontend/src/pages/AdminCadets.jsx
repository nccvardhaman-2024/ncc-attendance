import { useEffect, useMemo, useState } from 'react';
import { fetchCadets, updateCadet } from '../services/api';
import RankInsignia from '../components/RankInsignia';

export default function CadetListPage({ token }) {
  const [cadets, setCadets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedCadet, setSelectedCadet] = useState(null);
  const [editForm, setEditForm] = useState({ regimentalNumber: '', name: '', unit: '', rank: 'Cadet', password: '' });
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
      rank: cadet.rank || 'Cadet',
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
      rank: editForm.rank,
      password: editForm.password
    };

    const result = await updateCadet(token, selectedCadet.regimentalNumber, payload);
    if (result.error) {
      setError(result.error);
      return;
    }

    setMessage('Cadet updated successfully.');
    setSelectedCadet(null);
    setEditForm({ regimentalNumber: '', name: '', unit: '', rank: 'Cadet', password: '' });
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
    <div className="ncc-panel sm:p-8">
      <div className="mb-6">
        <p className="ncc-kicker">Cadet list</p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900">View all cadets</h1>
        <p className="mt-2 text-sm text-slate-600 font-medium">Check each cadet and use their regimental number for attendance marking.</p>
      </div>

      {selectedCadet && (
        <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 border-l-4 border-l-[#8b5cf6] sm:p-6 animate-fade-up">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Edit cadet credentials</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">{selectedCadet.name}</h2>
            </div>
            <button onClick={() => setSelectedCadet(null)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 shadow-sm">
              Cancel
            </button>
          </div>

          {error && <p className="mt-4 text-sm text-rose-600 font-semibold">{error}</p>}
          {message && <p className="mt-4 text-sm text-emerald-600 font-semibold">{message}</p>}

          <form onSubmit={handleUpdate} className="mt-6 grid gap-4 lg:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700">
              Regimental number
              <input
                name="regimentalNumber"
                value={editForm.regimentalNumber}
                onChange={handleInputChange}
                className="ncc-input mt-2"
                required
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Name
              <input
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
                className="ncc-input mt-2"
                required
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Unit
              <input
                name="unit"
                value={editForm.unit}
                onChange={handleInputChange}
                className="ncc-input mt-2"
                required
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Rank
              <select
                name="rank"
                value={editForm.rank}
                onChange={handleInputChange}
                className="ncc-input mt-2 bg-white"
                required
              >
                <option value="Cadet">Cadet (CDT)</option>
                <option value="Lance Corporal">Lance Corporal (L/CPL)</option>
                <option value="Corporal">Corporal (CPL)</option>
                <option value="Sergeant">Sergeant (SGT)</option>
                <option value="Cadet Under Officer">Cadet Under Officer (CUO)</option>
                <option value="Cadet Senior Under Officer">Cadet Senior Under Officer (CSUO)</option>
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              New password
              <input
                name="password"
                type="password"
                value={editForm.password}
                onChange={handleInputChange}
                placeholder="Leave blank to keep current password"
                className="ncc-input mt-2"
              />
            </label>
            <div className="lg:col-span-2">
              <button type="submit" className="ncc-primary w-full sm:w-auto !rounded-xl !py-3">
                Save changes
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500 font-medium">Loading cadets...</p>
      ) : cadets.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-sm text-slate-500 font-medium">You haven't added any cadets yet.</p>
      ) : (
        <>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Filter by batch</p>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition-all duration-200 hover:border-slate-300 focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10 sm:w-auto shadow-sm"
              >
                <option value="all">All batches</option>
                {batchOptions.map((batch) => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sorted by regimental number suffix</p>
          </div>

          {filteredCadets.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-sm text-slate-500 font-medium">No cadets found for the selected batch.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCadets.map((cadet) => (
                <div key={cadet.regimentalNumber} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 border-l-4 border-l-[var(--ncc-red)] shadow-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:border-[var(--ncc-navy)]/20 hover:shadow-md">
                  <div className="flex gap-4">
                    <RankInsignia rank={cadet.rank} className="w-10 h-14 shrink-0 shadow-sm rounded bg-slate-50/50" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 flex items-center gap-1.5 flex-wrap">
                        {cadet.name}
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--ncc-gold)] bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                          {cadet.rank === 'Cadet' ? 'CDT' : cadet.rank === 'Lance Corporal' ? 'L/CPL' : cadet.rank === 'Corporal' ? 'CPL' : cadet.rank === 'Sergeant' ? 'SGT' : cadet.rank === 'Cadet Under Officer' ? 'CUO' : 'CSUO'}
                        </span>
                      </p>
                      <p className="mt-1 break-all text-xs text-slate-500 font-bold uppercase tracking-wider">Regimental No: {cadet.regimentalNumber}</p>
                      <p className="text-sm text-slate-600 font-medium">Unit: {cadet.unit}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-slate-600">Today: {cadet.todayStatus}</span>
                      <span className="rounded-full bg-[var(--ncc-navy)]/5 text-[var(--ncc-navy)] px-2.5 py-1 font-bold border border-[var(--ncc-navy)]/10">{cadet.totals.percentage}% attendance</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEditClick(cadet)}
                      className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:text-slate-900 shadow-sm"
                    >
                      Edit
                    </button>
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
