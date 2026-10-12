# LUMEN code evidence guide

## 1. Introduction

This guide directs a technical evaluator to the actual source behind LUMEN’s custom product, cart and checkout-preview flows. Each example identifies the implementation, its engineering purpose and a reproducible behaviour check.

## 2. Architecture Overview

LUMEN is a client-rendered React/Vite application. React Router selects pages; a local typed catalogue supplies products and exact colour/size variants. Zustand owns cart state and separate UI state. Browser `localStorage` persists cart items through a guarded adapter, while Zod validates delivery details held in checkout component state. Completion is a frontend preview, with no order or payment request.

Review [domain models](../../src/types/index.ts), [catalogue](../../src/data/mockData.ts), [application composition](../../src/App.tsx) and the [architecture diagram](architecture/lumen-architecture.svg) ([Mermaid source](architecture/lumen-architecture.mmd)). TypeScript describes compile-time contracts; it does not validate arbitrary external catalogue data.

## 3. Key Custom Engineering Implementations

### 3.1 A. Zustand Cart State Management

[useCartStore.ts](../../src/store/useCartStore.ts): `createCartStore`, `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `selectCartTotal`, `selectCartCount`.

A cart line identifies a product/variant pair. Repeated additions merge that exact line, while another colour or size remains separate. Positive integer quantities are capped at the variant’s inventory. Totals and counts derive from canonical items rather than persisting duplicate calculated state. This keeps mutations, restoration and displayed totals consistent.

```ts
const id = `${product.id}-${variant.id}`;
quantity: Math.min(variant.inventory, item.quantity + quantity)
```

The excerpt shows the line identity and existing-line quantity cap. Verify two variants, additions up to stock, removal and clearing with [cart tests](../../scripts/test-cart.mjs).

### 3.2 B. Cart Persistence and Recovery

[useCartStore.ts](../../src/store/useCartStore.ts): `restoreItems`, guarded storage methods, `reportIssue`, `retryPersistence`, `partialize`, `merge`. [CartSidebar](../../src/components/cart/CartSidebar.tsx) presents recovery notices and controls.

Only items persist under `dtc-cart-storage`. Restoration resolves saved IDs against the current catalogue, refreshes prices/stock, merges duplicate lines and drops invalid or unavailable records. Envelope/version checks contain corrupt input. Guarded reads/writes/removal keep interactions functional in memory when storage fails.

Pending writes prevent rehydration from replacing unsaved selections with stale disk data. Retry saves current memory after a write failure or retries an initially failed read. Discarded-data warnings remain until acknowledged. This handles both consistency and truthful user feedback: storage failure is disclosed rather than described as a saved cart.

Verify reload persistence, malformed records and quota failures with fresh injectable stores in [test-cart.mjs](../../scripts/test-cart.mjs), then the browser fault-injection flow. Memory-only changes can still be lost on reload; there is no cross-tab synchronisation.

### 3.3 C. Product Variant Selection

[ProductInfo.tsx](../../src/components/product/ProductInfo.tsx): `selectedVariant`, `handleColorChange`, `atLimit`, `handleAddToCart`.

Colour and size resolve to one exact catalogue variant before addition. A colour change retains the selected size if in stock, otherwise falls back to the first available size. Missing combinations and zero-stock options are disabled. Existing cart quantity counts toward the cap, so repeatedly opening a product cannot bypass its stock limit. `useMemo` derives options and matching; no `React.memo` implementation is claimed.

Verify `/product/prod-lumen-02`: Black/L → Ivory falls back to S. Overcoat Charcoal/L is disabled; Camel/S reaches its limit at two. This demonstrates coordinated selection and cart constraints rather than independent cosmetic selectors. Photos represent products, not each colour.

### 3.4 D. Checkout Workflow and Zod Validation

[checkout.ts](../../src/components/checkout/checkout.ts): `deliverySchema`, `DeliveryData`, `ShippingMethod`, `calculateShipping`. [CheckoutModal.tsx](../../src/components/checkout/CheckoutModal.tsx): `step`, `handleReview`, delivery/review/completion branches.

Zod trims and validates email and delivery fields. `DeliveryData` is inferred from the schema, keeping compile-time types aligned with runtime validation. Postal code accepts an empty string; country is free text. `safeParse` maps issues into field errors before review and replaces input with validated, trimmed values. Editing preserves details; closing discards component memory. Completion retains the cart and checks storage status before saying it is saved.

```ts
export type DeliveryData = z.infer<typeof deliverySchema>;
return method === 'express' ? 25 : subtotal > 200 ? 0 : 8;
```

Standard delivery costs $8 at exactly $200 and is free strictly above $200; express costs $25. These are demo rates. Verify whitespace-only fields, malformed email, express review, edit-back and completion with [checkout tests](../../scripts/test-checkout.mjs) and the browser suite. Runtime validation and explicit state transitions make the flow inspectable; they do not provide server-side security.

### 3.5 E. React Architecture and Performance

[App.tsx](../../src/App.tsx): `React.lazy` dynamic imports, `Suspense`, `LazyMotion`/`domAnimation`. [ProductCard](../../src/components/ui/ProductCard.tsx), [ProductGallery](../../src/components/product/ProductGallery.tsx), [index.html](../../index.html) and [font styles](../../src/index.css) implement asset delivery.

Secondary routes and conditional cart/checkout overlays defer code; Home remains eager. A viewport loading reserve limits footer movement. Lightweight `m` components use a focused motion feature bundle. Components isolate gallery selection and conditional overlays without claiming memoisation that is absent.

Responsive WebP/logo sources reduce oversized requests. Alternate card images mount on hover/focus; the gallery mounts one active full-size view with 160px thumbnails. The first shop image is eager/high-priority. Local font preload/swap and homepage-only hero preload prioritise critical content. Verify build chunks and Network requests before/after interactions; [performance evidence](performance/PERFORMANCE_SUMMARY.md) separates historical comparisons from public representative reports. Individual savings were not experimentally isolated.

[Shop.tsx](../../src/pages/Shop.tsx) also uses `useSearchParams` and an `update` helper for query/category/sort. Cloned parameter updates replace history, avoiding a new entry per keystroke. Verify filters survive reload and an empty search offers reset. This is local catalogue filtering, not server search or request caching.

### 3.6 F. Accessibility and Error Handling

[useOverlay.ts](../../src/hooks/useOverlay.ts), [Dialog.tsx](../../src/components/ui/Dialog.tsx), [Input.tsx](../../src/components/ui/Input.tsx) and [ErrorBoundary.tsx](../../src/components/ui/ErrorBoundary.tsx).

The shared overlay hook contains keyboard focus, handles Escape, locks scrolling, makes the background inert and restores prior focus/state. It re-queries controls when checkout steps change; Dialog refocuses its changing title. Inputs associate labels and errors using accessibility attributes. ErrorBoundary offers reload recovery for render/lazy-load failures; event and storage failures require their separate guards.

Verify Tab/Shift-Tab, Escape, changing steps, mobile-menu closure and linked field errors. Shared lifecycle handling avoids divergent modal behaviours. Existing checks sample focus restoration; broader screen-reader, contrast and cross-browser testing remains outstanding.

### 3.7 G. Automated Testing

[Cart tests](../../scripts/test-cart.mjs), [checkout tests](../../scripts/test-checkout.mjs) and [browser checks](../../scripts/browser-check.mjs).

The native Node runner imports production TypeScript modules and supplies fresh injectable storage per cart case. Seventeen tests cover variants, stock, totals, reconciliation, invalid data, failed storage and recovery, plus schema/shipping boundaries. The Chrome DevTools runner uses a disposable profile and a loopback production preview to exercise routes, forms, focus and storage fault injection. Recorded coverage comprises 75 browser assertions; no large testing-framework dependency is introduced.

This tests failure paths against production logic instead of copying the implementation into fixtures. Run `npm test`, then serve a production build and run `npm run test:browser -- http://127.0.0.1:4176`. Passing samples do not certify every device or browser; the [README](../../README.md) describes prerequisites.

