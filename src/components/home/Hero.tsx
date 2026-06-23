import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { Button } from '../ui/Button';
import { useRef } from 'react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-[90vh] w-full bg-secondary overflow-hidden">
      <motion.div style={{ y, opacity }} className="absolute inset-0 w-full h-full">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop" 
          alt="Hero Collection" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-primary/30" />
      </motion.div>
      
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl text-surface space-y-6"
          >
            <motion.div variants={itemVariants} className="overflow-hidden">
              <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter text-balance leading-[1.1]">
                The Autumn Edit
              </h1>
            </motion.div>
            <motion.div variants={itemVariants}>
              <p className="text-lg md:text-xl font-medium max-w-md text-surface/90">
                Discover our latest collection of meticulously crafted essentials for the shifting season.
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="pt-4">
              <Link to="/shop" className="inline-block group">
                <Button size="lg" className="bg-surface text-primary hover:bg-surface/90 h-14 px-10 text-base transition-transform duration-300 group-hover:scale-105">
                  Shop the Collection
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
