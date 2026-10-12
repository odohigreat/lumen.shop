import { useState } from 'react';
export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif mb-6">Contact Us</h1>
        <p className="text-muted text-lg">
          We'd love to hear from you. Reach out with any questions, styling advice, or feedback.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        <div>
          <form
            className="space-y-6"
            onChange={() => setSubmitted(false)}
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <p className="text-sm text-muted">Demo contact form. Messages are not delivered.</p>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  autoComplete="given-name"
                  required
                  className="w-full bg-secondary/50 border border-border rounded-md px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                  placeholder="Jane"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  autoComplete="family-name"
                  required
                  className="w-full bg-secondary/50 border border-border rounded-md px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                autoComplete="email"
                required
                className="w-full bg-secondary/50 border border-border rounded-md px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                placeholder="jane@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                required
                minLength={10}
                rows={6}
                className="w-full bg-secondary/50 border border-border rounded-md px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary transition-shadow resize-none"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-primary text-surface px-8 py-3 rounded-md hover:bg-primary/90 transition-colors w-full font-medium tracking-wide"
            >
              Preview Message
            </button>
            {submitted && <p role="status">Your message preview is complete. Nothing was sent.</p>}
          </form>
        </div>

        <aside className="space-y-8 flex flex-col justify-center">
          <div>
            <h2 className="font-serif text-2xl mb-4">A considered conversation</h2>
            <p className="text-muted leading-relaxed">
              Use the form to preview an inquiry about a piece, its fit, or the shopping experience.
            </p>
          </div>
          <div className="border-t border-border pt-6">
            <h3 className="font-medium mb-3">About this demonstration</h3>
            <p className="text-muted text-sm leading-relaxed">
              Messages remain in your browser while this page is open. No inquiry is delivered or
              saved, and no customer service email or physical studio address is represented here.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
