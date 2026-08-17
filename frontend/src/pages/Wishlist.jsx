import { FiHeart } from 'react-icons/fi';
import { useWishlistStore, useCartStore } from '../store/cartStore';
import { showAddedToCartToast, showRemovedToast } from '../utils/cartToasts';
import ProductImage from '../components/ProductImage';
import EmptyState from '../components/EmptyState';

export default function Wishlist() {
  const { items, toggleItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={FiHeart}
        title="Your wishlist is empty"
        message="Save fragrances you love to find them here later."
        actionLabel="Browse Perfumes"
        actionTo="/shop"
      />
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold mb-4">Wishlist</h1>
      {items.map((item) => (
        <div key={item._id} className="flex items-center gap-4 border rounded-lg p-4">
          <div className="w-20 h-20 rounded overflow-hidden bg-[var(--color-cream)] shrink-0">
            <ProductImage product={item} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-black/60">Rs. {item.price.toLocaleString()}</p>
          </div>
          <button
            onClick={() => { addItem(item, 1); toggleItem(item); showAddedToCartToast(item.name); }}
            className="bg-black text-white px-4 py-2 rounded text-sm"
          >
            Move to Cart
          </button>
          <button
            onClick={() => { toggleItem(item); showRemovedToast(item.name, () => toggleItem(item)); }}
            className="text-red-500 text-sm"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
