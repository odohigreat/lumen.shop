import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useOverlay } from '../../hooks/useOverlay';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { selectCartCount, useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';

export function Navbar() {
  const cartCount = useCartStore(selectCartCount);
  const openCart = useUIStore((state) => state.openCart);
  const location = useLocation();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const isMobileMenuOpen = menuPath === location.pathname;
  const closeMenu = () => setMenuPath(null);
  const menuRef = useOverlay(isMobileMenuOpen, closeMenu);
  const toggleMobileMenu = () => setMenuPath(isMobileMenuOpen ? null : location.pathname);

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Collections', path: '/collections' },
    { name: 'Our Story', path: '/about' },
    { name: 'Journal', path: '/journal' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              className="p-2 text-primary hover:text-muted transition-colors md:hidden"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="/images/brand/logo-64.png"
                srcSet="/images/brand/logo-64.png 64w, /images/brand/logo-128.png 128w"
                sizes="24px"
                width="24"
                height="24"
                alt="Lumen Logo"
                className="h-6 w-6 object-contain"
              />
              <span className="text-xl font-serif font-bold tracking-tighter">LUMEN</span>
            </Link>
          </div>

          <nav className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium hover:text-muted transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/shop"
              aria-label="Search products"
              className="p-2 text-primary hover:text-muted transition-colors hidden sm:block"
            >
              <Search className="h-5 w-5" />
            </Link>
            <button
              aria-label={`Open cart, ${cartCount} items`}
              onClick={() => {
                closeMenu();
                openCart();
              }}
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

      {/* Mobile Menu Overlay */}
      <div
        ref={menuRef}
        id="mobile-menu"
        inert={!isMobileMenuOpen}
        role={isMobileMenuOpen ? 'dialog' : undefined}
        aria-modal={isMobileMenuOpen || undefined}
        aria-label="Navigation menu"
        tabIndex={-1}
        className={`fixed inset-0 z-40 bg-surface/95 backdrop-blur-sm transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ top: '64px' }}
      >
        <nav className="flex flex-col p-6 space-y-6">
          <button onClick={closeMenu} className="text-left underline">
            Close menu
          </button>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              onClick={closeMenu}
              to={link.path}
              className="text-2xl font-serif text-primary hover:text-muted transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-6 border-t border-border mt-6">
            <Link
              to="/shop"
              onClick={closeMenu}
              className="flex items-center gap-3 text-lg font-medium text-primary hover:text-muted transition-colors"
            >
              <Search className="h-5 w-5" />
              Search
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
