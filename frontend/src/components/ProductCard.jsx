import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiStar, FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCartStore, useWishlistStore, useAuthStore } from '../store/cartStore';
import ProductImage from './ProductImage';
import { showAddedToCartToast } from '../utils/cartToasts';
import { requireAuth } from '../utils/requireAuth';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.items.some((i) => i._id === product._id));
  const user = useAuthStore((s) => s.user);

  return (
    <div className="group border border-black/10 rounded-xl overflow-hidden bg-white hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
      <Link to={`/product/${product.slug}`} className="block relative aspect-square bg-[var(--color-cream)] overflow-hidden">
        <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
          <ProductImage product={product} />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
            toast.success('Wishlist updated');
          }}
          className={`absolute top-2.5 right-2.5 rounded-full p-2 shadow-sm backdrop-blur-sm transition-colors ${
            isWishlisted ? 'bg-[var(--color-gold)] text-black' : 'bg-white/85 text-black/70 hover:text-[var(--color-gold)]'
          }`}
          aria-label="Toggle wishlist"
        >
          <FiHeart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
        {product.stock === 0 ? (
          <span className="absolute top-2.5 left-2.5 bg-black/80 text-white text-[10px] uppercase tracking-wide px-2 py-1 rounded-full">
            Sold Out
          </span>
        ) : product.stock <= 5 ? (
          <span className="absolute top-2.5 left-2.5 bg-red-500/90 text-white text-[10px] uppercase tracking-wide px-2 py-1 rounded-full animate-pulse">
            Only {product.stock} left
          </span>
        ) : null}
      </Link>
      <div className="p-3.5 sm:p-4 text-left">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-medium text-sm sm:text-base leading-snug line-clamp-1 hover:text-[var(--color-gold)] transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 text-xs text-[var(--color-gold)] my-1.5">
          <FiStar fill="currentColor" size={12} /> {product.rating || 'New'}
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold font-display text-lg">Rs. {product.price.toLocaleString()}</span>
          <span className={`text-[11px] font-medium ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {product.stock > 0 ? 'In stock' : 'Out of stock'}
          </span>
        </div>
        <button
          disabled={product.stock === 0}
          onClick={() => {
            if (!requireAuth(user, navigate, `/product/${product.slug}`)) return;
            addItem(product, 1);
            showAddedToCartToast(product.name);
          }}
          className="w-full flex items-center justify-center gap-2 bg-black text-white rounded-full py-2.5 text-xs sm:text-sm uppercase tracking-wide font-medium hover:bg-[var(--color-black-soft)] transition-colors disabled:opacity-40 disabled:hover:bg-black"
        >
          <FiShoppingCart size={14} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
