import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';
import api from '../../api/client';

const LOW_STOCK_THRESHOLD = 5;

const StatCard = ({ label, value }) => (
  <div className="border rounded-lg p-4">
    <p className="text-sm text-black/60">{label}</p>
    <p className="text-2xl font-semibold">{value ?? '—'}</p>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    const load = () => {
      api.get('/admin/stats').then((res) => setStats(res.data)).catch(() => {});
      api
        .get('/products')
        .then((res) => setLowStock(res.data.filter((p) => p.stock <= LOW_STOCK_THRESHOLD)))
        .catch(() => {});
    };
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Products" value={stats.totalProducts} />
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Pending Orders" value={stats.pendingOrders} />
        <StatCard label="Delivered Orders" value={stats.deliveredOrders} />
        <StatCard label="Customers" value={stats.totalCustomers} />
        <StatCard label="Reviews" value={stats.totalReviews} />
        <StatCard label="Total Sales" value={stats.totalSales ? `Rs. ${stats.totalSales.toLocaleString()}` : '—'} />
      </div>

      {lowStock.length > 0 && (
        <div className="border border-amber-300 bg-amber-50 rounded-lg p-4 max-w-md">
          <div className="flex items-center gap-2 text-amber-700 font-medium mb-2">
            <FiAlertTriangle /> Low Stock Alert
          </div>
          <div className="space-y-1">
            {lowStock.map((p) => (
              <div key={p._id} className="flex justify-between text-sm">
                <Link to="/admin/products" className="hover:underline">{p.name}</Link>
                <span className={p.stock === 0 ? 'text-red-600 font-medium' : 'text-amber-700'}>
                  {p.stock === 0 ? 'Out of stock' : `Only ${p.stock} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
