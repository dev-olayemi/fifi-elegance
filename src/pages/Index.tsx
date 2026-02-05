import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/cart/CartSidebar";
import HeroSection from "@/components/home/HeroSection";
import FeaturedSection from "@/components/home/FeaturedSection";
import BespokeSection from "@/components/home/BespokeSection";
import GallerySection from "@/components/home/GallerySection";
import WhatsAppCTA from "@/components/home/WhatsAppCTA";
import SEOMetaTags from "@/components/SEO/SEOMetaTags";
import StructuredData from "@/components/SEO/StructuredData";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEOMetaTags
        title="Fifi Fashion Wears - Premium Fashion & Luxury Bespoke | LE LUXE"
        description="Discover Nigeria's premier fashion house. Premium ready-to-wear collection and custom bespoke designs. Elegant, well-tailored outfits with meticulous attention to detail. Free shipping. WhatsApp: 08122815425"
        keywords="luxury fashion Nigeria, bespoke tailoring, premium dresses, custom fashion design, Fifi Fashion, LE LUXE collection, elegant outfits, fashion house"
        url="https://fififashion.shop/"
        image="https://res.cloudinary.com/your-cloud/image/upload/hero-home.jpg"
        type="website"
      />
      <StructuredData type="organization" />
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
