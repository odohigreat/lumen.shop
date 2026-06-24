export function ShippingReturns() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto fade-in">
      <h1 className="text-4xl font-serif mb-12 text-center">Shipping & Returns</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        <section>
          <h2 className="text-2xl font-serif mb-6 pb-2 border-b border-border">Shipping Options</h2>
          <div className="space-y-6 text-muted text-sm leading-relaxed">
            <div>
              <h3 className="text-primary font-medium text-base mb-2">Standard Domestic</h3>
              <p>Delivery in 3-5 business days.</p>
              <p className="mt-1">Free on orders over $150. Otherwise, flat rate of $8.</p>
            </div>
            
            <div>
              <h3 className="text-primary font-medium text-base mb-2">Express Domestic</h3>
              <p>Delivery in 1-2 business days.</p>
              <p className="mt-1">Flat rate of $25.</p>
            </div>

            <div>
              <h3 className="text-primary font-medium text-base mb-2">International Shipping</h3>
              <p>Delivery in 7-14 business days depending on location.</p>
              <p className="mt-1">Rates calculated at checkout. Customers are responsible for all customs and import duties.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-serif mb-6 pb-2 border-b border-border">Returns Policy</h2>
          <div className="space-y-6 text-muted text-sm leading-relaxed">
            <p>
              We want you to be completely satisfied with your Lumen purchase. If you are not entirely happy, we offer a 30-day return window for all unwashed, unworn, and undamaged items with original tags attached.
            </p>
            
            <div>
              <h3 className="text-primary font-medium text-base mb-2">How to Return</h3>
              <ol className="list-decimal list-inside space-y-2 mt-2">
                <li>Log into your account and navigate to order history.</li>
                <li>Select the item(s) you wish to return and submit the request.</li>
                <li>Print the provided prepaid return label.</li>
                <li>Drop off the package at any authorized shipping location.</li>
              </ol>
            </div>

            <p className="italic text-xs">
              * A $5 restocking fee will be deducted from your refund. Exchanges are always free. Final sale items cannot be returned.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
