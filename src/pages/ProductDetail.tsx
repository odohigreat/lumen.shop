import { useParams } from 'react-router-dom';
import { NotFound } from './NotFound';
import { ProductInfo } from '../components/product/ProductInfo';
import { ProductGallery } from '../components/product/ProductGallery';
import { MOCK_PRODUCTS } from '../data/mockData';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  const product = MOCK_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return <NotFound />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <ProductGallery key={product.id} images={product.images} productName={product.name} />
        <ProductInfo key={product.id} product={product} />
      </div>
    </div>
  );
}
