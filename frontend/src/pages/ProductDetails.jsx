import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiHeart, FiMinus, FiPlus, FiStar, FiTruck, FiShield, FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { fetchProductBySlug, fetchProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import ProductGallery from '../components/ProductGallery';
import ProductReviews from '../components/ProductReviews';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { useCartStore, useWishlistStore, useAuthStore } from '../store/cartStore';
import { showAddedToCartToast } from '../utils/cartToasts';
import { requireAuth } from '../utils/requireAuth';
import { addRecentlyViewed, getRecentlyViewed } from '../utils/recentlyViewed';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.items.some((i) => i._id === product?._id));
  const user = useAuthStore((s) => s.user);

  const load = () => {
    setNotFound(false);
    setError(false);
    setProduct(null);
    setQty(1);
    // Snapshot before this product overwrites itself into the recently-viewed list.
    setRecentlyViewed(getRecentlyViewed().filter((p) => p.slug !== slug));
    fetchProductBySlug(slug)
      .then((p) => {
        setProduct(p);
        addRecentlyViewed(p);
        fetchProducts({ gender: p.gender })
          .then((all) => setRelated(all.filter((x) => x._id !== p._id).slice(0, 4)))
          .catch(() => setRelated([]));
      })
      .catch((err) => {
        if (err?.response?.status === 404) setNotFound(true);
        else setError(true);
      });
  };

  useEffect(load, [slug]);

  if (notFound) {
    return (
      <div className="text-center py-20">
        <p className="text-black/60 mb-3">Product not found.</p>
        <Link to="/shop" className="text-[var(--color-gold)] underline underline-offset-4">Back to shop</Link>
      </div>
    );
  }
  if (error) {
    return <ErrorState message="Couldn't load this product. Please check your internet connection." onRetry={load} full />;
  }
  if (!product) return <Loading label="Loading product" full />;

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-8 sm:gap-12 mb-16">
        <ProductGallery product={product} />
        <div className="text-left">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-2">{product.name}</h1>
            <button
              onClick={() => {
                toggleWishlist(product);
                toast.success('Wishlist updated');
              }}
              className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-full border transition-colors ${
                isWishlisted
                  ? 'bg-[var(--color-gold)] border-[var(--color-gold)] text-black'
                  : 'border-black/15 text-black/50 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]'
              }`}
              aria-label="Toggle wishlist"
            >
              <FiHeart size={17} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
          <p className="flex items-center gap-1 text-[var(--color-gold)] mb-4 text-sm">
            <FiStar fill="currentColor" /> {product.rating || 'No ratings yet'}
            {product.reviewCount > 0 && <span className="text-black/40">({product.reviewCount} reviews)</span>}
          </p>
          <p className="font-display text-3xl font-semibold mb-5">Rs. {product.price.toLocaleString()}</p>
          <p className="text-black/65 leading-relaxed mb-6">{product.description}</p>

          {product.notes?.length > 0 && (
            <div className="mb-5">
              <p className="text-xs uppercase tracking-widest text-black/40 mb-2">Fragrance Notes</p>
              <div className="flex flex-wrap gap-2">
                {product.notes.map((n) => (
                  <span key={n} className="text-xs bg-[var(--color-cream)] border border-black/10 rounded-full px-3 py-1.5">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-6 mb-6 text-sm">
            <span className="text-black/50">Size: <strong className="text-black">{product.size}</strong></span>
            <span className={`font-medium ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `In stock (${product.stock})` : 'Out of stock'}
            </span>
            {product.stock > 0 && product.stock <= 5 && (
              <span className="font-medium text-red-500 animate-pulse">Hurry, only {product.stock} left!</span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-black/15 rounded-full overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-colors"
                aria-label="Decrease quantity"
              >
                <FiMinus size={13} />
              </button>
              <span className="w-8 text-center text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-colors"
                aria-label="Increase quantity"
              >
                <FiPlus size={13} />
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              disabled={product.stock === 0}
              onClick={() => {
                if (!requireAuth(user, navigate, `/product/${product.slug}`)) return;
                addItem(product, qty);
                showAddedToCartToast(product.name);
              }}
              className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3.5 rounded-full uppercase text-sm tracking-wide font-medium flex-1 hover:bg-[var(--color-black-soft)] transition-colors disabled:opacity-40"
            >
              <FiShoppingCart size={15} /> Add to Cart
            </button>
            <button
              disabled={product.stock === 0}
              onClick={() => {
                if (!requireAuth(user, navigate, `/product/${product.slug}`)) return;
                addItem(product, qty);
                navigate('/checkout');
              }}
              className="bg-[var(--color-gold)] text-black px-6 py-3.5 rounded-full uppercase text-sm tracking-wide font-medium flex-1 text-center hover:bg-[var(--color-gold-light)] transition-colors disabled:opacity-40"
            >
              Buy Now
            </button>
          </div>

          <div className="flex flex-col gap-2 mt-6 text-sm text-black/50">
            <p className="flex items-center gap-2"><FiTruck className="text-[var(--color-gold)]" /> Free delivery on orders above Rs. 5,000</p>
            <p className="flex items-center gap-2"><FiShield className="text-[var(--color-gold)]" /> Cash on Delivery available</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mb-16">
          <h2 className="font-display text-2xl font-semibold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}

      {recentlyViewed.length > 0 && (
        <div className="mb-16">
          <h2 className="font-display text-2xl font-semibold mb-6">Recently Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {recentlyViewed.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}

      <ProductReviews productId={product._id} />
    </div>
  );
}
