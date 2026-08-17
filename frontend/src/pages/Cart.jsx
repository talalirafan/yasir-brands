import { Link } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';
import { useCartStore } from '../store/cartStore';
import { showRemovedToast } from '../utils/cartToasts';
import ProductImage from '../components/ProductImage';
import EmptyState from '../components/EmptyState';

export default function Cart() {
  const { items, removeItem, updateQty, addItem } = useCartStore();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = items.length === 0 ? 0 : subtotal >= 5000 ? 0 : 250;
  const total = subtotal + delivery;

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
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        {items.map((item) => (
          <div key={item._id} className="flex items-center gap-4 border rounded-lg p-4">
            <div className="w-20 h-20 rounded overflow-hidden bg-[var(--color-cream)] shrink-0">
              <ProductImage product={item} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-black/60">Rs. {item.price.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))} className="border w-7 h-7 rounded">-</button>
              <span>{item.qty}</span>
              <button onClick={() => updateQty(item._id, item.qty + 1)} className="border w-7 h-7 rounded">+</button>
            </div>
            <p className="w-24 text-right font-medium">Rs. {(item.price * item.qty).toLocaleString()}</p>
            <button onClick={() => onRemove(item)} className="text-red-500 text-sm">Remove</button>
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-6 h-fit text-left">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2 text-sm"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
        <div className="flex justify-between mb-2 text-sm"><span>Delivery</span><span>{delivery === 0 ? 'Free' : `Rs. ${delivery}`}</span></div>
        <div className="flex justify-between font-semibold text-lg border-t pt-3 mt-3"><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
        <Link to="/checkout" className="block text-center mt-6 bg-black text-white py-3 rounded uppercase text-sm">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
