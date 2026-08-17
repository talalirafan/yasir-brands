import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchProductBySlug, fetchProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import ZoomableProductImage from '../components/ZoomableProductImage';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { useCartStore } from '../store/cartStore';
import { showAddedToCartToast } from '../utils/cartToasts';

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const load = () => {
    setNotFound(false);
    setError(false);
    setProduct(null);
    setQty(1);
    fetchProductBySlug(slug)
      .then((p) => {
        setProduct(p);
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
    return <p>Product not found. <Link to="/shop" className="underline">Back to shop</Link></p>;
  }
  if (error) {
    return <ErrorState message="Couldn't load this product. Please check your internet connection." onRetry={load} full />;
  }
  if (!product) return <Loading label="Loading product" full />;

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="aspect-square bg-[var(--color-cream)] rounded-lg overflow-hidden">
          <ZoomableProductImage product={product} />
        </div>
        <div className="text-left">
          <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
          <p className="text-[var(--color-gold)] mb-4">★ {product.rating || 'No ratings yet'}</p>
          <p className="text-2xl font-semibold mb-4">Rs. {product.price.toLocaleString()}</p>
          <p className="text-black/70 mb-4">{product.description}</p>
          <p className="mb-2"><strong>Notes:</strong> {product.notes?.join(', ')}</p>
          <p className="mb-2"><strong>Size:</strong> {product.size}</p>
          <p className="mb-4">
            <strong>Availability:</strong>{' '}
            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-500'}>
              {product.stock > 0 ? `In stock (${product.stock})` : 'Out of stock'}
            </span>
          </p>

          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="border w-8 h-8 rounded">-</button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="border w-8 h-8 rounded">+</button>
          </div>

          <div className="flex gap-3">
            <button
              disabled={product.stock === 0}
              onClick={() => { addItem(product, qty); showAddedToCartToast(product.name); }}
              className="bg-black text-white px-6 py-3 rounded uppercase text-sm flex-1 disabled:opacity-40"
            >
              Add to Cart
            </button>
            <Link
              to="/checkout"
              onClick={() => addItem(product, qty)}
              className="bg-[var(--color-gold)] text-black px-6 py-3 rounded uppercase text-sm flex-1 text-center"
            >
              Buy Now
            </Link>
          </div>

          <p className="text-sm text-black/50 mt-4">Cash on Delivery available. Free delivery on orders above Rs. 5,000.</p>
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
