export function Sustainability() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto fade-in">
      <div className="text-center mb-16">
        <span className="text-xs tracking-widest uppercase text-muted mb-4 block">
          Our Commitment
        </span>
        <h1 className="text-4xl font-serif mb-6">Sustainable by Design</h1>
        <p className="text-lg text-muted text-balance max-w-2xl mx-auto">
          We believe that beautiful design should not come at the expense of our planet. Explore the
          principles behind a more considered wardrobe.
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
              Consider what a garment is made from, how it feels, and how you will care for it.
              Material composition and durability help you make informed choices beyond a seasonal
              trend.
            </p>
            <p className="text-muted leading-relaxed">
              The products shown here are demonstration content. No material certification or
              supply-chain verification is asserted for this catalog.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-serif mb-4">Ethical Production</h2>
            <p className="text-muted mb-4 leading-relaxed">
              A product is only as beautiful as the conditions in which it was made. Transparent
              production information can help shoppers understand who made a garment and under what
              conditions.
            </p>
            <p className="text-muted leading-relaxed">
              Before making a sourcing claim, a retailer should provide verifiable information about
              suppliers, working conditions, and material origin. This frontend demo does not
              represent an audited supply chain.
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
