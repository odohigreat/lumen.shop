import { create, type StateCreator } from 'zustand';
import { persist, type PersistStorage } from 'zustand/middleware';
import type { CartItem, Product, Variant } from '../types/index.ts';
import { MOCK_PRODUCTS } from '../data/mockData.ts';

type PersistenceIssue = 'unavailable' | 'corrupt';
type PersistedCart = { items: CartItem[] };
type CartStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

interface CartState {
  persistenceIssue: PersistenceIssue | null;
  retryPersistence: () => void;
  items: CartItem[];
  addItem: (product: Product, variant: Variant, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}
// Derive totals from canonical items so mutations and reloads cannot leave stale totals.
export const selectCartTotal = (state: CartState) =>
  state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
export const selectCartCount = (state: CartState) =>
  state.items.reduce((total, item) => total + item.quantity, 0);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Saved carts can outlive catalog changes. Use current prices and stock,
// and merge duplicate variants before restoring the cart.
function restoreItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const restored = new Map<string, CartItem>();
  for (const raw of value as unknown[]) {
    if (!isRecord(raw) || !isRecord(raw.product) || !isRecord(raw.variant)) continue;
    const productId = raw.product.id;
    const variantId = raw.variant.id;
    if (typeof productId !== 'string' || typeof variantId !== 'string') continue;
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    const variant = product?.variants.find((v) => v.id === variantId);
    if (
      !product ||
      !variant ||
      variant.inventory < 1 ||
      typeof raw.quantity !== 'number' ||
      !Number.isInteger(raw.quantity) ||
      raw.quantity < 1
    )
      continue;
    const id = `${product.id}-${variant.id}`;
    const quantity = Math.min(variant.inventory, (restored.get(id)?.quantity ?? 0) + raw.quantity);
    restored.set(id, { id, product, variant, quantity });
  }
  return [...restored.values()];
}
// Resolve storage on each attempt: browser permissions can change during a session.
export function createCartStore(getStorage: () => CartStorage = () => window.localStorage) {
  const initialize: StateCreator<CartState, [], [['zustand/persist', PersistedCart]]> = (
    rawSet,
    get,
    api,
  ) => {
    let issue: PersistenceIssue | null = null;
    let unsaved = false;
    let restorationWarning = false;
    let pending: { state: PersistedCart; version?: number } | null = null;
    const reportIssue = (next: PersistenceIssue | null) => {
      if (next === 'corrupt') restorationWarning = true;
      // Saving a new selection does not acknowledge entries lost during restoration.
      if (next === null && restorationWarning) next = 'corrupt';
      issue = next;
      // Use the base setter so status updates do not trigger another storage write.
      if (get()) rawSet({ persistenceIssue: next });
    };
    const storage: PersistStorage<PersistedCart> = {
      getItem: (name) => {
        // A manual rehydrate must not replace newer unsaved selections with old disk data.
        if (unsaved) return pending;
        try {
          const text = getStorage().getItem(name);
          if (typeof text !== 'string' && text !== null)
            throw new Error('Expected synchronous storage');
          if (text === null) {
            reportIssue(null);
            return null;
          }
          const saved: unknown = JSON.parse(text);
          if (
            !isRecord(saved) ||
            !isRecord(saved.state) ||
            !Array.isArray(saved.state.items) ||
            (saved.version !== undefined && saved.version !== 0)
          ) {
            reportIssue('corrupt');
            return null;
          }
          reportIssue(null);
          return { state: { items: saved.state.items }, version: 0 };
        } catch (error) {
          reportIssue(error instanceof SyntaxError ? 'corrupt' : 'unavailable');
          return null;
        }
      },
      setItem: (name, value) => {
        pending = value;
        try {
          getStorage().setItem(name, JSON.stringify(value));
          unsaved = false;
          pending = null;
          reportIssue(null);
        } catch {
          unsaved = true;
          reportIssue('unavailable');
        }
      },
      removeItem: (name) => {
        try {
          getStorage().removeItem(name);
          if (!unsaved) reportIssue(null);
        } catch {
          reportIssue('unavailable');
        }
      },
    };
    return persist<CartState, [], [], PersistedCart>(
      (set, _get, persistedApi) => ({
        items: [],
        persistenceIssue: null,
        retryPersistence: () => {
          if (unsaved || issue === 'corrupt') {
            restorationWarning = false;
            // Save current memory, including removals, instead of reloading stale selections.
            set({ items: get().items });
          } else {
            // A failed initial read may recover an existing cart once storage is available.
            void persistedApi.persist.rehydrate();
          }
        },
        addItem: (product, variant, quantity = 1) => {
          if (!Number.isInteger(quantity) || quantity < 1 || variant.inventory < 1) return;
          set((state) => {
            // A product can have multiple sizes/colors in the cart; each exact variant is a line.
            const id = `${product.id}-${variant.id}`;
            const existing = state.items.find((item) => item.id === id);
            return {
              items: existing
                ? state.items.map((item) =>
                    item.id === id
                      ? { ...item, quantity: Math.min(variant.inventory, item.quantity + quantity) }
                      : item,
                  )
                : [
                    ...state.items,
                    { id, product, variant, quantity: Math.min(variant.inventory, quantity) },
                  ],
            };
          });
        },
        removeItem: (id) =>
          set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
        updateQuantity: (id, quantity) => {
          if (!Number.isInteger(quantity) || quantity < 1) return;
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id
                ? { ...item, quantity: Math.min(item.variant.inventory, quantity) }
                : item,
            ),
          }));
        },
        clearCart: () => set({ items: [] }),
      }),
      {
        name: 'dtc-cart-storage',
        storage,
        partialize: (state) => ({ items: state.items }),
        merge: (saved, current) => {
          const items = isRecord(saved) ? restoreItems(saved.items) : current.items;
          // Warn when malformed or removed catalog entries were dropped during restoration.
          if (
            isRecord(saved) &&
            Array.isArray(saved.items) &&
            saved.items.some((item) => restoreItems([item]).length === 0)
          ) {
            restorationWarning = true;
            issue = 'corrupt';
          }
          return { ...current, items, persistenceIssue: issue };
        },
      },
    )(rawSet, get, api);
  };
  return create<CartState>()(initialize);
}

export const useCartStore = createCartStore();
