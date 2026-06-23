import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// Strict Lazy Loading for pages and heavy components
const Home = React.lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Shop = React.lazy(() => import('./pages/Shop').then(m => ({ default: m.Shop })));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Journal = React.lazy(() => import('./pages/Journal').then(m => ({ default: m.Journal })));

const CartSidebar = React.lazy(() => import('./components/cart/CartSidebar').then(m => ({ default: m.CartSidebar })));
const CheckoutModal = React.lazy(() => import('./components/checkout/CheckoutModal').then(m => ({ default: m.CheckoutModal })));

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/journal" element={<Journal />} />
            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
        
        {/* Code Split Modals & Sidebars */}
        <Suspense fallback={null}>
          <CartSidebar />
          <CheckoutModal />
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
