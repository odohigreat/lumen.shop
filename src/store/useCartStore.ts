import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, Variant } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, variant: Variant, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  get cartTotal(): number;
  get cartCount(): number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const id = `${product.id}-${variant.id}`;
          const existingItem = state.items.find((item) => item.id === id);
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          
          return {
            items: [...state.items, { id, product, variant, quantity }],
          };
        });
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      get cartTotal() {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
      
      get cartCount() {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'dtc-cart-storage',
    }
  )
);
