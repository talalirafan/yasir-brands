import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FiCheck, FiRotateCcw } from 'react-icons/fi';

export function showAddedToCartToast(name) {
  toast.custom(
    (t) => (
      <div
        className={`bg-white border border-black/10 rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 transition-all ${
          t.visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
          <FiCheck size={15} />
        </div>
        <p className="text-sm">
          <span className="font-medium">{name}</span> added to cart
        </p>
        <Link
          to="/cart"
          onClick={() => toast.dismiss(t.id)}
          className="text-sm font-medium text-[var(--color-gold)] whitespace-nowrap hover:underline"
        >
          View Cart
        </Link>
      </div>
    ),
    { duration: 3000 },
  );
}

export function showRemovedToast(label, onUndo) {
  toast.custom(
    (t) => (
      <div
        className={`bg-white border border-black/10 rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 transition-all ${
          t.visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="text-sm">
          <span className="font-medium">{label}</span> removed
        </p>
        <button
          onClick={() => {
            onUndo();
            toast.dismiss(t.id);
          }}
          className="flex items-center gap-1 text-sm font-medium text-[var(--color-gold)] whitespace-nowrap hover:underline"
        >
          <FiRotateCcw size={13} /> Undo
        </button>
      </div>
    ),
    { duration: 4000 },
  );
}
