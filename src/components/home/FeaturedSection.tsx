import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { productApi } from "@/lib/api/products";

const FeaturedSection = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    productApi
      .getFeatured()
      .then((rows) => {
        if (!mounted) return;
        setFeaturedProducts(rows || []);
      })
      .catch(() => setFeaturedProducts([]))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="luxury-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="luxury-subheading text-gold mb-3">The Collection</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-6">LE LUXE</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our signature ready-to-wear collection features exquisitely tailored pieces 
            designed to make you feel confident and beautiful.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {!loading && featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="luxuryOutline" size="lg" asChild>
            <Link to="/shop">
              View All Collection
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
