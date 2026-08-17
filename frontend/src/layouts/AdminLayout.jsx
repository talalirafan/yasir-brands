import { Link, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/reviews', label: 'Reviews' },
];

export default function AdminLayout() {
  const isAdmin = !!localStorage.getItem('adminToken');
  const navigate = useNavigate();
  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-black text-white p-4 flex flex-col">
        <p className="text-[var(--color-gold)] font-semibold mb-4">YSR Admin</p>
        <div className="space-y-2 flex-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="block text-sm py-2 hover:text-[var(--color-gold)]">
              {l.label}
            </Link>
          ))}
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm py-2 text-white/70 hover:text-red-400 border-t border-white/10 pt-4"
        >
          <FiLogOut /> Logout
        </button>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
