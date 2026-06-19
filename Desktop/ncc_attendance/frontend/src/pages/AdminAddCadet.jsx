import { useState } from 'react';
import { createCadet } from '../services/api';

export default function AddCadetPage({ token }) {
  const [form, setForm] = useState({ regimentalNumber: '', name: '', rollno: '', unit: '', rank: 'Cadet', password: '' });
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
    setForm({ regimentalNumber: '', name: '', rollno: '', unit: '', rank: 'Cadet', password: '' });
  }

  return (
    <div className="ncc-panel p-5 sm:p-8 animate-fade-up">
      <div className="mb-6">
        <p className="ncc-kicker">Add cadet</p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Create a new cadet account</h1>
        <p className="mt-2 text-sm text-slate-600 font-medium">Enter simple details and assign a login password for the cadet.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700">Regimental number</label>
          <input
            value={form.regimentalNumber}
            onChange={(e) => setForm({ ...form, regimentalNumber: e.target.value })}
            placeholder="NCC1001"
            className="ncc-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Cadet Name"
            className="ncc-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">Roll No</label>
          <input
            value={form.rollno}
            onChange={(e) => setForm({ ...form, rollno: e.target.value })}
            placeholder="Enter the Roll No"
            className="ncc-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">Unit</label>
          <input
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            placeholder="Alpha"
            className="ncc-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">Rank</label>
          <select
            value={form.rank}
            onChange={(e) => setForm({ ...form, rank: e.target.value })}
            className="ncc-input mt-2 bg-white"
            required
          >
            <option value="Cadet">Cadet (CDT)</option>
            <option value="Lance Corporal">Lance Corporal (L/CPL)</option>
            <option value="Corporal">Corporal (CPL)</option>
            <option value="Sergeant">Sergeant (SGT)</option>
            <option value="Company Quarter Master Sergeant">Company Quarter Master Sergeant (CQMS)</option>
            <option value="Company Sergeant Major">Company Sergeant Major (CSM)</option>
            <option value="Junior Under Officer">Junior Under Officer (JUO)</option>
            <option value="Cadet Senior Under Officer">Cadet Senior Under Officer (CSUO)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Set a password"
            className="ncc-input"
            required
          />
        </div>

        <button className="ncc-primary w-full">
          Add cadet
        </button>

        {message && <p className="text-sm text-emerald-600 font-semibold">✓ {message}</p>}
        {error && <p className="text-sm text-rose-600 font-semibold">✕ {error}</p>}
      </form>
    </div>
  );
}
