import { useState } from 'react';
import { createCadet } from '../services/api';

export default function AddCadetPage({ token }) {
  const [form, setForm] = useState({ regimentalNumber: '', name: '', unit: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setError('');

    const result = await createCadet(token, form);
    if (result.error) {
      setError(result.error);
      return;
    }

    setMessage(`Cadet ${result.cadet.regimentalNumber} added successfully.`);
    setForm({ regimentalNumber: '', name: '', unit: '', password: '' });
  }

  return (
    <div className="ncc-panel border-t-4 border-[#ed1c24] p-5 sm:p-8">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-bold">Add cadet</p>
        <h1 className="mt-3 text-3xl font-bold text-blue-900">Create a new cadet account</h1>
        <p className="mt-2 text-sm text-slate-700">Enter simple details and assign a login password for the cadet.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-blue-900">Regimental number</label>
          <input
            value={form.regimentalNumber}
            onChange={(e) => setForm({ ...form, regimentalNumber: e.target.value })}
            placeholder="NCC1001"
            className="ncc-input"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-blue-900">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Cadet Name"
            className="ncc-input"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-blue-900">Unit</label>
          <input
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            placeholder="Alpha"
            className="ncc-input"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-blue-900">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Set a password"
            className="ncc-input"
          />
        </div>

        <button className="ncc-primary w-full">
          Add cadet
        </button>

        {message && <p className="text-sm text-blue-700 font-semibold">✓ {message}</p>}
        {error && <p className="text-sm text-red-700 font-semibold">✕ {error}</p>}
      </form>
    </div>
  );
}
