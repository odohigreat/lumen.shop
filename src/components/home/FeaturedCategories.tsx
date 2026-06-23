import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MOCK_COLLECTIONS } from '../../data/mockData';

export function FeaturedCategories() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex justify-between items-end">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-serif font-bold tracking-tight"
          >
            Curated Collections
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/shop" className="text-sm font-medium hover:text-muted transition-colors underline underline-offset-4">
              View All
            </Link>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MOCK_COLLECTIONS.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
            >
              <Link 
                to={`/collection/${collection.id}`}
                className="group relative flex h-[60vh] overflow-hidden bg-secondary w-full"
              >
                <img 
                  src={collection.image} 
                  alt={collection.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/20 transition-opacity duration-500 group-hover:bg-primary/30" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-3xl font-serif font-bold text-surface mb-2 tracking-tight">
                    {collection.title}
                  </h3>
                  <p className="text-surface/90 max-w-sm text-balance">
                    {collection.description}
                  </p>
                  <div className="mt-6 flex items-center text-surface font-medium opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                    <span className="underline underline-offset-4">Explore</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
