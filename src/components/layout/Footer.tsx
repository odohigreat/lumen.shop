export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <a href="/" className="text-2xl font-serif font-bold tracking-tighter block mb-4">
              LUMEN
            </a>
            <p className="text-sm text-muted max-w-sm text-balance">
              Redefining boutique minimalism. Thoughtfully curated essentials for the modern lifestyle.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 tracking-wide text-sm">SUPPORT</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 tracking-wide text-sm">COMPANY</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms & Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>&copy; {new Date().getFullYear()} Lumen Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
