import { useState } from 'react';
import { cn } from '../../utils';

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      {/* Thumbnails */}
      <div className="hidden md:flex flex-col gap-4 w-20">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              "relative aspect-[3/4] w-full overflow-hidden bg-secondary transition-all duration-300",
              activeIndex === idx ? "ring-1 ring-primary ring-offset-1 opacity-100" : "opacity-60 hover:opacity-100"
            )}
          >
            <img 
              src={img} 
              alt={`Thumbnail ${idx + 1}`} 
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Main Image with Magnifying Hover Effect */}
      <div className="relative flex-1 aspect-[3/4] md:aspect-auto md:h-[80vh] overflow-hidden bg-secondary group cursor-zoom-in">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Product View ${idx + 1}`}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out origin-center",
              "group-hover:scale-110", // Micro-animation zoom
              activeIndex === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            )}
          />
        ))}
      </div>
      
      {/* Mobile Dots */}
      <div className="flex md:hidden justify-center gap-2 mt-4">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              "h-1 transition-all duration-300",
              activeIndex === idx ? "w-8 bg-primary" : "w-4 bg-border"
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
