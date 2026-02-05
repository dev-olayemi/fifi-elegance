import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, MessageCircle, Heart, Share2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/cart/CartSidebar";
import { Button } from "@/components/ui/button";
import { getProductById, getFeaturedProducts } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { activityLogger } from "@/utils/activityLogger";
import ProductCard from "@/components/products/ProductCard";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <CartSidebar />
        <main className="pt-32 pb-20">
          <div className="luxury-container text-center">
            <h1 className="font-serif text-3xl mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The product you're looking for doesn't exist.
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
      image: product.images[0],
    });
    toast.success("Added to cart");
  };

  const relatedProducts = getFeaturedProducts()
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

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
        <div className="luxury-container pb-12 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Image */}
            <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden sticky top-24 md:static">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <p className="text-xs md:text-sm tracking-widest uppercase text-gold mb-2">
                {product.category}
              </p>
              <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl mb-3 md:mb-4">
                {product.name}
              </h1>
              <p className="font-serif text-xl md:text-2xl text-foreground mb-4 md:mb-6">
                {formatPrice(product.price)}
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6 md:mb-8">
                {product.description}
              </p>

              {/* Fabric */}
              <div className="mb-5 md:mb-6">
                <h3 className="text-xs md:text-sm font-medium mb-2">Fabric</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{product.fabric}</p>
              </div>

              {/* Size Selection */}
              <div className="mb-5 md:mb-6">
                <h3 className="text-xs md:text-sm font-medium mb-3">Select Size</h3>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-lg border text-sm md:text-base transition-all ${
                        selectedSize === size
                          ? "border-gold bg-gold/10 text-foreground font-medium"
                          : "border-border hover:border-gold"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-xs md:text-sm font-medium mb-3">Quantity</h3>
                <div className="flex items-center border border-border rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 md:p-3 hover:bg-muted transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 md:px-6 font-medium text-sm md:text-base">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 md:p-3 hover:bg-muted transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 md:space-y-3">
                <Button
                  variant="luxury"
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="whatsapp"
                  size="lg"
                  className="w-full"
                  asChild
                >
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Contact Seller on</span> WhatsApp
                  </a>
                </Button>
              </div>

              {/* Secondary Actions */}
              <div className="flex gap-3 md:gap-4 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border">
                <button
                  onClick={() => {
                    const inWishlist = isInWishlist(product.id);
                    if (inWishlist) {
                      removeFromWishlist(product.id);
                      activityLogger.logRemoveFromWishlist(product.id, product.name, product.price);
                      toast.success("Removed from wishlist");
                    } else {
                      addToWishlist({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.images[0],
                        category: product.category,
                      });
                      activityLogger.logAddToWishlist(product.id, product.name, product.price);
                      toast.success("Added to wishlist");
                    }
                  }}
                  className={`flex items-center gap-1 md:gap-2 text-xs md:text-sm transition-colors ${
                    isInWishlist(product.id)
                      ? "text-red-500 hover:text-red-600"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                  <span className="hidden sm:inline">
                    {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  </span>
                </button>
                <button className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
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
