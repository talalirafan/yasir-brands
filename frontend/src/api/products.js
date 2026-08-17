import api from './client';

// Normalize backend product (images: string[]) to the shape components expect (image: string).
function normalize(product) {
  return { ...product, image: product.images?.[0] || product.image || '' };
}

export async function fetchProducts(query = {}) {
  const { data } = await api.get('/products', { params: query });
  return data.map(normalize);
}

export async function fetchProductBySlug(slug) {
  const { data } = await api.get(`/products/${slug}`);
  return normalize(data);
}
