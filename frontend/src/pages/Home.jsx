import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
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
      <section className="relative overflow-hidden bg-black text-white rounded-2xl px-6 sm:px-12 py-10 sm:py-14 text-center mb-10 animate-fade-up">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(198,162,90,0.18), transparent 45%), radial-gradient(circle at 80% 80%, rgba(198,162,90,0.14), transparent 50%)',
          }}
        />
        <div className="relative">
          <p className="uppercase tracking-[6px] text-[var(--color-gold)] text-xs sm:text-sm mb-3">
            Luxury Fragrances
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-3 tracking-wide">
            Yasir Fragrances
          </h1>
          <p className="max-w-xl mx-auto text-white/65 mb-6 text-sm leading-relaxed">
            Discover signature scents crafted for him and her — bottled elegance for every moment.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/for-him"
              className="bg-[var(--color-gold)] text-black px-7 py-2.5 rounded-full uppercase text-xs sm:text-sm tracking-wide font-medium hover:bg-[var(--color-gold-light)] transition-colors"
            >
              Shop For Him
            </Link>
            <Link
              to="/for-her"
              className="border border-white/40 px-7 py-2.5 rounded-full uppercase text-xs sm:text-sm tracking-wide hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors"
            >
              Shop For Her
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="uppercase tracking-[4px] text-[var(--color-gold)] text-xs mb-1.5">Curated Selection</p>
            <h2 className="font-display text-3xl font-semibold">Best Sellers</h2>
          </div>
          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-1.5 text-sm text-black/60 hover:text-[var(--color-gold)] transition-colors"
          >
            View all <FiArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <SkeletonGrid />
        ) : error ? (
          <ErrorState message="Couldn't load products. Please check your internet connection." onRetry={load} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="grid md:grid-cols-2 gap-5 mb-14">
        <Link
          to="/for-him"
          className="group relative overflow-hidden bg-black text-white rounded-2xl p-10 text-left transition-transform hover:-translate-y-1 min-h-[280px] flex flex-col justify-end"
        >
          <img
            src="/products/ambazer.jpeg"
            alt="Ambassador Parfum"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="relative">
            <p className="uppercase tracking-[3px] text-[var(--color-gold)] text-xs mb-2">Collection</p>
            <h3 className="font-display text-3xl font-semibold mb-2">For Him</h3>
            <p className="text-sm text-white/70 mb-6">Shanu Noir, Aura Oud, Marj, Ambassador</p>
            <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-gold)] group-hover:gap-2.5 transition-all">
              Explore <FiArrowRight size={14} />
            </span>
          </div>
        </Link>
        <Link
          to="/for-her"
          className="group relative overflow-hidden bg-black text-white rounded-2xl p-10 text-left transition-transform hover:-translate-y-1 min-h-[280px] flex flex-col justify-end"
        >
          <img
            src="/products/bloom.jpg"
            alt="Bloom Parfum"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="relative">
            <p className="uppercase tracking-[3px] text-[var(--color-gold)] text-xs mb-2">Collection</p>
            <h3 className="font-display text-3xl font-semibold mb-2">For Her</h3>
            <p className="text-sm text-white/70 mb-6">Bloom</p>
            <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-gold)] group-hover:gap-2.5 transition-all">
              Explore <FiArrowRight size={14} />
            </span>
          </div>
        </Link>
      </section>
    </div>
  );
}
