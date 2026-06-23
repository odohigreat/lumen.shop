import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

export function Newsletter() {
  return (
    <section className="py-24 md:py-32 bg-secondary border-t border-border overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter">
            Join the Community
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Subscribe to receive exclusive access to early releases, editorial content, and special events.
          </p>
          
          <form className="mt-10 max-w-md mx-auto flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 h-14 bg-surface px-4 focus:outline-none focus:ring-1 focus:ring-primary transition-shadow border border-transparent focus:border-border"
              required
            />
            <Button type="submit" size="lg" className="h-14 px-8 shrink-0">
              Subscribe
            </Button>
          </form>
          <p className="text-xs text-muted mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from Lumen.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
