import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/cart/CartSidebar";
import HeroSection from "@/components/home/HeroSection";
import FeaturedSection from "@/components/home/FeaturedSection";
import BespokeSection from "@/components/home/BespokeSection";
import GallerySection from "@/components/home/GallerySection";
import WhatsAppCTA from "@/components/home/WhatsAppCTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <CartSidebar />
      <main>
        <HeroSection />
        <FeaturedSection />
        <BespokeSection />
         <GallerySection />
        <WhatsAppCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
