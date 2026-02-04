import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/cart/CartSidebar";
import HeroSection from "@/components/home/HeroSection";
import FeaturedSection from "@/components/home/FeaturedSection";
import BespokeSection from "@/components/home/BespokeSection";
import WhatsAppCTA from "@/components/home/WhatsAppCTA";
import { setPageMeta, addStructuredData, organizationSchema } from "@/lib/seo";

const Index = () => {
  useEffect(() => {
    // Set homepage SEO meta tags
    setPageMeta(
      "Fifi Fashion Wears - Premium LE LUXE Collection & Custom Bespoke Dresses",
      "Discover Fifi Fashion Wears premium ready-to-wear LE LUXE collection and custom bespoke dresses. Elegant, well-tailored designs crafted with exceptional attention to detail. Shop luxury fashion online."
    );

    // Add organization structured data
    addStructuredData(organizationSchema);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <CartSidebar />
      <main>
        <HeroSection />
        <FeaturedSection />
        <BespokeSection />
        <WhatsAppCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
