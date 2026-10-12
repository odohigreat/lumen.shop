import { Link } from 'react-router-dom';
import { MOCK_COLLECTIONS } from '../data/mockData';
export function Collections() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-serif text-center mb-6">Curated Collections</h1>
      <p className="text-muted text-center mb-12">Considered edits of our enduring essentials.</p>
      <div className="grid md:grid-cols-2 gap-8">
        {MOCK_COLLECTIONS.map((c) => (
          <Link key={c.id} to={`/collection/${c.id}`} className="group">
            <img
              src={c.image}
              alt={c.title}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover mb-6"
            />
            <h2 className="text-2xl font-serif mb-2">{c.title}</h2>
            <p className="text-muted">{c.description}</p>
            <span className="block underline mt-4">Explore collection</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
