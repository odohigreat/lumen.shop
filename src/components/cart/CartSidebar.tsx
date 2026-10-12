import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { selectCartTotal, useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import { Button } from '../ui/Button';
import { formatCurrency, cn } from '../../utils';
import { useOverlay } from '../../hooks/useOverlay';

export function CartSidebar() {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, removeItem, updateQuantity, persistenceIssue, retryPersistence } = useCartStore();
  const cartTotal = useCartStore(selectCartTotal);
  const ref = useOverlay(isCartOpen, closeCart);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 transition-opacity duration-300',
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div
        ref={ref}
        role="dialog"
        aria-modal={isCartOpen || undefined}
        aria-label="Your cart"
        tabIndex={-1}
        inert={!isCartOpen}
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-border z-50 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col',
          isCartOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-serif font-bold tracking-tight">Your Cart</h2>
          <button
            aria-label="Close cart"
            onClick={closeCart}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {persistenceIssue && (
          <div role="status" className="px-6 py-4 border-b border-border text-sm">
            <p>
              {persistenceIssue === 'unavailable'
                ? 'Your cart works in this session, but browser storage is unavailable. Changes may be lost when you leave.'
                : 'Some saved cart data could not be restored. Review your selections before continuing.'}
            </p>
            <button type="button" onClick={retryPersistence} className="underline mt-2">
              {persistenceIssue === 'corrupt' ? 'Save current cart' : 'Retry cart storage'}
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted space-y-4">
              <ShoppingBag className="w-12 h-12 opacity-20" />
              <p className="font-medium">Your cart is empty.</p>
              <Button variant="outline" onClick={closeCart}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-24 aspect-[3/4] bg-secondary overflow-hidden">
                  <img
                    src={item.product.images[0].replace('.png', '-480.webp')}
                    alt={item.product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium text-sm line-clamp-1">{item.product.name}</h3>
                      <button
                        aria-label={`Remove ${item.product.name}, ${item.variant.color}, ${item.variant.size}`}
                        onClick={() => removeItem(item.id)}
                        className="text-muted hover:text-error transition-colors min-h-11 min-w-11 inline-flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted mb-2">
                      {item.variant.color} / {item.variant.size}
                    </p>
                    <p className="text-sm font-medium">{formatCurrency(item.product.price)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-border">
                      <button
                        aria-label={`Decrease quantity of ${item.product.name}, ${item.variant.color}, ${item.variant.size}`}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="min-h-11 min-w-11 inline-flex items-center justify-center hover:bg-secondary transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        aria-label={`Increase quantity of ${item.product.name}, ${item.variant.color}, ${item.variant.size}`}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="min-h-11 min-w-11 inline-flex items-center justify-center hover:bg-secondary transition-colors"
                        disabled={item.quantity >= item.variant.inventory}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-border bg-surface/50 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
              <span className="font-medium text-muted">Subtotal</span>
              <span className="font-serif text-xl font-bold">{formatCurrency(cartTotal)}</span>
            </div>
            <p className="text-xs text-muted mb-6">
              Demo cart. No payment or order will be created.
            </p>
            <Button
              className="w-full h-14 text-base tracking-wide"
              onClick={() => {
                // Open Checkout
                window.dispatchEvent(new CustomEvent('open-checkout'));
              }}
            >
              Preview Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
