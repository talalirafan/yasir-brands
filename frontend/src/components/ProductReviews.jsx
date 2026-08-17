import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiStar } from 'react-icons/fi';
import api from '../api/client';
import { useAuthStore } from '../store/cartStore';

function Stars({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
        >
          <FiStar
            size={onChange ? 22 : 14}
            className={n <= value ? 'text-[var(--color-gold)] fill-current' : 'text-black/20'}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ productId }) {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    api.get(`/reviews/product/${productId}`).then((res) => setReviews(res.data)).catch(() => {});
    if (user) {
      api
        .get(`/reviews/can-review/${productId}`)
        .then((res) => {
          setCanReview(res.data.canReview);
          setAlreadyReviewed(res.data.alreadyReviewed);
        })
        .catch(() => {});
    }
  };

  useEffect(load, [productId, user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/reviews', { product: productId, rating, text });
      toast.success('Review submitted!');
      setText('');
      setRating(5);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-4">Reviews {reviews.length > 0 && `(${reviews.length})`}</h2>

      {reviews.length === 0 ? (
        <p className="text-black/50 text-sm mb-6">No reviews yet.</p>
      ) : (
        <div className="space-y-4 mb-8">
          {reviews.map((r) => (
            <div key={r._id} className="border rounded-lg p-4 text-left">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-sm">{r.userName}</p>
                <Stars value={r.rating} />
              </div>
              <p className="text-sm text-black/70">{r.text}</p>
              <p className="text-xs text-black/40 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {!user && (
        <p className="text-sm text-black/50">
          <Link to="/login" className="underline">Login</Link> to review this product after your order is delivered.
        </p>
      )}

      {user && alreadyReviewed && (
        <p className="text-sm text-black/50">You've already reviewed this product. Thanks!</p>
      )}

      {user && !alreadyReviewed && !canReview && (
        <p className="text-sm text-black/50">
          You can review this product once your order has been delivered.
        </p>
      )}

      {user && canReview && (
        <form onSubmit={onSubmit} className="border rounded-lg p-4 text-left max-w-md">
          <p className="font-medium mb-2 text-sm">Write a review</p>
          <div className="mb-3">
            <Stars value={rating} onChange={setRating} />
          </div>
          <textarea
            required
            rows={3}
            placeholder="Share your experience with this fragrance..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:border-[var(--color-gold)]"
          />
          <button
            disabled={submitting}
            className="bg-black text-white px-5 py-2 rounded text-sm uppercase tracking-wide disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}
    </div>
  );
}
