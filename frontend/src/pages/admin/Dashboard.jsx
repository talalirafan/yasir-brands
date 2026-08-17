import { useEffect, useState } from 'react';
import api from '../../api/client';

const StatCard = ({ label, value }) => (
  <div className="border rounded-lg p-4">
    <p className="text-sm text-black/60">{label}</p>
    <p className="text-2xl font-semibold">{value ?? '—'}</p>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const load = () => api.get('/admin/stats').then((res) => setStats(res.data)).catch(() => {});
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Products" value={stats.totalProducts} />
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Pending Orders" value={stats.pendingOrders} />
        <StatCard label="Delivered Orders" value={stats.deliveredOrders} />
        <StatCard label="Customers" value={stats.totalCustomers} />
        <StatCard label="Reviews" value={stats.totalReviews} />
        <StatCard label="Total Sales" value={stats.totalSales ? `Rs. ${stats.totalSales.toLocaleString()}` : '—'} />
      </div>
    </div>
  );
}
