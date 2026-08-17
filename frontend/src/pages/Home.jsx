import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import ErrorState from '../components/ErrorState';

export default function Home() {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    fetchProducts()
      .then((all) => setBestSellers(all.slice(0, 4)))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div>
      <section className="bg-black text-white rounded-lg px-8 py-16 text-center mb-10">
        <p className="uppercase tracking-[6px] text-[var(--color-gold)] text-sm mb-3">
          Luxury Fragrances
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold mb-4">YSR Fragrances</h1>
        <p className="max-w-xl mx-auto text-white/70 mb-6">
          Discover signature scents crafted for him and her.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/for-him" className="bg-[var(--color-gold)] text-black px-6 py-2 rounded uppercase text-sm">
            For Him
          </Link>
          <Link to="/for-her" className="border border-white px-6 py-2 rounded uppercase text-sm">
            For Her
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Best Sellers</h2>
        {loading ? (
          <SkeletonGrid />
        ) : error ? (
          <ErrorState message="Couldn't load products. Please check your internet connection." onRetry={load} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bestSellers.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="grid md:grid-cols-2 gap-4 mb-10">
        <Link to="/for-him" className="bg-[var(--color-cream)] border rounded-lg p-8 text-left">
          <h3 className="text-xl font-semibold mb-2">For Him</h3>
          <p className="text-sm text-black/60">Shanu Noir, Rasko, ÉLITE, ZAYNAR</p>
        </Link>
        <Link to="/for-her" className="bg-[var(--color-cream)] border rounded-lg p-8 text-left">
          <h3 className="text-xl font-semibold mb-2">For Her</h3>
          <p className="text-sm text-black/60">Bloom</p>
        </Link>
      </section>
    </div>
  );
}
