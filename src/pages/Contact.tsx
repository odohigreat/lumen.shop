export function Contact() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif mb-6">Contact Us</h1>
        <p className="text-muted text-lg">We'd love to hear from you. Reach out with any questions, styling advice, or feedback.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        <div>
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                <input type="text" id="firstName" className="w-full bg-secondary/50 border border-border rounded-md px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary transition-shadow" placeholder="Jane" />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                <input type="text" id="lastName" className="w-full bg-secondary/50 border border-border rounded-md px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary transition-shadow" placeholder="Doe" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <input type="email" id="email" className="w-full bg-secondary/50 border border-border rounded-md px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary transition-shadow" placeholder="jane@example.com" />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea id="message" rows={6} className="w-full bg-secondary/50 border border-border rounded-md px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary transition-shadow resize-none" placeholder="How can we help you?"></textarea>
            </div>

            <button type="button" className="bg-primary text-surface px-8 py-3 rounded-md hover:bg-primary/90 transition-colors w-full font-medium tracking-wide">
              Send Message
            </button>
          </form>
        </div>

        <div className="space-y-12 flex flex-col justify-center">
          <div>
            <h3 className="font-serif text-xl mb-4 text-primary">Client Services</h3>
            <p className="text-muted mb-2 text-sm">For general inquiries, returns, and order updates.</p>
            <a href="mailto:support@lumenstudio.com" className="text-sm font-medium hover:underline underline-offset-4 transition-all">support@lumenstudio.com</a>
          </div>
          
          <div>
            <h3 className="font-serif text-xl mb-4 text-primary">Press & Wholesale</h3>
            <p className="text-muted mb-2 text-sm">For press loans, partnerships, and wholesale inquiries.</p>
            <a href="mailto:partners@lumenstudio.com" className="text-sm font-medium hover:underline underline-offset-4 transition-all">partners@lumenstudio.com</a>
          </div>

          <div>
            <h3 className="font-serif text-xl mb-4 text-primary">Our Studio</h3>
            <p className="text-muted text-sm leading-relaxed">
              123 Minimalist Way<br />
              Suite 400<br />
              New York, NY 10001<br />
              <span className="mt-2 block italic text-xs">* Visits by appointment only.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
