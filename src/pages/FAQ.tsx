import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Where do you ship to?",
      answer: "We currently ship worldwide. Shipping costs and delivery times vary by destination. Please see our Shipping & Returns page for detailed information."
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns on all unworn and unused items within 30 days of delivery. Custom or personalized items are final sale."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order has shipped, you will receive an email containing a tracking number and link to follow your package's journey."
    },
    {
      question: "Are your materials sustainably sourced?",
      answer: "Yes, sustainability is core to our philosophy. We use organic cotton, recycled polyester, and trace our leather to responsible tanneries. Read more on our Sustainability page."
    },
    {
      question: "How should I care for my Lumen products?",
      answer: "Care instructions vary by material. Generally, we recommend cold washing garments and air drying to preserve the fabric and reduce environmental impact. Specific care labels are attached to every item."
    }
  ];

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif mb-6">Frequently Asked Questions</h1>
        <p className="text-muted">Find answers to common questions about our products, shipping, and policies.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-border rounded-lg overflow-hidden transition-all duration-300">
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center bg-surface hover:bg-secondary/50 transition-colors"
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
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-40 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
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
