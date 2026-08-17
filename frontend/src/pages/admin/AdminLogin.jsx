import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiLock, FiMail } from 'react-icons/fi';
import api from '../../api/client';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/admin/login', form);
      localStorage.setItem('adminToken', data.token);
      toast.success('Welcome, Admin');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid md:grid-cols-2 bg-black">
      {/* Left: brand photo */}
      <div className="relative hidden md:block overflow-hidden">
        <img
          src="/team/founder-2.jpg"
          alt="YSR Fragrances"
          className="absolute inset-0 w-full h-full object-cover grayscale-[30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
        <div className="relative h-full flex flex-col justify-end p-10 text-left">
          <p className="uppercase tracking-[6px] text-[var(--color-gold)] text-xs mb-3">
            YSR Fragrances
          </p>
          <h2 className="text-white text-3xl font-semibold leading-tight mb-2">
            Manage the store,<br />own the experience.
          </h2>
          <p className="text-white/60 text-sm max-w-sm">
            Orders, products and customers — all in one place.
          </p>
        </div>
      </div>

      {/* Right: login form */}
      <div className="flex items-center justify-center px-6 py-16 bg-[var(--color-cream)]">
        <div className="w-full max-w-sm">
          <p className="uppercase tracking-[4px] text-[var(--color-gold)] text-xs text-center mb-2">
            Admin Access
          </p>
          <h1 className="text-2xl font-semibold mb-8 text-center">Admin Login</h1>
          <form onSubmit={onSubmit} className="space-y-4 text-left">
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
              <input
                required
                type="email"
                placeholder="Admin email"
                autoComplete="username"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-black/15 rounded pl-10 pr-3 py-2.5 bg-white focus:outline-none focus:border-[var(--color-gold)]"
              />
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
              <input
                required
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-black/15 rounded pl-10 pr-3 py-2.5 bg-white focus:outline-none focus:border-[var(--color-gold)]"
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-black text-white py-2.5 rounded uppercase text-sm tracking-wide hover:bg-black/85 transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-center text-xs text-black/40 mt-8">
            Restricted area — authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}
