# YSR Fragrances

Luxury perfume e-commerce platform.

## Structure

- `frontend/` — React + Vite + Tailwind CSS
- `backend/` — NestJS + MongoDB (Mongoose)

## Getting Started

### Frontend
```
cd frontend
npm install
npm run dev
```

### Backend
```
cd backend
npm install
cp .env.example .env   # then set MONGODB_URI / JWT_SECRET
npm run start:dev
```

## Status

- [x] Frontend scaffold (routing, cart/wishlist/auth stores, all customer pages, admin shell)
- [x] Backend scaffold (11 NestJS modules: auth, users, products, categories, cart, orders, reviews, addresses, payments, wishlist, admin)
- [ ] Mongoose schemas + real API endpoints (currently frontend uses mock product data)
- [ ] JWT auth wiring end-to-end
