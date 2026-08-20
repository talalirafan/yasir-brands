import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiArrowRight, FiTruck, FiShield, FiRotateCcw, FiAward } from 'react-icons/fi';
import { fetchProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import ErrorState from '../components/ErrorState';
import Reveal from '../components/Reveal';
import RotatingBanner from '../components/RotatingBanner';

const BRAND_NAMES = ['Shanu Noir', 'Aura Oud', 'Marj', 'Ambassador', 'Bloom'];
const MARQUEE_ITEMS = [...BRAND_NAMES, ...BRAND_NAMES];

const FEATURES = [
  { icon: FiAward, title: '100% Authentic', text: 'Every bottle sourced and blended for quality you can trust.' },
  { icon: FiTruck, title: 'Fast Delivery', text: 'Nationwide shipping, free above Rs. 5,000.' },
  { icon: FiShield, title: 'Cash on Delivery', text: 'Pay when it arrives — no advance required.' },
  { icon: FiRotateCcw, title: 'Easy Returns', text: 'Not the right scent? Return it, hassle-free.' },
];

export default function Home() {
  const [bestSellers, setBestSellers] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    fetchProducts()
      .then((all) => {
        setFeatured(all.find((p) => p.slug === 'bloom') || all[0] || null);

        // Fixed Best Sellers order — Bloom is kept out here since it's shown
        // separately in the Featured Fragrance spotlight below.
        const order = ['shanu-noir', 'aura-oud', 'ambassador', 'marj'];
        const sorted = all
          .filter((p) => p.slug !== 'bloom')
          .sort((a, b) => {
            const ai = order.indexOf(a.slug);
            const bi = order.indexOf(b.slug);
            return (ai === -1 ? order.length : ai) - (bi === -1 ? order.length : bi);
          });
        setBestSellers(sorted.slice(0, 4));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-black text-white rounded-2xl px-6 sm:px-12 py-14 sm:py-20 text-center mb-8">
        <div
          className="pointer-events-none absolute -top-16 -left-10 w-64 h-64 rounded-full blur-3xl animate-float"
          style={{ background: 'radial-gradient(circle, rgba(198,162,90,0.35), transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 -right-10 w-72 h-72 rounded-full blur-3xl animate-float-slow"
          style={{ background: 'radial-gradient(circle, rgba(198,162,90,0.28), transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute inset-0 animate-glow-pulse"
          style={{
            background:
              'radial-gradient(circle at 50% 0%, rgba(198,162,90,0.16), transparent 55%)',
          }}
        />

        <div className="relative">
          <p className="animate-fade-up uppercase tracking-[6px] text-[var(--color-gold)] text-xs sm:text-sm mb-4">
            Luxury Fragrances
          </p>
          <h1
            className="animate-fade-up font-display text-5xl sm:text-7xl font-semibold mb-4 tracking-wide"
            style={{ animationDelay: '80ms' }}
          >
            Yasir Fragrances
          </h1>
          <p
            className="animate-fade-up max-w-xl mx-auto text-white/65 mb-8 text-sm sm:text-base leading-relaxed"
            style={{ animationDelay: '160ms' }}
          >
            Discover signature scents crafted for him and her — bottled elegance for every moment.
          </p>
          <div className="animate-fade-up flex gap-4 justify-center flex-wrap" style={{ animationDelay: '240ms' }}>
            <Link
              to="/for-him"
              className="group bg-[var(--color-gold)] text-black px-7 py-3 rounded-full uppercase text-xs sm:text-sm tracking-wide font-medium hover:bg-[var(--color-gold-light)] transition-all inline-flex items-center gap-2 hover:gap-3"
            >
              Shop For Him <FiArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/for-her"
              className="border border-white/40 px-7 py-3 rounded-full uppercase text-xs sm:text-sm tracking-wide hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors"
            >
              Shop For Her
            </Link>
          </div>
        </div>
      </section>

      {/* Scrolling brand strip */}
      <section className="mb-14 overflow-hidden rounded-full border border-black/10 bg-white py-3">
        <div className="flex whitespace-nowrap animate-marquee">
          {MARQUEE_ITEMS.map((name, i) => (
            <span key={i} className="mx-6 flex items-center gap-6 text-sm tracking-wide text-black/50">
              <span className="font-display text-base text-black/80">{name}</span>
              <span className="text-[var(--color-gold)]">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <Reveal className="mb-14">
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
            {bestSellers.map((p, i) => (
              <div key={p._id} className="animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </Reveal>

      {/* Featured product spotlight */}
      {featured && (
        <Reveal className="grid md:grid-cols-5 gap-0 mb-14 rounded-2xl overflow-hidden border border-black/10">
          <div className="md:col-span-2 relative aspect-[4/5] md:aspect-auto bg-[var(--color-cream)]">
            <img
              src={featured.image}
              alt={featured.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="md:col-span-3 bg-white p-8 sm:p-12 flex flex-col justify-center text-left">
            <p className="uppercase tracking-[4px] text-[var(--color-gold)] text-xs mb-4">Featured Fragrance</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">{featured.name}</h2>
            <p className="text-black/60 leading-relaxed mb-6 max-w-md">{featured.description}</p>
            <div className="flex items-center gap-4 mb-7">
              <span className="font-display text-2xl font-semibold">
                Rs. {featured.price.toLocaleString()}
              </span>
              {featured.notes?.length > 0 && (
                <span className="text-xs text-black/40 tracking-wide">{featured.notes.join(' · ')}</span>
              )}
            </div>
            <Link
              to={`/product/${featured.slug}`}
              className="inline-flex items-center gap-2 bg-black text-white px-7 py-3 rounded-full uppercase text-xs sm:text-sm tracking-wide font-medium hover:bg-[var(--color-black-soft)] transition-colors w-fit"
            >
              Shop {featured.name} <FiArrowRight size={14} />
            </Link>
          </div>
        </Reveal>
      )}

      {/* Collection tiles */}
      <Reveal className="grid md:grid-cols-2 gap-5 mb-14">
        <Link
          to="/for-him"
          className="group relative overflow-hidden bg-black text-white rounded-2xl p-10 text-left transition-transform hover:-translate-y-1 min-h-[280px] flex flex-col justify-end"
        >
          <RotatingBanner
            images={bestSellers.length > 0 ? bestSellers.map((p) => p.image) : ['/products/ambazer.jpeg']}
            alt="For Him fragrances"
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
      </Reveal>

      {/* Feature badges */}
      <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="border border-black/10 rounded-2xl p-5 bg-white text-left hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-[var(--color-cream)] flex items-center justify-center text-[var(--color-gold)] mb-3">
              <Icon size={17} />
            </div>
            <h3 className="font-medium text-sm mb-1">{title}</h3>
            <p className="text-xs text-black/55 leading-relaxed">{text}</p>
          </div>
        ))}
      </Reveal>

      {/* CTA band */}
      <Reveal className="relative overflow-hidden text-center bg-black text-white rounded-2xl px-6 py-14 sm:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(198,162,90,0.18), transparent 45%), radial-gradient(circle at 80% 80%, rgba(198,162,90,0.14), transparent 50%)',
          }}
        />
        <div className="relative">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-3">Find Your Signature Scent</h2>
          <p className="text-white/60 max-w-md mx-auto mb-7 text-sm">
            Explore the full collection and discover a fragrance that's uniquely yours.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[var(--color-gold)] text-black px-8 py-3 rounded-full uppercase text-xs sm:text-sm tracking-wide font-medium hover:bg-[var(--color-gold-light)] transition-colors"
          >
            Shop the Collection <FiArrowRight size={14} />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
