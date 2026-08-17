import { FiCheck, FiX } from 'react-icons/fi';

const STEPS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function OrderTimeline({ status }) {
  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-3 border border-red-200 bg-red-50 rounded-lg p-4">
        <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0">
          <FiX size={16} />
        </div>
        <p className="text-red-700 font-medium">This order was cancelled</p>
      </div>
    );
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="flex">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step} className="flex flex-col items-center flex-1 last:flex-none">
            <div className="flex items-center w-full">
              <div
                className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  done || active
                    ? 'bg-black text-white'
                    : 'bg-black/10 text-black/40'
                } ${active ? 'ring-4 ring-[var(--color-gold)]/30' : ''}`}
              >
                {done ? <FiCheck size={13} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-[1.5px] ${done ? 'bg-black' : 'bg-black/10'}`} />
              )}
            </div>
            <span
              className={`text-[10px] uppercase tracking-wide mt-2 text-center leading-tight ${
                active ? 'text-black font-semibold' : done ? 'text-black/60' : 'text-black/30'
              }`}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
