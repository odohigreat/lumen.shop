import { motion } from 'framer-motion';

export function Craftsmanship() {
  return (
    <section className="py-24 md:py-32 bg-primary text-surface overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tighter">
              Uncompromising Quality
            </h2>
            <div className="space-y-6 text-surface/80 text-lg">
              <p>
                We believe that true luxury lies in the details. Every piece in our collection is meticulously crafted by skilled artisans who share our dedication to perfection.
              </p>
              <p>
                From responsibly sourced Italian leathers to organic cotton grown without harmful pesticides, our materials are chosen not just for their aesthetic appeal, but for their longevity and environmental footprint.
              </p>
            </div>
            <div className="pt-8 border-t border-surface/20 grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-3xl font-serif mb-2 tracking-tight">10+</h4>
                <p className="text-sm text-surface/60 font-medium">Years of Research</p>
              </div>
              <div>
                <h4 className="text-3xl font-serif mb-2 tracking-tight">100%</h4>
                <p className="text-sm text-surface/60 font-medium">Traceable Materials</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative aspect-[4/5] w-full"
          >
            <img 
              src="/images/craftsmanship.png" 
              alt="Craftsmanship" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
