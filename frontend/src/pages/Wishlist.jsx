import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
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
    <div>
      <p className="uppercase tracking-[4px] text-[var(--color-gold)] text-xs mb-1.5">Saved For Later</p>
      <h1 className="font-display text-3xl font-semibold mb-6">Wishlist</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="flex items-center gap-4 border border-black/10 rounded-2xl p-4 bg-white">
            <Link to={`/product/${item.slug}`} className="w-20 h-20 rounded-xl overflow-hidden bg-[var(--color-cream)] shrink-0">
              <ProductImage product={item} />
            </Link>
            <div className="flex-1 text-left min-w-0">
              <Link to={`/product/${item.slug}`} className="font-medium truncate block hover:text-[var(--color-gold)] transition-colors">
                {item.name}
              </Link>
              <p className="text-sm text-black/50">Rs. {item.price.toLocaleString()}</p>
            </div>
            <button
              onClick={() => { addItem(item, 1); toggleItem(item); showAddedToCartToast(item.name); }}
              className="hidden sm:block bg-black text-white px-5 py-2.5 rounded-full text-xs sm:text-sm uppercase tracking-wide font-medium hover:bg-[var(--color-black-soft)] transition-colors shrink-0"
            >
              Move to Cart
            </button>
            <button
              onClick={() => { toggleItem(item); showRemovedToast(item.name, () => toggleItem(item)); }}
              className="text-black/40 hover:text-red-500 transition-colors shrink-0"
              aria-label="Remove from wishlist"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
