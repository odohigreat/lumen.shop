import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';

export function Navbar() {
  const cartCount = useCartStore((state) => state.cartCount);
  const openCart = useUIStore((state) => state.openCart);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button className="p-2 text-primary hover:text-muted transition-colors md:hidden">
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/images/logo.png" alt="Lumen Logo" className="h-6 w-6 object-contain" />
            <span className="text-xl font-serif font-bold tracking-tighter">LUMEN</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex gap-8">
          <Link to="/shop" className="text-sm font-medium hover:text-muted transition-colors">Shop All</Link>
          <Link to="/shop" className="text-sm font-medium hover:text-muted transition-colors">New Arrivals</Link>
          <Link to="/shop" className="text-sm font-medium hover:text-muted transition-colors">Collections</Link>
          <Link to="/journal" className="text-sm font-medium hover:text-muted transition-colors">Journal</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 text-primary hover:text-muted transition-colors hidden sm:block">
            <Search className="h-5 w-5" />
          </button>
          <button 
            onClick={openCart}
            className="group relative p-2 text-primary hover:text-muted transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-surface font-bold transition-transform duration-300 scale-in">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
