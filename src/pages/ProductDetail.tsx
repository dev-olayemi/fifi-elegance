import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, MessageCircle, Heart, Share2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/cart/CartSidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";
import ProductCard from "@/components/products/ProductCard";
import { productApi } from "@/lib/api/products";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  sizes: string[];
  colors?: string[];
  fabric?: string;
  care?: string;
  stock: number;
  category?: { id: string; name: string };
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        if (!id) throw new Error('No product ID provided');
        const data = await productApi.getById(id);
        
        // Parse images if it's a JSON string
        if (typeof data.images === 'string') {
          data.images = JSON.parse(data.images);
        }
        
        // Parse sizes if it's a JSON string
        if (typeof data.sizes === 'string') {
          data.sizes = JSON.parse(data.sizes);
        }
        if (!Array.isArray(data.sizes)) {
          data.sizes = [];
        }
        
        // Parse colors if it's a JSON string
        if (typeof data.colors === 'string') {
          data.colors = JSON.parse(data.colors);
        }
        
        setProduct(data);
        
        // Fetch all products to find related ones
        const allProducts = await productApi.getAll();
        const related = allProducts
          .filter((p: Product) => p.id !== id && p.category?.id === data.category?.id)
          .slice(0, 4);
        setRelatedProducts(related);

        // Update page title and meta tags for SEO
        document.title = `${data.name} - Fifi Fashion Wears LE LUXE`;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute(
            'content',
            `${data.name} - ${data.description?.substring(0, 120)}... | Premium fashion by Fifi Fashion Wears`
          );
        }

        // Add structured data (JSON-LD)
        const structuredData = {
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": data.name,
          "description": data.description,
          "image": data.images?.[0] || '',
          "brand": {
            "@type": "Brand",
            "name": "Fifi Fashion Wears"
          },
          "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "NGN",
            "price": data.price,
            "availability": data.stock > 0 ? "InStock" : "OutOfStock",
            "seller": {
              "@type": "Organization",
              "name": "Fifi Fashion Wears"
            }
          }
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
        
        return () => {
          document.head.removeChild(script);
        };
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <CartSidebar />
        <main className="pt-24 md:pt-28">
          <div className="luxury-container py-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="h-96 rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error or product not found
  if (error || !product) {
    return (
      <div className="min-h-screen">
        <Header />
        <CartSidebar />
        <main className="pt-32 pb-20">
          <div className="luxury-container text-center">
            <h1 className="font-serif text-3xl mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">
              {error || "The product you're looking for doesn't exist."}
            </p>
            <Button variant="luxury" asChild>
              <Link to="/shop">Back to Shop</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const whatsappNumber = "08122815425";
  const whatsappMessage = encodeURIComponent(
    `Hello Fifi Fashion Wears,\n\nI am interested in this product:\n\nProduct Name: ${product.name}\nPrice: ${formatPrice(product.price)}\nProduct Link: ${window.location.href}\n\nPlease assist me.`
  );

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity,
      image: product.images && product.images.length > 0 ? product.images[0] : '',
    });
    toast.success("Added to cart");
  };

  return (
    <div className="min-h-screen">
      <Header />
      <CartSidebar />
      <main className="pt-24 md:pt-28">
        {/* Breadcrumb */}
        <div className="luxury-container py-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>

        {/* Product Detail */}
        <div className="luxury-container pb-20">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <p className="text-sm tracking-widest uppercase text-gold mb-2">
                {product.category?.name || 'Uncategorized'}
              </p>
              <h1 className="font-serif text-3xl md:text-4xl mb-4">
                {product.name}
              </h1>
              <p className="font-serif text-2xl text-foreground mb-6">
                {formatPrice(product.price)}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Fabric */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Fabric</h3>
                <p className="text-muted-foreground">{product.fabric}</p>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Select Size</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg border transition-all ${
                        selectedSize === size
                          ? "border-gold bg-gold/10 text-foreground"
                          : "border-border hover:border-gold"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-3">Quantity</h3>
                <div className="flex items-center border border-border rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-muted transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-muted transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  variant="luxury"
                  size="xl"
                  className="w-full"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="whatsapp"
                  size="xl"
                  className="w-full"
                  asChild
                >
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Contact Seller on WhatsApp
                  </a>
                </Button>
              </div>

              {/* Secondary Actions */}
              <div className="flex gap-4 mt-6 pt-6 border-t border-border">
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Heart className="w-4 h-4" />
                  Add to Wishlist
                </button>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-20 bg-muted">
            <div className="luxury-container">
              <h2 className="font-serif text-3xl text-center mb-12">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
