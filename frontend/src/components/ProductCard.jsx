import { Link } from 'react-router-dom';
import { FiHeart, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCartStore, useWishlistStore } from '../store/cartStore';
import ProductImage from './ProductImage';
import { showAddedToCartToast } from '../utils/cartToasts';

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);

  return (
    <div className="group border border-black/10 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow">
      <Link to={`/product/${product.slug}`} className="block relative aspect-square bg-[var(--color-cream)]">
        <ProductImage product={product} />
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
            toast.success('Wishlist updated');
          }}
          className="absolute top-2 right-2 bg-white/80 rounded-full p-2"
        >
          <FiHeart />
        </button>
      </Link>
      <div className="p-4 text-left">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-medium">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 text-sm text-[var(--color-gold)] my-1">
          <FiStar /> {product.rating}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Rs. {product.price.toLocaleString()}</span>
          <span className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? 'In stock' : 'Out of stock'}
          </span>
        </div>
        <button
          disabled={product.stock === 0}
          onClick={() => {
            addItem(product, 1);
            showAddedToCartToast(product.name);
          }}
          className="mt-3 w-full bg-black text-white rounded py-2 text-sm uppercase tracking-wide disabled:opacity-40"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
