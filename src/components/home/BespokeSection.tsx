import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scissors, Ruler, Heart } from "lucide-react";

const BespokeSection = () => {
  const features = [
    {
      icon: Scissors,
      title: "Custom Design",
      description: "Work directly with our designers to create your vision",
    },
    {
      icon: Ruler,
      title: "Perfect Fit",
      description: "Tailored precisely to your measurements",
    },
    {
      icon: Heart,
      title: "Premium Quality",
      description: "Handcrafted with the finest materials",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-muted">
      <div className="luxury-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <p className="luxury-subheading text-gold mb-3">Made for You</p>
            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              Bespoke Tailoring
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Can't find exactly what you're looking for? Our bespoke service allows you 
              to create a one-of-a-kind piece tailored specifically to your style, measurements, 
              and vision. From concept to creation, we bring your dream outfit to life.
            </p>

            <div className="space-y-6 mb-10">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="luxury" size="xl" asChild>
              <Link to="/bespoke">Start Your Bespoke Order</Link>
            </Button>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-[4/5] bg-gradient-to-br from-navy to-navy-light rounded-lg overflow-hidden flex items-center justify-center">
              <div className="text-center text-cream p-12">
                <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
                  <Scissors className="w-12 h-12 text-gold" />
                </div>
                <h3 className="font-serif text-3xl mb-4">Your Vision, Our Craft</h3>
                <p className="text-cream/80 leading-relaxed">
                  Every bespoke piece tells a unique story. Let us help you tell yours.
                </p>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-gold/30 rounded-lg -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BespokeSection;
