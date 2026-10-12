import { Link, useParams } from 'react-router-dom';
import { MOCK_COLLECTIONS, MOCK_PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/ui/ProductCard';
import { NotFound } from './NotFound';
export function CollectionDetail() {
  const { id } = useParams();
  const collection = MOCK_COLLECTIONS.find((c) => c.id === id);
  if (!collection) return <NotFound />;
  return (
    <div className="container mx-auto px-4 py-16">
      <Link className="underline" to="/collections">
        All collections
      </Link>
      <h1 className="text-4xl font-serif mt-8 mb-4">{collection.title}</h1>
      <p className="text-muted mb-12">{collection.description}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {MOCK_PRODUCTS.filter((p) => collection.featuredProductIds.includes(p.id)).map(
          (product) => (
            <ProductCard key={product.id} product={product} />
          ),
        )}
      </div>
    </div>
  );
}
