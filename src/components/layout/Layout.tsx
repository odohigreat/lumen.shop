import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col selection:bg-primary selection:text-surface">
      <Navbar />
      <main className="flex-1 relative">
        {children}
      </main>
      <Footer />
    </div>
  );
}
