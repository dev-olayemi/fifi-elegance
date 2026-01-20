import { Link } from "react-router-dom";
import { Product } from "@/hooks/useProducts";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Parse images JSON string if needed
  let images: string[] = [];
  try {
    if (typeof product.images === 'string') {
      images = JSON.parse(product.images);
    } else {
      images = product.images as any;
    }
  } catch {
    images = [product.images as any];
  }

  const firstImage = images[0] || '';

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block"
    >
      <div className="luxury-card">
        <div className="aspect-[3/4] overflow-hidden bg-muted image-hover-zoom">
          {firstImage ? (
            <img
              src={firstImage}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p className="text-gray-400">No image</p>
            </div>
          )}
        </div>
        <div className="p-4 text-center">
          <p className="text-xs tracking-widest uppercase text-gold mb-2">
            {product.category?.name || "LE LUXE"}
          </p>
          <h3 className="font-serif text-lg mb-2 group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          <p className="font-medium text-foreground">
            {formatPrice(product.price)}
          </p>
          {product.stock === 0 && (
            <p className="text-xs text-red-500 mt-2">Out of Stock</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
