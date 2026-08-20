import { useEffect, useState } from 'react';

// Crossfades through a list of background images on a timer — used for the
// home page collection tiles so a category with several products shows more
// than just one bottle.
export default function RotatingBanner({ images, alt, intervalMs = 3000, className = '' }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  return (
    <>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === index ? 'opacity-60 group-hover:opacity-70 group-hover:scale-105' : 'opacity-0'
          } ${className}`}
        />
      ))}
    </>
  );
}
