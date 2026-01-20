import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppCTA = () => {
  const whatsappNumber = "08122815425";
  const whatsappMessage = encodeURIComponent(
    "Hello Fifi Fashion Wears, I would like to make an inquiry about your products."
  );

  return (
    <section className="py-20 bg-navy text-cream">
      <div className="luxury-container text-center">
        <MessageCircle className="w-12 h-12 mx-auto mb-6 text-gold" />
        <h2 className="font-serif text-3xl md:text-4xl mb-4">
          Have Questions?
        </h2>
        <p className="text-cream/80 max-w-lg mx-auto mb-8">
          Our team is ready to assist you. Reach out via WhatsApp for quick responses 
          about products, orders, or custom requests.
        </p>
        <Button variant="whatsapp" size="xl" asChild>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="w-5 h-5" />
            Chat on WhatsApp
          </a>
        </Button>
      </div>
    </section>
  );
};

export default WhatsAppCTA;
