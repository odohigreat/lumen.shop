export function Collections() {
  const collections = [
    {
      id: 1,
      name: "The Essentials",
      description: "Timeless silhouettes designed for the modern wardrobe.",
      image: "https://images.unsplash.com/photo-1591369822096-114085449f87?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Studio Line",
      description: "Elevated materials meet architectural forms.",
      image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Lounge Archive",
      description: "Refined comfort for interior spaces.",
      image: "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?q=80&w=1200&auto=format&fit=crop"
    }
  ];

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="max-w-2xl mx-auto text-center mb-16 fade-in">
        <h1 className="text-4xl font-serif mb-4">Curated Collections</h1>
        <p className="text-muted text-balance">
          Discover our thoughtfully assembled ranges, each telling a unique story of craft and design.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((collection, index) => (
          <div 
            key={collection.id} 
            className="group cursor-pointer slide-up"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="aspect-[4/5] overflow-hidden bg-secondary mb-6 relative">
              <img 
                src={collection.image} 
                alt={collection.name}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-surface/0 group-hover:bg-surface/10 transition-colors duration-500" />
            </div>
            <h3 className="text-xl font-serif mb-2">{collection.name}</h3>
            <p className="text-muted text-sm">{collection.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
