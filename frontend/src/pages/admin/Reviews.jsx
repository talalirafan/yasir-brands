import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get('/admin/reviews').then((res) => setReviews(res.data)).catch(() => setReviews([]));
  }, []);

  const remove = async (id) => {
    await api.delete(`/admin/reviews/${id}`).catch(() => {});
    setReviews((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Reviews</h1>
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r._id} className="border rounded p-3 flex justify-between items-start">
            <div>
              <p className="font-medium">{r.product} — {'★'.repeat(r.rating)}</p>
              <p className="text-sm text-black/60">{r.text}</p>
            </div>
            <button onClick={() => remove(r._id)} className="text-sm text-red-500 underline">Delete</button>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-black/50 text-center py-6">No reviews yet.</p>}
      </div>
    </div>
  );
}
