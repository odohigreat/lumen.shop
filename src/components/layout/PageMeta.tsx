import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MOCK_PRODUCTS, MOCK_COLLECTIONS, MOCK_JOURNAL } from '../../data/mockData';
const pages: Record<string, [string, string]> = {
  '/': [
    'Considered essentials',
    'Discover Lumen: thoughtfully curated clothing and accessories for a lasting wardrobe.',
  ],
  '/shop': [
    'Shop',
    'Explore clothing and accessories. Search, filter, and find your next essential.',
  ],
  '/collections': ['Collections', 'Explore seasonal edits and our core collection.'],
  '/journal': ['Journal', 'Ideas on style, care, and thoughtful design.'],
  '/about': ['Our story', 'The philosophy and craft behind Lumen.'],
  '/faq': ['Frequently asked questions', 'Answers to common questions about the Lumen storefront.'],
  '/contact': ['Contact', 'Explore client services and preview the contact form.'],
  '/shipping-returns': [
    'Shipping and returns',
    'Illustrative delivery options and return policy for the Lumen demo.',
  ],
  '/sustainability': [
    'Sustainability',
    'Explore our approach to materials and thoughtful production.',
  ],
  '/legal': ['Legal information', 'Privacy and terms information for the Lumen storefront.'],
};
export function PageMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const id = pathname.split('/')[2];
    const product = pathname.startsWith('/product/')
      ? MOCK_PRODUCTS.find((p) => p.id === id)
      : undefined;
    const collection = pathname.startsWith('/collection/')
      ? MOCK_COLLECTIONS.find((c) => c.id === id)
      : undefined;
    const article = pathname.startsWith('/journal/')
      ? MOCK_JOURNAL.find((a) => a.id === id)
      : undefined;
    const [name, description] = product
      ? [product.name, product.description]
      : collection
        ? [collection.title, collection.description]
        : article
          ? [article.title, article.excerpt]
          : (pages[pathname] ?? [
              'Page not found',
              'This page is unavailable. Explore the Lumen shop.',
            ]);
    const title = `${name} | LUMEN`;
    document.title = title;
    const meta = (key: string, value: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.append(element);
      }
      element.content = value;
    };
    const url = new URL(pathname, window.location.origin).href;
    meta('description', description);
    meta('og:title', title, true);
    meta('og:description', description, true);
    meta('og:url', url, true);
    meta('og:type', article ? 'article' : 'website', true);
    const image = new URL(
      product?.images[0] ?? collection?.image ?? article?.image ?? '/images/products/overcoat_1.png',
      window.location.origin,
    ).href;
    meta('og:image', image, true);
    meta('twitter:card', 'summary_large_image');
    meta('twitter:title', title);
    meta('twitter:description', description);
    meta('twitter:image', image);
    meta(
      'robots',
      pages[pathname] || product || collection || article ? 'index,follow' : 'noindex,follow',
    );
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = url;
    // Remove the previous product's metadata when navigating to another route.
    document.getElementById('product-schema')?.remove();
    if (product) {
      const schema = document.createElement('script');
      schema.id = 'product-schema';
      schema.type = 'application/ld+json';
      schema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.images.map((path) => new URL(path, window.location.origin).href),
        category: product.category,
        color: [...new Set(product.variants.map((v) => v.color))],
        brand: { '@type': 'Brand', name: 'Lumen' },
        url,
      });
      document.head.append(schema);
    }
  }, [pathname]);
  return null;
}
