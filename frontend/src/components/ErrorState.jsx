import { FiWifiOff, FiRefreshCw } from 'react-icons/fi';

export default function ErrorState({
  message = "Couldn't load this page. Please check your connection.",
  onRetry,
  full = false,
}) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 text-center ${full ? 'min-h-[60vh]' : 'py-20'}`}>
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-400 text-2xl">
        <FiWifiOff />
      </div>
      <div>
        <p className="font-medium mb-1">Something went wrong</p>
        <p className="text-sm text-black/50 max-w-xs">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded uppercase text-sm tracking-wide hover:bg-black/85 transition-colors"
        >
          <FiRefreshCw /> Try Again
        </button>
      )}
    </div>
  );
}
