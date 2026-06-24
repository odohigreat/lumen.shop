export function About() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif mb-6">Our Story</h1>
        <p className="text-lg text-muted text-balance">
          Lumen was born from a desire to strip away the unnecessary and focus on what truly matters: quality, intention, and timeless design.
        </p>
      </div>

      <div className="mb-16 aspect-video overflow-hidden bg-secondary">
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop" 
          alt="Lumen Studio"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-12 text-muted leading-relaxed">
        <div>
          <h2 className="text-2xl font-serif text-primary mb-4">Philosophy</h2>
          <p className="mb-4">
            We believe that less, but better, is the key to a harmonious life. Our collections are designed not to chase trends, but to provide a foundation of enduring pieces that evolve with you.
          </p>
          <p>
            Every silhouette, material, and detail is meticulously considered to ensure an outcome that feels effortless yet profoundly intentional.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-serif text-primary mb-4">Craftsmanship</h2>
          <p className="mb-4">
            We partner with independent artisans and heritage mills across Europe and Asia, selecting only those who share our uncompromising commitment to ethical production and peerless quality.
          </p>
          <p>
            By producing in limited, mindful batches, we eliminate waste and ensure that every piece that leaves our studio meets our exacting standards.
          </p>
        </div>
      </div>
    </div>
  );
}
