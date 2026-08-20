import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="text-center py-24 sm:py-32">
      <p className="font-display text-7xl sm:text-8xl font-semibold text-[var(--color-gold)] mb-4">404</p>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-3">Scent Not Found</h1>
      <p className="text-black/55 max-w-sm mx-auto mb-8 text-sm">
        The page you're looking for has drifted away. Let's get you back to something fragrant.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-black text-white px-7 py-3 rounded-full uppercase text-xs sm:text-sm tracking-wide font-medium hover:bg-[var(--color-black-soft)] transition-colors"
      >
        <FiArrowLeft size={14} /> Back to Home
      </Link>
    </div>
  );
}
