import { Link } from 'react-router-dom';
import { FiShoppingBag, FiMinus, FiPlus, FiTrash2, FiTruck, FiCheck } from 'react-icons/fi';
import { useCartStore } from '../store/cartStore';
import { showRemovedToast } from '../utils/cartToasts';
import ProductImage from '../components/ProductImage';
import EmptyState from '../components/EmptyState';

const FREE_DELIVERY_THRESHOLD = 5000;

export default function Cart() {
  const { items, removeItem, updateQty, addItem } = useCartStore();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = items.length === 0 ? 0 : subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 250;
  const total = subtotal + delivery;
  const remainingForFreeDelivery = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);
  const progressPct = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);

  const onRemove = (item) => {
    removeItem(item._id);
    showRemovedToast(item.name, () => addItem(item, item.qty));
  };

  if (items.length === 0) {
    return (
      <EmptyState
        icon={FiShoppingBag}
        title="Your cart is empty"
        message="Looks like you haven't added any fragrances yet."
        actionLabel="Continue Shopping"
        actionTo="/shop"
      />
    );
  }

  return (
    <div>
      {/* Free delivery progress */}
      <div className="border border-black/10 rounded-2xl p-4 sm:p-5 mb-6 bg-white">
        {remainingForFreeDelivery > 0 ? (
          <p className="text-sm mb-2.5">
            <FiTruck className="inline mb-0.5 mr-1.5 text-[var(--color-gold)]" />
            Add <strong>Rs. {remainingForFreeDelivery.toLocaleString()}</strong> more for{' '}
            <span className="text-[var(--color-gold)] font-medium">free delivery</span>
          </p>
        ) : (
          <p className="text-sm mb-2.5 text-emerald-700 flex items-center gap-1.5">
            <FiCheck /> You've unlocked free delivery!
          </p>
        )}
        <div className="h-1.5 rounded-full bg-[var(--color-cream)] overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--color-gold)] transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item._id} className="flex items-center gap-4 border border-black/10 rounded-2xl p-4 bg-white">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-[var(--color-cream)] shrink-0">
                <ProductImage product={item} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <p className="text-sm text-black/50">Rs. {item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center border border-black/15 rounded-full overflow-hidden shrink-0">
                <button
                  onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <FiMinus size={12} />
                </button>
                <span className="w-7 text-center text-sm font-medium">{item.qty}</span>
                <button
                  onClick={() => updateQty(item._id, item.qty + 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors"
                  aria-label="Increase quantity"
                >
                  <FiPlus size={12} />
                </button>
              </div>
              <p className="w-24 text-right font-display font-semibold shrink-0">
                Rs. {(item.price * item.qty).toLocaleString()}
              </p>
              <button
                onClick={() => onRemove(item)}
                className="text-black/40 hover:text-red-500 transition-colors shrink-0"
                aria-label="Remove item"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="border border-black/10 rounded-2xl p-6 h-fit text-left bg-white">
          <h2 className="font-display text-lg font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2 text-sm text-black/60">
            <span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2 text-sm text-black/60">
            <span>Delivery</span>
            <span className={delivery === 0 ? 'text-emerald-600 font-medium' : ''}>
              {delivery === 0 ? 'Free' : `Rs. ${delivery}`}
            </span>
          </div>
          <div className="flex justify-between font-display font-semibold text-lg border-t border-black/10 pt-3 mt-3">
            <span>Total</span><span>Rs. {total.toLocaleString()}</span>
          </div>
          <Link
            to="/checkout"
            className="block text-center mt-6 bg-black text-white py-3 rounded-full uppercase text-sm tracking-wide font-medium hover:bg-[var(--color-black-soft)] transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
