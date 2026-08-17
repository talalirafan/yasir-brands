import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import OrderTimeline from '../components/OrderTimeline';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(false);

  const load = () => {
    setError(false);
    setOrder(null);
    api.get(`/orders/${id}`).then((res) => setOrder(res.data)).catch(() => setError(true));
  };

  useEffect(load, [id]);

  if (error) return <ErrorState message="Couldn't load this order. Please check your internet connection." onRetry={load} full />;
  if (!order) return <Loading label="Loading order" full />;

  return (
    <div className="max-w-2xl mx-auto text-left">
      <h1 className="text-2xl font-semibold mb-1">Order #{order.orderNumber}</h1>
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
      <p className="text-right font-semibold text-lg mt-4">Total: Rs. {order.total?.toLocaleString()}</p>
    </div>
  );
}
