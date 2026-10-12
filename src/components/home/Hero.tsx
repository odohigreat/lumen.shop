import { Link } from 'react-router-dom';
import { m, useScroll, useTransform, useReducedMotion, type Variants } from 'framer-motion';
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
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-[90vh] w-full bg-secondary overflow-hidden">
      <m.div
        style={{ y: reduceMotion ? 0 : y, opacity: reduceMotion ? 1 : opacity }}
        className="absolute inset-0 w-full h-full"
      >
        <m.img
          initial={reduceMotion ? false : { scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          src="/images/editorial/hero-1600.webp"
          srcSet="/images/editorial/hero-480.webp 480w, /images/editorial/hero-960.webp 960w, /images/editorial/hero-1600.webp 1600w"
          sizes="100vw"
          alt="Hero Collection"
          fetchPriority="high"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-primary/30" />
      </m.div>

      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            variants={containerVariants}
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
            className="max-w-xl text-surface space-y-6"
          >
            <m.div variants={itemVariants} className="overflow-hidden">
              <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter text-balance leading-[1.1]">
                The Autumn Edit
              </h1>
            </m.div>
            <m.div variants={itemVariants}>
              <p className="text-lg md:text-xl font-medium max-w-md text-surface/90">
                Discover our latest collection of meticulously crafted essentials for the shifting
                season.
              </p>
            </m.div>
            <m.div variants={itemVariants} className="pt-4">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center bg-surface text-primary hover:bg-surface/90 h-14 px-10 text-base focus-visible:outline focus-visible:outline-2"
              >
                Shop the Collection
              </Link>
            </m.div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
