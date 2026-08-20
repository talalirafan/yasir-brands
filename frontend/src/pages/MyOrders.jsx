import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage } from 'react-icons/fi';
import api from '../api/client';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

const statusColor = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  'Out for Delivery': 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
  'Return Requested': 'bg-amber-100 text-amber-700',
  Returned: 'bg-amber-100 text-amber-700',
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    api.get('/orders/my').then((res) => setOrders(res.data)).catch(() => setError(true)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <Loading label="Loading orders" full />;
  if (error) return <ErrorState message="Couldn't load your orders. Please check your internet connection." onRetry={load} full />;
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={FiPackage}
        title="No orders yet"
        message="Once you place an order, it will show up here."
        actionLabel="Start Shopping"
        actionTo="/shop"
      />
    );
  }

  return (
    <div>
      <p className="uppercase tracking-[4px] text-[var(--color-gold)] text-xs mb-1.5">Order History</p>
      <h1 className="font-display text-3xl font-semibold mb-6">My Orders</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <Link
            to={`/orders/${o._id}`}
            key={o._id}
            className="flex justify-between items-center border border-black/10 rounded-2xl p-4 bg-white hover:border-[var(--color-gold)] hover:-translate-y-0.5 transition-all"
          >
            <div className="text-left">
              <p className="font-medium">Order #{o.orderNumber}</p>
              <p className="text-sm text-black/50">{new Date(o.createdAt).toLocaleDateString()} — Rs. {o.total?.toLocaleString()}</p>
            </div>
            <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${statusColor[o.status] || 'bg-gray-100'}`}>{o.status}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
