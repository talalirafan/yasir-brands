import { useParams, Link, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiClock } from 'react-icons/fi';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const { state } = useLocation();
  const order = state?.order;
  const paymentMethod = order?.paymentMethod || 'Cash on Delivery';
  const isWallet = paymentMethod === 'EasyPaisa' || paymentMethod === 'JazzCash';

  return (
    <div className="max-w-md mx-auto text-center py-16">
      <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
        <FiCheckCircle size={28} />
      </div>
      <h1 className="text-2xl font-semibold mb-2">Order Placed Successfully!</h1>
      <p className="text-black/60 mb-6">Order #{orderNumber} — {paymentMethod}</p>

      {isWallet && (
        <div className="flex items-start gap-3 border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/5 rounded-lg p-4 text-left mb-6">
          <FiClock className="text-[var(--color-gold)] shrink-0 mt-0.5" />
          <p className="text-sm text-black/70">
            We're verifying your {paymentMethod} payment (Transaction ID:{' '}
            <strong>{order?.transactionId}</strong>). Your order will be confirmed shortly once verified.
          </p>
        </div>
      )}

      <div className="flex gap-4 justify-center">
        <Link to="/orders" className="bg-black text-white px-6 py-2 rounded uppercase text-sm">My Orders</Link>
        <Link to="/shop" className="border px-6 py-2 rounded uppercase text-sm">Continue Shopping</Link>
      </div>
    </div>
  );
}
