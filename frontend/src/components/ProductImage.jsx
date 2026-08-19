import { useState } from 'react';

// Deterministic gold-tone gradient per product so placeholders stay visually distinct.
const GRADIENTS = [
  'linear-gradient(135deg, #1a1a1a 0%, #3d2f10 55%, #b98d3e 100%)',
  'linear-gradient(135deg, #0b0b0d 0%, #4a3a1c 55%, #d4af6a 100%)',
  'linear-gradient(135deg, #241a0a 0%, #5c451f 55%, #c9a24b 100%)',
];

function hashName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return hash;
}

export default function ProductImage({ product, className = '' }) {
  const [broken, setBroken] = useState(false);
  const hasImage = product.image && !broken;

  if (hasImage) {
    return (
      <img
        src={product.image}
        alt={product.name}
        className={`w-full h-full object-cover ${className}`}
        onError={() => setBroken(true)}
      />
    );
  }

  const gradient = GRADIENTS[hashName(product.name || '') % GRADIENTS.length];

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center text-center px-4 ${className}`}
      style={{ background: gradient }}
    >
      <p className="uppercase tracking-[3px] text-[10px] text-[var(--color-gold)] mb-2">
        Yasir Fragrances
      </p>
      <p className="text-white text-xl font-semibold tracking-wide">{product.name}</p>
      <p className="text-white/50 text-xs mt-2">{product.size || '100ml'}</p>
    </div>
  );
}
