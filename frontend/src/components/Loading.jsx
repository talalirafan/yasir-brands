export default function Loading({ label = 'Loading...', full = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        full ? 'min-h-[60vh]' : 'py-20'
      }`}
    >
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-2 border-black/10" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--color-gold)] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[var(--color-gold)] text-lg font-serif italic">Y</span>
        </div>
      </div>
      <p className="uppercase tracking-[3px] text-xs text-black/40">{label}</p>
    </div>
  );
}
