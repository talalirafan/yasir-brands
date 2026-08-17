import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/client';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import OrderTimeline from '../components/OrderTimeline';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = () => {
    setError(false);
    setOrder(null);
    api.get(`/orders/${id}`).then((res) => setOrder(res.data)).catch(() => setError(true));
  };

  useEffect(load, [id]);

  const cancelOrder = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setBusy(true);
    try {
      const { data } = await api.patch(`/orders/${id}/cancel`);
      setOrder(data);
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to cancel order');
    } finally {
      setBusy(false);
    }
  };

  const requestReturn = async () => {
    const reason = window.prompt('Why are you returning this order?');
    if (!reason) return;
    setBusy(true);
    try {
      const { data } = await api.patch(`/orders/${id}/return`, { reason });
      setOrder(data);
      toast.success('Return request submitted');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit return request');
    } finally {
      setBusy(false);
    }
  };

  if (error) return <ErrorState message="Couldn't load this order. Please check your internet connection." onRetry={load} full />;
  if (!order) return <Loading label="Loading order" full />;

  const canCancel = ['Pending', 'Confirmed'].includes(order.status);
  const canReturn = order.status === 'Delivered';

  return (
    <div className="max-w-2xl mx-auto text-left">
      <div className="flex items-start justify-between mb-1">
        <h1 className="text-2xl font-semibold">Order #{order.orderNumber}</h1>
        {canCancel && (
          <button onClick={cancelOrder} disabled={busy} className="text-sm text-red-500 hover:underline disabled:opacity-50">
            Cancel Order
          </button>
        )}
        {canReturn && (
          <button onClick={requestReturn} disabled={busy} className="text-sm text-[var(--color-gold)] hover:underline disabled:opacity-50">
            Request Return
          </button>
        )}
      </div>
      <p className="text-sm text-black/50 mb-6">{new Date(order.createdAt).toLocaleDateString()}</p>

      <div className="border rounded-lg p-5 mb-6">
        <OrderTimeline status={order.status} />
      </div>

      <p className="mb-2">
        <strong>Payment:</strong> {order.paymentMethod}
        {order.senderNumber && ` (sent from ${order.senderNumber})`}
      </p>
      {order.transactionId && (
        <p className="mb-2 text-sm text-black/60"><strong>Transaction ID:</strong> {order.transactionId}</p>
      )}
      <p className="mb-4"><strong>Address:</strong> {order.address}, {order.area}, {order.city}</p>
      <div className="border rounded-lg divide-y">
        {order.items?.map((item, idx) => (
          <div key={idx} className="flex justify-between p-3">
            <span>{item.name} x{item.qty}</span>
            <span>Rs. {(item.price * item.qty).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="text-right mt-4 space-y-1">
        {order.discount > 0 && (
          <p className="text-sm text-green-600">Coupon discount: -Rs. {order.discount.toLocaleString()}</p>
        )}
        <p className="font-semibold text-lg">Total: Rs. {order.total?.toLocaleString()}</p>
      </div>
    </div>
  );
}
