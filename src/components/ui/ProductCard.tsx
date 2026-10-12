import { useState } from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import type { Product } from '../../types';
import { formatCurrency, cn } from '../../utils';

interface ProductCardProps {
  product: Product;
  className?: string;
  index?: number;
  priority?: boolean;
}

// Catalog PNGs have matching 480px and 960px WebP files for responsive loading.
export function ProductCard({ product, className, index = 0, priority = false }: ProductCardProps) {
  const [showAlternate, setShowAlternate] = useState(false);
  const [alternateReady, setAlternateReady] = useState(false);
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
    >
      <Link
        to={`/product/${product.id}`}
        className={cn('group flex flex-col gap-4', className)}
        onPointerEnter={(event) => {
          if (event.pointerType !== 'touch') setShowAlternate(true);
        }}
        onFocus={() => setShowAlternate(true)}
      >
        <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
          <img
            src={product.images[0].replace('.png', '-960.webp')}
            srcSet={`${product.images[0].replace('.png', '-480.webp')} 480w, ${product.images[0].replace('.png', '-960.webp')} 960w`}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Hover views download on interaction, not while hidden in the grid. */}
          {showAlternate && product.images[1] && (
            <img
              src={product.images[1].replace('.png', '-960.webp')}
              srcSet={`${product.images[1].replace('.png', '-480.webp')} 480w, ${product.images[1].replace('.png', '-960.webp')} 960w`}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              loading="lazy"
              decoding="async"
              alt={`${product.name} — alternate view`}
              onLoad={() => setAlternateReady(true)}
              className={cn(
                'absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out opacity-0',
                alternateReady && 'group-hover:opacity-100 group-focus:opacity-100',
              )}
            />
          )}
        </div>
        <div className="flex flex-col items-center text-center">
          <h3 className="font-medium text-sm tracking-wide">{product.name}</h3>
          <p className="text-muted text-sm mt-1">{formatCurrency(product.price)}</p>
        </div>
      </Link>
    </m.div>
  );
}
