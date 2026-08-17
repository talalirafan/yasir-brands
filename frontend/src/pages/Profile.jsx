import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPackage, FiLogOut } from 'react-icons/fi';
import api from '../api/client';
import { useAuthStore } from '../store/cartStore';
import SavedAddresses from '../components/SavedAddresses';

export default function Profile() {
  const { user, logout, login, token } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="mb-4">Please log in to view your profile.</p>
        <Link to="/login" className="bg-black text-white px-6 py-2 rounded uppercase text-sm">
          Login
        </Link>
      </div>
    );
  }

  const initials = user.name
    ?.split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.patch('/users/me', form);
      login({ ...user, name: data.name, phone: data.phone }, token);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="border border-black/10 rounded-xl p-8 shadow-sm bg-white">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-black text-[var(--color-gold)] flex items-center justify-center text-xl font-semibold shrink-0">
            {initials || 'U'}
          </div>
          <div className="text-left">
            <h1 className="text-xl font-semibold">{user.name}</h1>
            <p className="text-sm text-black/50">{user.email}</p>
          </div>
        </div>

        <form onSubmit={onSave} className="space-y-4 text-left">
          <div>
            <label className="block text-sm text-black/60 mb-1">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-black/15 rounded px-3 py-2.5 focus:outline-none focus:border-[var(--color-gold)]"
            />
          </div>
          <div>
            <label className="block text-sm text-black/60 mb-1">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-black/15 rounded px-3 py-2.5 focus:outline-none focus:border-[var(--color-gold)]"
            />
          </div>
          <div>
            <label className="block text-sm text-black/60 mb-1">Email</label>
            <input
              value={user.email}
              disabled
              className="w-full border border-black/10 rounded px-3 py-2.5 bg-black/5 text-black/50"
            />
          </div>
          <button
            disabled={saving}
            className="bg-black text-white px-6 py-2.5 rounded uppercase text-sm tracking-wide hover:bg-black/85 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <div className="border-t border-black/10 mt-8 pt-6 flex flex-col sm:flex-row gap-3">
          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 flex-1 border border-black/15 rounded py-2.5 text-sm uppercase tracking-wide hover:bg-black/5 transition-colors"
          >
            <FiPackage /> My Orders
          </Link>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 flex-1 border border-red-200 text-red-600 rounded py-2.5 text-sm uppercase tracking-wide hover:bg-red-50 transition-colors"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      <SavedAddresses />
    </div>
  );
}
