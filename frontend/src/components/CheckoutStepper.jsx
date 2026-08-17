import { FiCheck } from 'react-icons/fi';

const steps = ['Cart', 'Address', 'Payment', 'Confirm'];

export default function CheckoutStepper({ current = 1 }) {
  return (
    <div className="flex items-center mb-8">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  done
                    ? 'bg-black text-white'
                    : active
                    ? 'bg-[var(--color-gold)] text-black'
                    : 'bg-black/10 text-black/40'
                }`}
              >
                {done ? <FiCheck size={14} /> : i + 1}
              </div>
              <span
                className={`text-[11px] uppercase tracking-wide whitespace-nowrap ${
                  active ? 'text-black font-medium' : 'text-black/40'
                }`}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-[1.5px] mx-2 mb-4 ${done ? 'bg-black' : 'bg-black/10'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
