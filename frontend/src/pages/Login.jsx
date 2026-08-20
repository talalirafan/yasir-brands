import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiLock, FiMail } from 'react-icons/fi';
import api from '../api/client';
import { useAuthStore } from '../store/cartStore';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      toast.success('Welcome back!');
      navigate(redirect);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid email/phone or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto py-16">
      <div className="border border-black/10 rounded-2xl p-8 shadow-sm bg-white">
        <p className="uppercase tracking-[4px] text-[var(--color-gold)] text-xs text-center mb-2">
          Welcome Back
        </p>
        <h1 className="font-display text-2xl font-semibold mb-6 text-center">Login</h1>
        <form onSubmit={onSubmit} className="space-y-4 text-left">
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
            <input
              required
              type="text"
              placeholder="Email or phone"
              autoComplete="username"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-black/15 rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
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
              className="w-full border border-black/15 rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-full uppercase text-sm tracking-wide font-medium hover:bg-[var(--color-black-soft)] transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm mt-6 text-black/60">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[var(--color-gold)] underline underline-offset-4">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
