import { useRef, useState } from 'react';
import { FiZoomIn } from 'react-icons/fi';
import ProductImage from './ProductImage';

export default function ZoomableProductImage({ product }) {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const containerRef = useRef(null);

  const onMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-zoom-in select-none"
      onMouseMove={onMouseMove}
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
      onClick={() => setZoomed((z) => !z)}
    >
      <div
        className="w-full h-full transition-transform duration-200 ease-out"
        style={{
          transform: zoomed ? 'scale(2)' : 'scale(1)',
          transformOrigin: origin,
        }}
      >
        <ProductImage product={product} />
      </div>
      {!zoomed && (
        <div className="absolute bottom-3 right-3 bg-black/60 text-white rounded-full p-2 pointer-events-none">
          <FiZoomIn size={14} />
        </div>
      )}
    </div>
  );
}
