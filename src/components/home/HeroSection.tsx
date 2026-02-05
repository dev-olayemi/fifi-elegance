import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-model.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Fifi Fashion Wears - LE LUXE Collection"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 luxury-container py-32">
        <div className="max-w-xl">
          <p className="luxury-subheading text-gold mb-4 animate-fade-up">
            Fifi Fashion Wears
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-cream font-medium mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            LE LUXE
          </h1>
          <p className="text-sm md:text-base text-gold mb-4 animate-fade-up tracking-widest uppercase" style={{ animationDelay: "0.15s" }}>
            Ready-to-Wear Collection
          </p>
          <p className="text-lg md:text-xl text-cream/90 mb-8 leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Discover our premium ready-to-wear collection. Elegant designs crafted with precision, 
            celebrating confidence and individuality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button variant="gold" size="xl" asChild>
              <Link to="/shop">
                Shop Ready-to-Wear
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="luxuryOutline" size="xl" className="border-cream text-cream hover:bg-cream hover:text-navy" asChild>
              <Link to="/bespoke">
                Request Bespoke
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/60">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-cream/60 to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
