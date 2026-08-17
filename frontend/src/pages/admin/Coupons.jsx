import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';

const emptyForm = { code: '', discountType: 'percent', discountValue: '', minOrderValue: '' };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get('/coupons').then((res) => setCoupons(res.data)).catch(() => {});
  };

  useEffect(load, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/coupons', {
        code: form.code,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : undefined,
      });
      toast.success('Coupon created');
      setForm(emptyForm);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create coupon');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (c) => {
    await api.patch(`/coupons/${c._id}`, { active: !c.active }).catch(() => {});
    load();
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete coupon "${c.code}"?`)) return;
    await api.delete(`/coupons/${c._id}`).catch(() => {});
    load();
  };

  const inputClass = 'border rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)]';

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Coupons</h1>

      <form onSubmit={onSubmit} className="flex flex-wrap gap-3 items-end border rounded-lg p-4 mb-6 max-w-2xl">
        <div>
          <label className="block text-xs text-black/60 mb-1">Code</label>
          <input required placeholder="EID10" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-black/60 mb-1">Type</label>
          <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className={inputClass}>
            <option value="percent">Percent %</option>
            <option value="fixed">Fixed Rs.</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-black/60 mb-1">Value</label>
          <input required type="number" min="1" placeholder="10" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className={inputClass + ' w-24'} />
        </div>
        <div>
          <label className="block text-xs text-black/60 mb-1">Min order (optional)</label>
          <input type="number" min="0" placeholder="0" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} className={inputClass + ' w-28'} />
        </div>
        <button disabled={saving} className="bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-50">
          {saving ? 'Adding...' : '+ Add Coupon'}
        </button>
      </form>

      <table className="w-full text-left border-collapse max-w-2xl">
        <thead>
          <tr className="border-b text-sm text-black/60">
            <th className="py-2">Code</th><th>Discount</th><th>Min Order</th><th>Status</th><th></th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c._id} className="border-b">
              <td className="py-2 font-medium">{c.code}</td>
              <td>{c.discountType === 'percent' ? `${c.discountValue}%` : `Rs. ${c.discountValue}`}</td>
              <td>{c.minOrderValue ? `Rs. ${c.minOrderValue}` : '—'}</td>
              <td>
                <button
                  onClick={() => toggleActive(c)}
                  className={`text-xs px-2 py-1 rounded-full ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                >
                  {c.active ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td>
                <button onClick={() => remove(c)} className="text-sm text-red-500 underline">Delete</button>
              </td>
            </tr>
          ))}
          {coupons.length === 0 && (
            <tr><td colSpan={5} className="py-6 text-center text-black/50">No coupons yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
