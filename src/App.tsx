import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// Strict Lazy Loading for pages and heavy components
const Home = React.lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Shop = React.lazy(() => import('./pages/Shop').then(m => ({ default: m.Shop })));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Journal = React.lazy(() => import('./pages/Journal').then(m => ({ default: m.Journal })));
const Collections = React.lazy(() => import('./pages/Collections').then(m => ({ default: m.Collections })));
const About = React.lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const FAQ = React.lazy(() => import('./pages/FAQ').then(m => ({ default: m.FAQ })));
const ShippingReturns = React.lazy(() => import('./pages/ShippingReturns').then(m => ({ default: m.ShippingReturns })));
const Contact = React.lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Sustainability = React.lazy(() => import('./pages/Sustainability').then(m => ({ default: m.Sustainability })));
const Legal = React.lazy(() => import('./pages/Legal').then(m => ({ default: m.Legal })));

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
            <Route path="/collections" element={<Collections />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/shipping-returns" element={<ShippingReturns />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/legal" element={<Legal />} />
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
