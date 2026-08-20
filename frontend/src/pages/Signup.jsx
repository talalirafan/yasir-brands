import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi';
import api from '../api/client';
import { useAuthStore } from '../store/cartStore';

const inputClass =
  'w-full border border-black/15 rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:border-[var(--color-gold)] transition-colors';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', form);
      login(data.user, data.token);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto py-16">
      <div className="border border-black/10 rounded-2xl p-8 shadow-sm bg-white">
        <p className="uppercase tracking-[4px] text-[var(--color-gold)] text-xs text-center mb-2">
          Join Yasir Fragrances
        </p>
        <h1 className="font-display text-2xl font-semibold mb-6 text-center">Sign Up</h1>
        <form onSubmit={onSubmit} className="space-y-4 text-left">
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
            <input
              required
              placeholder="Full name"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
            <input
              required
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
            <input
              required
              placeholder="Phone"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
            <input
              required
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
            <input
              required
              type="password"
              placeholder="Confirm password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className={inputClass}
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-full uppercase text-sm tracking-wide font-medium hover:bg-[var(--color-black-soft)] transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-sm mt-6 text-black/60">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--color-gold)] underline underline-offset-4">Login</Link>
        </p>
      </div>
    </div>
  );
}
