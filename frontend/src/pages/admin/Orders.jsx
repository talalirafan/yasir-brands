import { useEffect, useState } from 'react';
import api from '../../api/client';

const statuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Return Requested', 'Returned'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = () => api.get('/admin/orders').then((res) => setOrders(res.data)).catch(() => {});
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/admin/orders/${id}/status`, { status }).catch(() => {});
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b text-sm text-black/60">
            <th className="py-2">Order #</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border-b">
              <td className="py-2">{o.orderNumber}</td>
              <td>{o.fullName}</td>
              <td>Rs. {o.total?.toLocaleString()}</td>
              <td>
                {o.paymentMethod}
                {o.senderNumber && <div className="text-xs text-black/50">from {o.senderNumber}</div>}
                {o.transactionId && <div className="text-xs text-black/50">TID: {o.transactionId}</div>}
              </td>
              <td>
                <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)} className="border rounded px-2 py-1 text-sm">
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr><td colSpan={5} className="py-6 text-center text-black/50">No orders yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
