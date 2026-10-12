import { useState } from 'react';
import { cn } from '../../utils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      {/* Thumbnails */}
      <div className="hidden md:flex flex-col gap-4 w-20">
        {images.map((img, idx) => (
          <button
            key={idx}
            aria-label={`Show product view ${idx + 1}`}
            aria-pressed={activeIndex === idx}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              'relative aspect-[3/4] w-full overflow-hidden bg-secondary transition-all duration-300',
              activeIndex === idx
                ? 'ring-1 ring-primary ring-offset-1 opacity-100'
                : 'opacity-60 hover:opacity-100',
            )}
          >
            <img
              src={img.replace('.png', '-160.webp')}
              sizes="80px"
              alt={`${productName} — thumbnail ${idx + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Main Image with Magnifying Hover Effect */}
      <div className="relative flex-1 aspect-[3/4] md:aspect-auto md:h-[80vh] overflow-hidden bg-secondary group">
        {/* Mount only the selected full-size view; hidden views need not download. */}
        <img
          src={images[activeIndex].replace('.png', '-960.webp')}
          srcSet={`${images[activeIndex].replace('.png', '-480.webp')} 480w, ${images[activeIndex].replace('.png', '-960.webp')} 960w`}
          sizes="(min-width: 1024px) 50vw, 100vw"
          alt={`${productName} — view ${activeIndex + 1}`}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out origin-center group-hover:scale-110"
        />
      </div>

      {/* Mobile Dots */}
      <div className="flex md:hidden justify-center gap-2 mt-4">
        {images.map((_, idx) => (
          <button
            key={idx}
            aria-pressed={activeIndex === idx}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              'h-6 min-w-6 border-y-[10px] border-surface transition-all duration-300',
              activeIndex === idx ? 'w-8 bg-primary' : 'w-4 bg-border',
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
