import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX, FiInstagram, FiFacebook, FiMail, FiPhone } from 'react-icons/fi';
import { useState } from 'react';
import { useCartStore, useWishlistStore, useAuthStore } from '../store/cartStore';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/for-him', label: 'For Him' },
  { to: '/for-her', label: 'For Her' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const navLinkClass = ({ isActive }) =>
  `relative py-1 transition-colors hover:text-[var(--color-gold)] ${
    isActive ? 'text-[var(--color-gold)]' : 'text-white/85'
  } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1.5px] after:bg-[var(--color-gold)] after:transition-all after:duration-300 ${
    isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
  }`;

const iconButtonClass =
  'relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-white/85 hover:text-[var(--color-gold)] hover:bg-white/10 transition-colors shrink-0';

export default function MainLayout() {
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { user } = useAuthStore();

  const onSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream)]">
      <header className="bg-black text-white sticky top-0 z-40 shadow-[0_1px_0_0_rgba(198,162,90,0.25)]">
        <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-6 px-4 py-2.5 sm:py-3.5">
          <Link
            to="/"
            className="font-display text-lg sm:text-2xl font-semibold tracking-wide sm:tracking-[3px] text-[var(--color-gold)] transition-opacity hover:opacity-80 whitespace-nowrap shrink-0"
          >
            YASIR FRAGRANCES
          </Link>

          <nav className="hidden md:flex gap-6 text-sm uppercase tracking-wide flex-1">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={navLinkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <form
            onSubmit={onSearch}
            className="hidden md:flex items-center bg-white/10 rounded-full px-3 ring-1 ring-white/10 focus-within:ring-[var(--color-gold)] focus-within:bg-white/15 transition-all"
          >
            <FiSearch className="text-white/60" size={15} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search perfumes..."
              className="bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-white/50 w-36 focus:w-52 transition-all"
            />
          </form>

          <div className="flex items-center gap-1">
            <Link to="/wishlist" className={iconButtonClass} aria-label="Wishlist">
              <FiHeart size={19} />
              {wishlistCount > 0 && (
                <span
                  key={wishlistCount}
                  className="absolute top-0 right-0 bg-[var(--color-gold)] text-black text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center animate-badge-pop"
                >
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className={iconButtonClass} aria-label="Cart">
              <FiShoppingBag size={19} />
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className="absolute top-0 right-0 bg-[var(--color-gold)] text-black text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center animate-badge-pop"
                >
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to={user ? '/profile' : '/login'} className={iconButtonClass} aria-label="Account">
              <FiUser size={19} />
            </Link>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className={`${iconButtonClass} md:hidden`}
              aria-label="Menu"
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
            menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col px-4 pb-4 gap-1 text-sm uppercase tracking-wide">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `py-2 border-b border-white/10 transition-colors hover:text-[var(--color-gold)] ${
                    isActive ? 'text-[var(--color-gold)]' : 'text-white/85'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <form onSubmit={onSearch} className="flex items-center bg-white/10 rounded-full px-3 mt-2">
              <FiSearch className="text-white/60" size={15} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search perfumes..."
                className="bg-transparent px-2 py-2 text-sm outline-none placeholder:text-white/50 flex-1"
              />
            </form>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8">
        <Outlet />
      </main>

      <footer className="bg-black text-white/70 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 sm:grid-cols-2 md:grid-cols-4 text-sm">
          <div>
            <p className="font-display text-[var(--color-gold)] text-2xl tracking-wide mb-3">YASIR FRAGRANCES</p>
            <p className="leading-relaxed text-white/60">
              Luxury perfumes for him and her, crafted to leave a lasting impression.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-white/15 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors"
              >
                <FiInstagram size={15} />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-white/15 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors"
              >
                <FiFacebook size={15} />
              </a>
            </div>
          </div>

          <div>
            <p className="uppercase tracking-widest text-white/40 text-xs mb-4">Shop</p>
            <ul className="space-y-2.5">
              <li><Link to="/shop" className="hover:text-[var(--color-gold)] transition-colors">All Perfumes</Link></li>
              <li><Link to="/for-him" className="hover:text-[var(--color-gold)] transition-colors">For Him</Link></li>
              <li><Link to="/for-her" className="hover:text-[var(--color-gold)] transition-colors">For Her</Link></li>
              <li><Link to="/wishlist" className="hover:text-[var(--color-gold)] transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          <div>
            <p className="uppercase tracking-widest text-white/40 text-xs mb-4">Company</p>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="hover:text-[var(--color-gold)] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--color-gold)] transition-colors">Contact</Link></li>
              <li><Link to="/orders" className="hover:text-[var(--color-gold)] transition-colors">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <p className="uppercase tracking-widest text-white/40 text-xs mb-4">Get in Touch</p>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-white/60">
                <FiMail size={14} className="text-[var(--color-gold)]" /> hello@ysrfragrances.com
              </li>
              <li className="flex items-center gap-2 text-white/60">
                <FiPhone size={14} className="text-[var(--color-gold)]" /> +92 300 0000000
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-5 text-xs text-white/40 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>&copy; {new Date().getFullYear()} Yasir Fragrances. All rights reserved.</p>
            <p className="tracking-wide">Crafted with care, worn with confidence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
