export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  variants: Variant[];
}

// Inventory belongs to a specific color/size combination, not the whole product.
export interface Variant {
  id: string;
  color: string;
  colorCode: string;
  size: string;
  inventory: number;
}

// The line ID combines product and variant IDs; quantity is validated by the store.
export interface CartItem {
  id: string;
  product: Product;
  variant: Variant;
  quantity: number;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  image: string;
  featuredProductIds: string[];
}

export interface JournalArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
}
