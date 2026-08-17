import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const query = searchParams.get('q') || '';

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    fetchProducts({ gender, q: query || undefined, sort })
      .then(setProducts)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [gender, query, sort]);

  useEffect(() => {
    load();
  }, [load]);

  const title = gender === 'boys' ? 'For Him' : gender === 'girls' ? 'For Her' : query ? `Search: "${query}"` : 'Shop All';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <SkeletonGrid />
      ) : error ? (
        <ErrorState message="Couldn't load products. Please check your internet connection." onRetry={load} />
      ) : products.length === 0 ? (
        <p className="text-black/60">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
