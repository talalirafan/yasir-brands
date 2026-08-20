const KEY = 'yasir-recently-viewed';
const MAX_ITEMS = 8;

export function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

// Stores a lightweight snapshot (not the full product) — just enough to
// render a card without refetching.
export function addRecentlyViewed(product) {
  const snapshot = {
    _id: product._id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.image,
    stock: product.stock,
    rating: product.rating,
  };
  const existing = getRecentlyViewed().filter((p) => p._id !== product._id);
  const updated = [snapshot, ...existing].slice(0, MAX_ITEMS);
  localStorage.setItem(KEY, JSON.stringify(updated));
}
