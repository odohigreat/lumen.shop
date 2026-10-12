export function Legal() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-serif mb-12">Privacy & Demo Information</h1>
      <div className="space-y-10 text-muted leading-relaxed">
        <section>
          <h2 className="text-2xl font-serif text-primary mb-4">Information in your browser</h2>
          <p>
            The cart stores product selections and quantities in local storage so they remain
            available after a reload. Checkout delivery details stay in page memory and are
            discarded when you close the preview.
          </p>
          <p className="mt-4">
            Contact and newsletter entries are not sent to a server or saved by this demonstration.
            No payment information is requested.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-serif text-primary mb-4">External imagery</h2>
          <p>
            Selected editorial images load from Unsplash. Your browser makes requests to that
            service to display them. Product images, the homepage hero, and the font are served with
            this application.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-serif text-primary mb-4">Managing your cart</h2>
          <p>
            Remove items using the cart controls, or clear this site's storage in your browser
            settings to delete saved selections. Cart data is specific to the browser and is not
            linked to an account.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-serif text-primary mb-4">Demonstration scope</h2>
          <p>
            LUMEN is a frontend storefront demonstration. Products and delivery policies are
            illustrative. Checkout does not create an order, arrange a delivery, or process a
            payment.
          </p>
        </section>
      </div>
    </div>
  );
}
