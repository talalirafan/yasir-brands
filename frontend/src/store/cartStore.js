import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i._id === product._id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i._id === product._id ? { ...i, qty: i.qty + qty } : i,
              ),
            };
          }
          return { items: [...state.items, { ...product, qty }] };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i._id !== id) })),
      updateQty: (id, qty) =>
        set((state) => ({
          items: state.items.map((i) => (i._id === id ? { ...i, qty } : i)),
        })),
      clearCart: () => set({ items: [] }),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    { name: 'ysr-cart' },
  ),
);

export const useWishlistStore = create(
  persist(
    (set) => ({
      items: [],
      toggleItem: (product) =>
        set((state) => {
          const exists = state.items.find((i) => i._id === product._id);
          return exists
            ? { items: state.items.filter((i) => i._id !== product._id) }
            : { items: [...state.items, product] };
        }),
    }),
    { name: 'ysr-wishlist' },
  ),
);

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  login: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));
