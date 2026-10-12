import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig, LazyMotion, domAnimation } from 'framer-motion';
import { useUIStore } from './store/useUIStore';
import { PageMeta } from './components/layout/PageMeta';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { Home } from './pages/Home';
import { Layout } from './components/layout/Layout';
import { ScrollToTop } from './components/layout/ScrollToTop';

// Keep Home in the initial bundle to avoid a layout jump on first load.
// Other pages load on demand.
const CollectionDetail = React.lazy(() =>
  import('./pages/CollectionDetail').then((m) => ({ default: m.CollectionDetail })),
);
const ArticleDetail = React.lazy(() =>
  import('./pages/ArticleDetail').then((m) => ({ default: m.ArticleDetail })),
);
const NotFound = React.lazy(() =>
  import('./pages/NotFound').then((m) => ({ default: m.NotFound })),
);
const Shop = React.lazy(() => import('./pages/Shop').then((m) => ({ default: m.Shop })));
const ProductDetail = React.lazy(() =>
  import('./pages/ProductDetail').then((m) => ({ default: m.ProductDetail })),
);
const Journal = React.lazy(() => import('./pages/Journal').then((m) => ({ default: m.Journal })));
const Collections = React.lazy(() =>
  import('./pages/Collections').then((m) => ({ default: m.Collections })),
);
const About = React.lazy(() => import('./pages/About').then((m) => ({ default: m.About })));
const FAQ = React.lazy(() => import('./pages/FAQ').then((m) => ({ default: m.FAQ })));
const ShippingReturns = React.lazy(() =>
  import('./pages/ShippingReturns').then((m) => ({ default: m.ShippingReturns })),
);
const Contact = React.lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })));
const Sustainability = React.lazy(() =>
  import('./pages/Sustainability').then((m) => ({ default: m.Sustainability })),
);
const Legal = React.lazy(() => import('./pages/Legal').then((m) => ({ default: m.Legal })));

const CartSidebar = React.lazy(() =>
  import('./components/cart/CartSidebar').then((m) => ({ default: m.CartSidebar })),
);
const CheckoutModal = React.lazy(() =>
  import('./components/checkout/CheckoutModal').then((m) => ({ default: m.CheckoutModal })),
);

// Load the cart and checkout only when opened. Unmounting checkout discards form details.
function Overlays() {
  const isCartOpen = useUIStore((s) => s.isCartOpen);
  const closeCart = useUIStore((s) => s.closeCart);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  useEffect(() => {
    const open = () => {
      closeCart();
      setCheckoutOpen(true);
    };
    window.addEventListener('open-checkout', open);
    return () => window.removeEventListener('open-checkout', open);
  }, [closeCart]);
  return (
    <Suspense
      fallback={
        <p role="status" className="fixed bottom-4 right-4 bg-surface p-4 shadow">
          Opening…
        </p>
      }
    >
      {isCartOpen && <CartSidebar />}
      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} />}
    </Suspense>
  );
}
export default function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={domAnimation} strict>
          <BrowserRouter>
            <ScrollToTop />
            <PageMeta />
            <Layout>
              {/* Keep the footer below the viewport while a route chunk loads. */}
              <Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center">Loading...</div>
                }
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/collection/:id" element={<CollectionDetail />} />
                  <Route path="/journal/:id" element={<ArticleDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/shipping-returns" element={<ShippingReturns />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/sustainability" element={<Sustainability />} />
                  <Route path="/legal" element={<Legal />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Layout>
            <Overlays />
          </BrowserRouter>
        </LazyMotion>
      </MotionConfig>
    </ErrorBoundary>
  );
}
