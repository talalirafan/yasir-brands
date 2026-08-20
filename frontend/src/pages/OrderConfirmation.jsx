import { useParams, Link, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiArrowRight } from 'react-icons/fi';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const { state } = useLocation();
  const order = state?.order;
  const paymentMethod = order?.paymentMethod || 'Cash on Delivery';
  const isWallet = paymentMethod === 'EasyPaisa' || paymentMethod === 'JazzCash';

  return (
    <div className="max-w-md mx-auto text-center py-16 sm:py-20">
      <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 animate-badge-pop">
        <FiCheckCircle size={28} />
      </div>
      <p className="uppercase tracking-[4px] text-[var(--color-gold)] text-xs mb-2">Thank You</p>
      <h1 className="font-display text-3xl font-semibold mb-2">Order Placed Successfully!</h1>
      <p className="text-black/55 mb-7 text-sm">
        Order <span className="font-medium text-black">#{orderNumber}</span> · {paymentMethod}
      </p>

      {isWallet && (
        <div className="flex items-start gap-3 border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/5 rounded-2xl p-4 text-left mb-7">
          <FiClock className="text-[var(--color-gold)] shrink-0 mt-0.5" />
          <p className="text-sm text-black/70">
            We're verifying your {paymentMethod} payment (Transaction ID:{' '}
            <strong>{order?.transactionId}</strong>). Your order will be confirmed shortly once verified.
          </p>
        </div>
      )}

      <div className="flex gap-3 justify-center flex-wrap">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full uppercase text-xs sm:text-sm tracking-wide font-medium hover:bg-[var(--color-black-soft)] transition-colors"
        >
          My Orders <FiArrowRight size={14} />
        </Link>
        <Link
          to="/shop"
          className="border border-black/20 px-6 py-3 rounded-full uppercase text-xs sm:text-sm tracking-wide hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
