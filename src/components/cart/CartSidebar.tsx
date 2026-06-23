import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import { Button } from '../ui/Button';
import { formatCurrency, cn } from '../../utils';
import { useEffect } from 'react';

export function CartSidebar() {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, removeItem, updateQuantity, cartTotal } = useCartStore();

  // Lock body scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 transition-opacity duration-300",
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-border z-50 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-serif font-bold tracking-tight">Your Cart</h2>
          <button onClick={closeCart} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted space-y-4">
              <ShoppingBag className="w-12 h-12 opacity-20" />
              <p className="font-medium">Your cart is empty.</p>
              <Button variant="outline" onClick={closeCart}>Continue Shopping</Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-24 aspect-[3/4] bg-secondary overflow-hidden">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium text-sm line-clamp-1">{item.product.name}</h3>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-muted hover:text-error transition-colors p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted mb-2">
                      {item.variant.color} / {item.variant.size}
                    </p>
                    <p className="text-sm font-medium">
                      {formatCurrency(item.product.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-border">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-secondary transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-secondary transition-colors"
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
            <p className="text-xs text-muted mb-6">Shipping & taxes calculated at checkout.</p>
            <Button className="w-full h-14 text-base tracking-wide" onClick={() => {
              // Open Checkout
              window.dispatchEvent(new CustomEvent('open-checkout'));
            }}>
              Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
