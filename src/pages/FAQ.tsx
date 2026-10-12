import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Where do you ship to?',
      answer:
        'This storefront is a demonstration and does not ship products. The Shipping & Returns page shows illustrative delivery options used by the checkout preview.',
    },
    {
      question: 'What is your return policy?',
      answer:
        'The demonstration policy illustrates a 30-day return window. No purchases or returns are processed through this site.',
    },
    {
      question: 'Does checkout place an order?',
      answer:
        'Checkout lets you enter delivery details and review an estimate. Completing the preview places no order, sends no email, and keeps your cart intact.',
    },
    {
      question: 'Are your materials sustainably sourced?',
      answer:
        'The catalog is demonstration content and makes no verified material-certification claims. Our Sustainability page explains principles for a considered wardrobe.',
    },
    {
      question: 'How should I care for my Lumen products?',
      answer:
        'For a real garment, follow its care label and instructions from its manufacturer. Product-specific care labels are not supplied by this demonstration.',
    },
  ];

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif mb-6">Frequently Asked Questions</h1>
        <p className="text-muted">
          Find answers to common questions about our products, shipping, and policies.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-border rounded-lg overflow-hidden transition-all duration-300"
          >
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center bg-surface hover:bg-secondary/50 transition-colors"
              aria-expanded={openIndex === index}
              aria-controls={`faq-${index}`}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-medium">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="h-5 w-5 text-muted" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted" />
              )}
            </button>

            <div
              id={`faq-${index}`}
              hidden={openIndex !== index}
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
              }`}
            >
              <p className="text-muted text-sm leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
