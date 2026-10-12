import { useState, useMemo } from 'react';
import type { Product } from '../../types';
import { formatCurrency, cn } from '../../utils';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';

export function ProductInfo({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);

  const colors = useMemo(() => {
    const map = new Map<string, string>();
    product.variants.forEach((v) => map.set(v.color, v.colorCode));
    return Array.from(map.entries()).map(([color, colorCode]) => ({ color, colorCode }));
  }, [product.variants]);

  const sizes = useMemo(() => {
    return Array.from(new Set(product.variants.map((v) => v.size)));
  }, [product.variants]);

  const [selectedColor, setSelectedColor] = useState(colors[0].color);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [guideOpen, setGuideOpen] = useState(false);
  const items = useCartStore((s) => s.items);

  // Color and size alone are not purchasable: resolve the exact catalog variant first.
  const selectedVariant = useMemo(() => {
    return product.variants.find((v) => v.color === selectedColor && v.size === selectedSize);
  }, [product.variants, selectedColor, selectedSize]);

  // Account for units already in the cart, not just the variant's initial inventory.
  const atLimit = Boolean(
    selectedVariant &&
    (items.find((item) => item.id === `${product.id}-${selectedVariant.id}`)?.quantity ?? 0) >=
      selectedVariant.inventory,
  );

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    // Retain a valid size; otherwise choose the first in-stock size for this color.
    const sizeStillAvailable = product.variants.some(
      (variant) =>
        variant.color === color && variant.size === selectedSize && variant.inventory > 0,
    );
    if (!sizeStillAvailable) {
      setSelectedSize(
        product.variants.find((variant) => variant.color === color && variant.inventory > 0)
          ?.size ?? sizes[0],
      );
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.inventory < 1 || atLimit) return;

    addItem(product, selectedVariant, 1);
    openCart();
  };

  return (
    <div className="flex flex-col h-full justify-center lg:py-12">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tighter mb-4 text-balance">
          {product.name}
        </h1>
        <p className="text-xl text-muted font-medium mb-6">{formatCurrency(product.price)}</p>
        <p className="text-base leading-relaxed text-primary/80 text-balance max-w-xl">
          {product.description}
        </p>
      </div>

      <div className="space-y-8 mb-8">
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold tracking-wide">Color</span>
            <span className="text-sm text-muted">{selectedColor}</span>
          </div>
          <div className="flex gap-3">
            {colors.map(({ color, colorCode }) => (
              <button
                key={color}
                aria-pressed={selectedColor === color}
                onClick={() => handleColorChange(color)}
                className={cn(
                  'w-10 h-10 rounded-full border-2 transition-all duration-300',
                  selectedColor === color
                    ? 'border-primary scale-110'
                    : 'border-transparent hover:scale-105',
                )}
                style={{ backgroundColor: colorCode }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold tracking-wide">Size</span>
            <button
              type="button"
              onClick={() => setGuideOpen(true)}
              className="text-sm text-muted underline underline-offset-4 hover:text-primary transition-colors"
            >
              Size Guide
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {sizes.map((size) => {
              const variant = product.variants.find(
                (v) => v.color === selectedColor && v.size === size,
              );
              const isAvailable = variant && variant.inventory > 0;
              const isSelected = selectedSize === size;

              return (
                <button
                  key={size}
                  onClick={() => isAvailable && setSelectedSize(size)}
                  aria-pressed={isSelected}
                  disabled={!isAvailable}
                  className={cn(
                    'h-12 border transition-all duration-300 font-medium text-sm',
                    isSelected
                      ? 'border-primary bg-primary text-surface'
                      : 'border-border hover:border-primary',
                    !isAvailable &&
                      'opacity-40 cursor-not-allowed line-through hover:border-border',
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full h-14 text-base tracking-wide"
        disabled={!selectedVariant || selectedVariant.inventory === 0 || atLimit}
        onClick={handleAddToCart}
      >
        {!selectedVariant || selectedVariant.inventory === 0
          ? 'Out of Stock'
          : atLimit
            ? 'Stock limit reached'
            : 'Add to Cart'}
      </Button>

      {guideOpen && (
        <Dialog title="Size guide" onClose={() => setGuideOpen(false)}>
          <p className="text-muted mb-4">
            Sizes shown are the available labels for this piece. Exact garment measurements are not
            available in this demo.
          </p>
          <ul className="space-y-2">
            {sizes.map((size) => (
              <li key={size} className="border-b border-border py-2">
                {size}
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Compare the fit with a similar garment you own. Contact the store for verified
            measurements before purchasing.
          </p>
        </Dialog>
      )}
      <div className="mt-8 pt-8 border-t border-border grid grid-cols-2 gap-4 text-sm text-muted">
        <div>
          <span className="block font-medium text-primary mb-1">Free Shipping</span>
          On orders over $200
        </div>
        <div>
          <span className="block font-medium text-primary mb-1">Returns</span>
          Within 30 days
        </div>
      </div>
    </div>
  );
}
