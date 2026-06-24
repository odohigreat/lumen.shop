export function Sustainability() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto fade-in">
      <div className="text-center mb-16">
        <span className="text-xs tracking-widest uppercase text-muted mb-4 block">Our Commitment</span>
        <h1 className="text-4xl font-serif mb-6">Sustainable by Design</h1>
        <p className="text-lg text-muted text-balance max-w-2xl mx-auto">
          We believe that beautiful design should not come at the expense of our planet. Discover how we integrate sustainable practices into every step of our process.
        </p>
      </div>

      <div className="space-y-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-square bg-secondary overflow-hidden order-2 md:order-1">
             <img 
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop" 
              alt="Sustainable Materials"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-2xl font-serif mb-4">Mindful Materials</h2>
            <p className="text-muted mb-4 leading-relaxed">
              Our journey begins with the raw materials. We prioritize certified organic fibers, recycled textiles, and sustainably harvested natural resources. By avoiding synthetic blends where possible, we ensure our garments remain breathable, durable, and ultimately biodegradable.
            </p>
            <p className="text-muted leading-relaxed">
              Over 85% of our current collection is made from materials carrying GOTS, OCS, or RCS certifications.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-serif mb-4">Ethical Production</h2>
            <p className="text-muted mb-4 leading-relaxed">
              A product is only as beautiful as the conditions in which it was made. We partner exclusively with factories that guarantee fair wages, safe working environments, and reasonable hours.
            </p>
            <p className="text-muted leading-relaxed">
              We regularly audit our supply chain and maintain close, transparent relationships with our manufacturers, celebrating the skilled artisans behind every Lumen piece.
            </p>
          </div>
          <div className="aspect-square bg-secondary overflow-hidden">
             <img 
              src="https://images.unsplash.com/photo-1449247709967-d4461a6a6103?q=80&w=1200&auto=format&fit=crop" 
              alt="Ethical Production"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
