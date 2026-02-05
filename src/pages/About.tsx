import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/cart/CartSidebar";
import { Heart, Star, Award, Users } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Passion for Fashion",
      description: "Every stitch is made with love and dedication to the craft of fashion design.",
    },
    {
      icon: Star,
      title: "Premium Quality",
      description: "We use only the finest fabrics and materials for lasting elegance.",
    },
    {
      icon: Award,
      title: "Expert Craftsmanship",
      description: "Our skilled artisans bring years of experience to every piece.",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Your satisfaction and confidence in our designs is our greatest reward.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <CartSidebar />
      <main className="pt-24 md:pt-28">
        {/* Hero */}
        <section className="bg-navy text-cream py-16 md:py-24">
          <div className="luxury-container text-center">
            <p className="luxury-subheading text-gold mb-3">Our Story</p>
            <h1 className="font-serif text-4xl md:text-6xl mb-4">About Fifi Fashion Wears</h1>
            <p className="text-cream/80 max-w-2xl mx-auto">
              Dedicated to creating elegant, well-tailored outfits that highlight 
              confidence and individuality.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 md:py-20">
          <div className="luxury-container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-4xl mb-8">
                Crafting Elegance, One Stitch at a Time
              </h2>
              <div className="prose prose-lg mx-auto text-muted-foreground">
                <p className="mb-6">
                  Fifi Fashion Wears was born from a passion for creating beautiful, 
                  high-quality garments that make every woman feel confident and beautiful. 
                  We believe that fashion is more than just clothing – it's an expression 
                  of individuality and a celebration of personal style.
                </p>
                <p className="mb-6">
                  Our LE LUXE collection represents the pinnacle of Fifi Fashion Wears craftsmanship, 
                  featuring premium ready-to-wear pieces that combine timeless elegance with 
                  contemporary design. Each piece is meticulously crafted using premium 
                  materials and attention to detail that sets us apart.
                </p>
                <p>
                  For those seeking something truly unique, our bespoke service allows 
                  you to collaborate directly with our designers to create one-of-a-kind 
                  pieces tailored to your exact specifications and measurements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-20 bg-muted">
          <div className="luxury-container">
            <h2 className="font-serif text-3xl text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="font-serif text-xl mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="luxury-container text-center">
            <h2 className="font-serif text-3xl mb-4">Ready to Experience Luxury?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Explore Fifi Fashion Wears' LE LUXE collection or start your bespoke journey today.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
