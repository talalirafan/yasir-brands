import toast from 'react-hot-toast';

// Guards actions that need a logged-in user (e.g. adding to cart). Returns
// true if the user may proceed; otherwise sends them to login and returns false.
export function requireAuth(user, navigate, currentPath) {
  if (user) return true;
  toast.error('Please log in to add items to your cart');
  navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
  return false;
}
