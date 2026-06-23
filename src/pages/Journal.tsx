import { MOCK_JOURNAL } from '../data/mockData';

export function Journal() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 animate-in fade-in duration-500">
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter mb-6">The Journal</h1>
        <p className="text-muted text-lg max-w-2xl mx-auto text-balance">
          Stories, interviews, and editorial features exploring the intersections of design, craft, and lifestyle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {MOCK_JOURNAL.map((article) => (
          <article key={article.id} className="group cursor-pointer">
            <div className="relative aspect-[4/3] mb-6 overflow-hidden bg-secondary">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-xs font-medium text-muted uppercase tracking-wider">
                <span>{article.date}</span>
                <span className="w-1 h-1 bg-border rounded-full" />
                <span>{article.author}</span>
              </div>
              <h2 className="text-2xl font-serif font-bold tracking-tight group-hover:text-primary/80 transition-colors">
                {article.title}
              </h2>
              <p className="text-muted leading-relaxed">
                {article.excerpt}
              </p>
              <div className="pt-2 font-medium underline underline-offset-4 decoration-border group-hover:decoration-primary transition-colors">
                Read Article
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