## 4. Code Inspection References

Use the detailed function names and verification steps above with these entry points:

| Implementation | Source entry point | Inspection focus |
| --- | --- | --- |
| Typed catalogue | [types/index.ts](../../src/types/index.ts), [mockData.ts](../../src/data/mockData.ts) | Product, Variant and CartItem contracts; fixed prices/stock |
| Cart and persistence | [useCartStore.ts](../../src/store/useCartStore.ts) | Mutation invariants, derived totals, guarded storage and reconciliation |
| Recovery UI | [CartSidebar.tsx](../../src/components/cart/CartSidebar.tsx) | Actionable warnings and retry/save-current controls |
| Variant selection | [ProductInfo.tsx](../../src/components/product/ProductInfo.tsx) | Exact matching, size fallback and cart-aware limits |
| Checkout | [checkout.ts](../../src/components/checkout/checkout.ts), [CheckoutModal.tsx](../../src/components/checkout/CheckoutModal.tsx) | Schema/type alignment, shipping boundaries and step transitions |
| Loading and assets | [App.tsx](../../src/App.tsx), [ProductCard.tsx](../../src/components/ui/ProductCard.tsx), [ProductGallery.tsx](../../src/components/product/ProductGallery.tsx) | Deferred work and controlled image requests |
| Overlay lifecycle | [useOverlay.ts](../../src/hooks/useOverlay.ts), [Dialog.tsx](../../src/components/ui/Dialog.tsx) | Focus, keyboard and cleanup behaviour |
| Regression coverage | [test-cart.mjs](../../scripts/test-cart.mjs), [test-checkout.mjs](../../scripts/test-checkout.mjs), [browser-check.mjs](../../scripts/browser-check.mjs) | Normal journeys and reproducible failure cases |

## 5. Recommended Evaluation Sequence

1. Review domain models and catalogue variant IDs.
2. Inspect cart mutations, selectors and persistence recovery.
3. Trace product selection into exact cart lines.
4. Follow schema validation through checkout review/completion.
5. Review loading, responsive images and overlay lifecycle.
6. Run unit tests and the production-preview browser suite.

## 6. Technical Boundaries

LUMEN is a custom frontend demonstration. Stock and prices are local fixtures; checkout creates no transaction. There is no real payment processing, backend order management, live stock synchronisation, database, delivered email, authentication or server-side validation. Form feedback and storage fault injection are frontend demonstrations, not external integrations. No screenshots or completed walkthrough video are included in this release. The project owner will prepare those separately.
