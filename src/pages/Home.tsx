import { Hero } from '../components/home/Hero';
import { FeaturedCategories } from '../components/home/FeaturedCategories';
import { Craftsmanship } from '../components/home/Craftsmanship';
import { Newsletter } from '../components/home/Newsletter';
import { ProductCard } from '../components/ui/ProductCard';
import { MOCK_PRODUCTS } from '../data/mockData';
import { motion } from 'framer-motion';

export function Home() {
  const newArrivals = MOCK_PRODUCTS.slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      <Hero />
      
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex justify-between items-end">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-serif font-bold tracking-tight"
            >
              New Arrivals
            </motion.h2>
            <motion.a 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              href="/shop" 
              className="text-sm font-medium hover:text-muted transition-colors underline underline-offset-4"
            >
              Shop All
            </motion.a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        </div>
      </section>

      <Craftsmanship />
      <FeaturedCategories />
      <Newsletter />
    </div>
  );
}
