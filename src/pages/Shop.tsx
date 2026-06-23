import { ProductCard } from '../components/ui/ProductCard';
import { MOCK_PRODUCTS } from '../data/mockData';

export function Shop() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tighter mb-4">Shop All</h1>
        <p className="text-muted text-lg max-w-2xl text-balance">
          Explore our complete collection of carefully crafted pieces designed for longevity and timeless style.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {MOCK_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
