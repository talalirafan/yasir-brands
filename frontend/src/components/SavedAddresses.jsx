import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiMapPin } from 'react-icons/fi';
import api from '../api/client';

const emptyForm = { fullName: '', phone: '', city: '', area: '', address: '', postalCode: '' };

export default function SavedAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get('/addresses').then((res) => setAddresses(res.data)).catch(() => {});
  };

  useEffect(load, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/addresses', form);
      toast.success('Address saved');
      setForm(emptyForm);
      setAdding(false);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    await api.delete(`/addresses/${id}`).catch(() => {});
    load();
  };

  const inputClass = 'w-full border border-black/15 rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)]';

  return (
    <div className="border border-black/10 rounded-xl p-8 shadow-sm bg-white mt-6 text-left">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Saved Addresses</h2>
        <button
          onClick={() => setAdding((a) => !a)}
          className="flex items-center gap-1 text-sm text-[var(--color-gold)] hover:underline"
        >
          <FiPlus size={14} /> {adding ? 'Cancel' : 'Add New'}
        </button>
      </div>

      {adding && (
        <form onSubmit={onSubmit} className="space-y-3 border rounded-lg p-4 mb-4">
          <input required placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass} />
          <input required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
            <input required placeholder="Area" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className={inputClass} />
          </div>
          <textarea required placeholder="Complete address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} rows={2} />
          <input placeholder="Postal code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className={inputClass} />
          <button disabled={saving} className="bg-black text-white px-5 py-2 rounded text-sm uppercase tracking-wide disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Address'}
          </button>
        </form>
      )}

      {addresses.length === 0 && !adding && (
        <p className="text-sm text-black/50">No saved addresses yet.</p>
      )}

      <div className="space-y-3">
        {addresses.map((a) => (
          <div key={a._id} className="flex items-start gap-3 border rounded-lg p-3">
            <FiMapPin className="text-black/40 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-medium">{a.fullName} — {a.phone}</p>
              <p className="text-black/60">{a.address}, {a.area}, {a.city} {a.postalCode}</p>
            </div>
            <button onClick={() => remove(a._id)} className="text-red-500 hover:text-red-600">
              <FiTrash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
