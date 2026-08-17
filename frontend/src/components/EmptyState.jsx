import { Link } from 'react-router-dom';

export default function EmptyState({ icon: Icon, title, message, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center py-20">
      <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center text-black/30 text-2xl">
        <Icon />
      </div>
      <div>
        <p className="font-medium mb-1">{title}</p>
        {message && <p className="text-sm text-black/50 max-w-xs">{message}</p>}
      </div>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="bg-black text-white px-6 py-2.5 rounded uppercase text-sm tracking-wide hover:bg-black/85 transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
