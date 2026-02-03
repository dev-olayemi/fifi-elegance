import { Link } from "react-router-dom";
import { Product } from "@/data/products";

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

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block"
    >
      <div className="luxury-card">
        <div className="aspect-[3/4] overflow-hidden bg-muted image-hover-zoom">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-4 text-center">
          <p className="text-xs tracking-widest uppercase text-gold mb-2">
            {product.category}
          </p>
          <h3 className="font-serif text-lg mb-2 group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          <p className="font-medium text-foreground">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
