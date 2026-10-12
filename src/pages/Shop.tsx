import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ui/ProductCard';
import { MOCK_PRODUCTS } from '../data/mockData';
export function Shop() {
  // The URL owns filter state so a shared link or reload keeps the same results.
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '',
    category = params.get('category') ?? '',
    sort = params.get('sort') ?? 'featured';
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    // Typing a search should not add a browser history entry for every character.
    setParams(next, { replace: true });
  };
  const products = MOCK_PRODUCTS.filter(
    (p) =>
      (!category || p.category === category) &&
      `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(query.trim().toLowerCase()),
  ).sort((a, b) =>
    sort === 'price-asc'
      ? a.price - b.price
      : sort === 'price-desc'
        ? b.price - a.price
        : sort === 'name'
          ? a.name.localeCompare(b.name)
          : 0,
  );
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-serif mb-4">Shop All</h1>
      <p className="text-muted mb-10">Thoughtfully crafted pieces for a lasting wardrobe.</p>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <label className="space-y-2">
          Search
          <input
            type="search"
            autoComplete="off"
            value={query}
            onChange={(e) => update('q', e.target.value)}
            placeholder="Search products"
            className="w-full border border-border p-3"
          />
        </label>
        <label className="space-y-2">
          Category
          <select
            value={category}
            onChange={(e) => update('category', e.target.value)}
            className="w-full border border-border p-3"
          >
            <option value="">All categories</option>
            {[...new Set(MOCK_PRODUCTS.map((p) => p.category))].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          Sort by
          <select
            value={sort}
            onChange={(e) => update('sort', e.target.value)}
            className="w-full border border-border p-3"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>
      <p role="status" className="text-sm text-muted mb-8">
        {products.length} {products.length === 1 ? 'piece' : 'pieces'} found
      </p>
      {products.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index === 0} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="mb-4">No pieces match your search.</p>
          <button className="underline" onClick={() => setParams({})}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
