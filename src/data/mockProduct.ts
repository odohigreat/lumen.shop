import type { Product } from '../types';

export const MOCK_PRODUCT: Product = {
  id: 'prod-lumen-01',
  name: 'The Essential Overcoat',
  description: 'Meticulously tailored from a luxurious wool blend, this overcoat features a minimalist silhouette with dropped shoulders and a refined drape. Designed for effortless layering and timeless appeal.',
  price: 495.00,
  category: 'Outerwear',
  images: [
    'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2000&auto=format&fit=crop',
  ],
  variants: [
    { id: 'v-01', color: 'Charcoal', colorCode: '#3f3f46', size: 'S', inventory: 5 },
    { id: 'v-02', color: 'Charcoal', colorCode: '#3f3f46', size: 'M', inventory: 12 },
    { id: 'v-03', color: 'Charcoal', colorCode: '#3f3f46', size: 'L', inventory: 0 },
    { id: 'v-04', color: 'Camel', colorCode: '#c2b280', size: 'S', inventory: 2 },
    { id: 'v-05', color: 'Camel', colorCode: '#c2b280', size: 'M', inventory: 8 },
    { id: 'v-06', color: 'Camel', colorCode: '#c2b280', size: 'L', inventory: 3 },
  ]
};
