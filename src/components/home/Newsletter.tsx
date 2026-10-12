import { useState } from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { Button } from '../ui/Button';

export function Newsletter() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="py-24 md:py-32 bg-secondary border-t border-border overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter">
            Join the Community
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Preview our newsletter signup. This demo does not register your email or send updates.
          </p>

          <form
            className="mt-10 max-w-md mx-auto flex flex-col sm:flex-row gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <input
              type="email"
              aria-label="Email address"
              autoComplete="email"
              onChange={() => setSubmitted(false)}
              placeholder="Your email address"
              className="min-w-0 flex-1 h-14 bg-surface px-4 focus:outline-none focus:ring-1 focus:ring-primary transition-shadow border border-transparent focus:border-border"
              required
            />
            <Button type="submit" size="lg" className="h-14 px-8 shrink-0">
              Preview Signup
            </Button>
          </form>
          {submitted && (
            <p role="status">Preview complete. Your email has not been registered or sent.</p>
          )}
          <p className="text-xs text-muted mt-4">
            Read our{' '}
            <Link to="/legal" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </m.div>
      </div>
    </section>
  );
}
