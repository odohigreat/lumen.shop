import { Link } from 'react-router-dom';
export function NotFound() {
  return (
    <div className="px-4 py-24 text-center">
      <p className="text-muted mb-4">404</p>
      <h1 className="text-4xl font-serif mb-6">Page not found</h1>
      <p className="text-muted mb-8">The page you are looking for is unavailable.</p>
      <Link to="/shop" className="underline">
        Explore the shop
      </Link>
    </div>
  );
}
