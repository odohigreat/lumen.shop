import type { Product, Collection, JournalArticle } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-lumen-01',
    name: 'The Essential Overcoat',
    description: 'Meticulously tailored from a luxurious wool blend, this overcoat features a minimalist silhouette with dropped shoulders and a refined drape. Designed for effortless layering and timeless appeal.',
    price: 495.00,
    category: 'Outerwear',
    images: [
      '/images/overcoat_1.png',
      '/images/overcoat_2.png'
    ],
    variants: [
      { id: 'v-01', color: 'Charcoal', colorCode: '#3f3f46', size: 'S', inventory: 5 },
      { id: 'v-02', color: 'Charcoal', colorCode: '#3f3f46', size: 'M', inventory: 12 },
      { id: 'v-03', color: 'Charcoal', colorCode: '#3f3f46', size: 'L', inventory: 0 },
      { id: 'v-04', color: 'Camel', colorCode: '#c2b280', size: 'S', inventory: 2 },
      { id: 'v-05', color: 'Camel', colorCode: '#c2b280', size: 'M', inventory: 8 },
      { id: 'v-06', color: 'Camel', colorCode: '#c2b280', size: 'L', inventory: 3 },
    ]
  },
  {
    id: 'prod-lumen-02',
    name: 'Merino Wool Turtleneck',
    description: 'A versatile staple crafted from ultra-fine Merino wool. Features a seamless construction and a ribbed collar that holds its shape. Perfect for transitional weather.',
    price: 145.00,
    category: 'Knitwear',
    images: [
      '/images/turtleneck_1.png',
      '/images/turtleneck_2.png'
    ],
    variants: [
      { id: 'v-11', color: 'Black', colorCode: '#000000', size: 'S', inventory: 10 },
      { id: 'v-12', color: 'Black', colorCode: '#000000', size: 'M', inventory: 15 },
      { id: 'v-13', color: 'Black', colorCode: '#000000', size: 'L', inventory: 5 },
      { id: 'v-14', color: 'Ivory', colorCode: '#f3eed9', size: 'S', inventory: 2 },
      { id: 'v-15', color: 'Ivory', colorCode: '#f3eed9', size: 'M', inventory: 4 },
    ]
  },
  {
    id: 'prod-lumen-03',
    name: 'Structured Canvas Tote',
    description: 'Constructed from heavy-weight organic canvas with Italian leather trims. Features an internal zip pocket, magnetic closure, and reinforced top handles.',
    price: 220.00,
    category: 'Accessories',
    images: [
      '/images/tote_1.png',
      '/images/tote_2.png'
    ],
    variants: [
      { id: 'v-21', color: 'Natural', colorCode: '#e8e6df', size: 'One Size', inventory: 25 },
      { id: 'v-22', color: 'Olive', colorCode: '#556b2f', size: 'One Size', inventory: 12 },
    ]
  },
  {
    id: 'prod-lumen-04',
    name: 'Tailored Wide-Leg Trousers',
    description: 'High-waisted trousers with a relaxed, wide-leg fit. Detailed with front pleats and side adjusters for a customizable waistline.',
    price: 185.00,
    category: 'Bottoms',
    images: [
      '/images/trousers_1.png',
      '/images/trousers_2.png'
    ],
    variants: [
      { id: 'v-31', color: 'Navy', colorCode: '#000080', size: 'S', inventory: 8 },
      { id: 'v-32', color: 'Navy', colorCode: '#000080', size: 'M', inventory: 10 },
      { id: 'v-33', color: 'Sand', colorCode: '#c2b280', size: 'S', inventory: 4 },
    ]
  }
];

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'col-01',
    title: 'Autumn Edit',
    description: 'Curated layers and textured essentials for the shifting season.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop',
    featuredProductIds: ['prod-lumen-01', 'prod-lumen-02']
  },
  {
    id: 'col-02',
    title: 'The Core Collection',
    description: 'Everyday pieces built with uncompromising quality and minimal design.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop',
    featuredProductIds: ['prod-lumen-02', 'prod-lumen-03', 'prod-lumen-04']
  }
];

export const MOCK_JOURNAL: JournalArticle[] = [
  {
    id: 'article-01',
    title: 'The Art of Layering',
    excerpt: 'Mastering proportion and texture for effortless transitional style.',
    content: 'Layering is an art form that balances functionality with aesthetic depth. This season, focus on...',
    image: 'https://images.unsplash.com/photo-1485230405346-71acb9518d9c?q=80&w=2000&auto=format&fit=crop',
    date: 'Oct 12, 2026',
    author: 'Lumen Editorial'
  },
  {
    id: 'article-02',
    title: 'In Conversation: Our Factories',
    excerpt: 'A look inside the family-owned Italian mills behind our winter knits.',
    content: 'We travelled to Northern Italy to document the intricate process of creating our signature Merino pieces...',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop',
    date: 'Sep 28, 2026',
    author: 'Lumen Editorial'
  }
];
