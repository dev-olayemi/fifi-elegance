import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/cart/CartSidebar";
import ProductCard from "@/components/products/ProductCard";
import { products } from "@/data/products";
import SEOMetaTags from "@/components/SEO/SEOMetaTags";
import StructuredData from "@/components/SEO/StructuredData";

const Shop = () => {
  return (
    <div className="min-h-screen">
      <SEOMetaTags
        title="Shop Premium Fashion | Fifi Fashion Wears - LE LUXE Collection"
        description="Browse our complete collection of premium ready-to-wear fashion. Luxury designs and elegant outfits handcrafted with attention to detail. Free shipping on orders. WhatsApp: 08122815425"
        keywords="luxury fashion shop, designer dresses Nigeria, bespoke fashion, premium ready-to-wear, Fifi Fashion shop, LE LUXE collection"
        url="https://fififashion.shop/shop"
        image="https://res.cloudinary.com/your-cloud/image/upload/shop-hero.jpg"
      />
      <StructuredData
        type="product-collection"
        data={{ products: products }}
      />
      <Header />
      <CartSidebar />
      <main className="pt-24 md:pt-28">
        {/* Hero Banner */}
        <section className="bg-navy text-cream py-16 md:py-24">
          <div className="luxury-container text-center">
            <p className="luxury-subheading text-gold mb-3">Fifi Fashion Wears</p>
            <h1 className="font-serif text-4xl md:text-6xl mb-4">LE LUXE Collection</h1>
            <p className="text-cream/80 max-w-2xl mx-auto">
              Discover our LE LUXE premium ready-to-wear collection. Each piece is crafted 
              with exceptional attention to detail and the finest materials.
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 md:py-20">
          <div className="luxury-container">
            <div className="flex items-center justify-between mb-10">
              <p className="text-muted-foreground">
                {products.length} {products.length === 1 ? "product" : "products"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
