import { useRef, useState } from 'react';
import { FiZoomIn } from 'react-icons/fi';
import ProductImage from './ProductImage';

export default function ProductGallery({ product }) {
  const images = product.images?.length ? product.images : [];
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const containerRef = useRef(null);

  const displayProduct = images.length
    ? { ...product, image: images[active] }
    : product;

  const onMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div>
      <div
        ref={containerRef}
        className="relative aspect-square bg-[var(--color-cream)] rounded-lg overflow-hidden cursor-zoom-in select-none"
        onMouseMove={onMouseMove}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        <div
          className="w-full h-full transition-transform duration-200 ease-out"
          style={{ transform: zoomed ? 'scale(2)' : 'scale(1)', transformOrigin: origin }}
        >
          <ProductImage product={displayProduct} />
        </div>
        {!zoomed && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white rounded-full p-2 pointer-events-none">
            <FiZoomIn size={14} />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-3">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`w-16 h-16 rounded overflow-hidden border-2 shrink-0 transition-colors ${
                active === i ? 'border-[var(--color-gold)]' : 'border-transparent hover:border-black/20'
              }`}
            >
              <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
