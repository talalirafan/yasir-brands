import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSliders, FiX } from 'react-icons/fi';
import { fetchProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import ErrorState from '../components/ErrorState';

export default function Shop({ gender }) {
  const [searchParams] = useSearchParams();
  const [sort, setSort] = useState('newest');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const query = searchParams.get('q') || '';

  const activeFilterCount = [minPrice, maxPrice, inStock].filter(Boolean).length;

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    fetchProducts({
      gender,
      q: query || undefined,
      sort,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      inStock: inStock || undefined,
    })
      .then(setProducts)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [gender, query, sort, minPrice, maxPrice, inStock]);

  useEffect(() => {
    load();
  }, [load]);

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
  };

  const title = gender === 'boys' ? 'For Him' : gender === 'girls' ? 'For Her' : query ? `Search: "${query}"` : 'Shop All';

  return (
    <div>
      <div className="flex items-end justify-between mb-7 gap-4 flex-wrap">
        <div>
          <p className="uppercase tracking-[4px] text-[var(--color-gold)] text-xs mb-1.5">Collection</p>
          <h1 className="font-display text-3xl font-semibold">{title}</h1>
          {!loading && !error && (
            <p className="text-sm text-black/50 mt-1">
              {products.length} {products.length === 1 ? 'fragrance' : 'fragrances'}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className={`flex items-center gap-1.5 border rounded-full px-4 py-2 text-sm transition-colors ${
              activeFilterCount > 0
                ? 'border-[var(--color-gold)] text-[var(--color-gold)] bg-[var(--color-gold)]/5'
                : 'border-black/15 bg-white hover:border-black/30'
            }`}
          >
            <FiSliders size={14} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-black/15 rounded-full px-4 py-2 text-sm bg-white focus:outline-none focus:border-[var(--color-gold)] transition-colors"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {filtersOpen && (
        <div className="flex flex-wrap items-end gap-4 border border-black/10 rounded-2xl p-4 sm:p-5 mb-7 bg-white">
          <div>
            <label className="block text-xs text-black/50 mb-1.5">Min Price (Rs.)</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-28 border border-black/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)]"
            />
          </div>
          <div>
            <label className="block text-xs text-black/50 mb-1.5">Max Price (Rs.)</label>
            <input
              type="number"
              min="0"
              placeholder="Any"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-28 border border-black/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)]"
            />
          </div>
          <label className="flex items-center gap-2 text-sm mb-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="accent-[var(--color-gold)] w-4 h-4"
            />
            In stock only
          </label>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-black/50 hover:text-red-500 transition-colors mb-2"
            >
              <FiX size={14} /> Clear filters
            </button>
          )}
        </div>
      )}

      {loading ? (
        <SkeletonGrid />
      ) : error ? (
        <ErrorState message="Couldn't load products. Please check your internet connection." onRetry={load} />
      ) : products.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-black/15 rounded-2xl">
          <p className="text-black/50 mb-3">No products found.</p>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="text-sm text-[var(--color-gold)] underline underline-offset-4">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
