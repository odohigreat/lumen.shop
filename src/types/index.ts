export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  variants: Variant[];
}

export interface Variant {
  id: string;
  color: string;
  colorCode: string;
  size: string;
  inventory: number;
}

export interface CartItem {
  id: string;
  product: Product;
  variant: Variant;
  quantity: number;
}

export interface OrderPayload {
  items: CartItem[];
  total: number;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };
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
