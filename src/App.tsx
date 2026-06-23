import React, { Suspense } from 'react';
import { Layout } from './components/layout/Layout';
import { ProductInfo } from './components/product/ProductInfo';
import { ProductGallery } from './components/product/ProductGallery';
import { MOCK_PRODUCT } from './data/mockProduct';

// Strict Lazy Loading for heavy transactional components
const CartSidebar = React.lazy(() => import('./components/cart/CartSidebar').then(m => ({ default: m.CartSidebar })));
const CheckoutModal = React.lazy(() => import('./components/checkout/CheckoutModal').then(m => ({ default: m.CheckoutModal })));

export default function App() {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <ProductGallery images={MOCK_PRODUCT.images} />
          <ProductInfo product={MOCK_PRODUCT} />
        </div>
      </div>
      
      {/* Code Split Modals & Sidebars */}
      <Suspense fallback={null}>
        <CartSidebar />
        <CheckoutModal />
      </Suspense>
    </Layout>
  );
}
