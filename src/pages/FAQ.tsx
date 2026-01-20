import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Browse our collection, select your preferred items, add them to your cart, and proceed to checkout. After submitting your order, you'll receive our bank account details for payment. Once payment is confirmed, we'll process your order.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We currently accept bank transfers only. After placing your order, you'll receive our bank account details and a unique reference number. Please include this reference when making your payment for easy identification.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Delivery within Lagos takes 2-3 business days. Delivery to other states in Nigeria takes 4-7 business days. International shipping is available upon request - please contact us via WhatsApp for quotes.",
    },
    {
      question: "Can I get a custom/bespoke dress made?",
      answer:
        "Absolutely! We specialize in bespoke orders. Visit our Bespoke page, fill out the request form with your measurements, design preferences, and reference images. Our team will contact you to discuss the details and pricing.",
    },
    {
      question: "What are your bespoke turnaround times?",
      answer:
        "Bespoke orders typically take 2-4 weeks depending on the complexity of the design. Rush orders may be accommodated for an additional fee - please discuss this when placing your order.",
    },
    {
      question: "How do I know my size?",
      answer:
        "Please refer to our Size Guide page for detailed measurement instructions. If you're unsure, we recommend getting professionally measured or contacting us via WhatsApp for assistance.",
    },
    {
      question: "What is your return policy?",
      answer:
        "Ready-to-wear items can be returned within 7 days of delivery if unworn and in original condition with tags attached. Bespoke/custom orders are non-refundable due to their personalized nature. Please see our Returns page for full details.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your payment is confirmed, you'll receive order status updates via WhatsApp and email. You can also visit our Order Tracking page and enter your order reference number to check your order status.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship worldwide! International shipping costs and delivery times vary by location. Please contact us via WhatsApp for international shipping quotes.",
    },
    {
      question: "How do I care for my Fifi Fashion Wears garments?",
      answer:
        "Each garment comes with specific care instructions. Generally, we recommend dry cleaning for delicate fabrics, hand washing in cold water for others, and storing in garment bags to maintain quality.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="luxury-container">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about ordering, shipping, bespoke services, and more.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left font-serif text-lg hover:text-gold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center bg-secondary/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl font-semibold text-primary mb-3">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-6">
              We're here to help! Reach out to us directly.
            </p>
            <a
              href="https://wa.me/08122815425?text=Hello%20Fifi%20Fashion%20Wears,%20I%20have%20a%20question."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
