import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  fabric: string;
  sizes: string[];
  images: string[];
  category: string;
  featured: boolean;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Midnight Elegance Gown",
    price: 185000,
    description: "A stunning navy blue evening gown with intricate gold embroidery. Features a deep V-neckline and flowing chiffon skirt that moves gracefully with every step. Perfect for formal occasions and special celebrations.",
    fabric: "Premium Chiffon with Gold Thread Embroidery",
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [product1],
    category: "LE LUXE",
    featured: true,
    inStock: true,
  },
  {
    id: "2",
    name: "Champagne Dreams Dress",
    price: 165000,
    description: "An ethereal champagne-colored gown with a romantic slit and delicate spaghetti straps. The flowing silhouette creates an effortlessly elegant look, perfect for weddings and gala events.",
    fabric: "Italian Satin with Silk Lining",
    sizes: ["XS", "S", "M", "L"],
    images: [product2],
    category: "LE LUXE",
    featured: true,
    inStock: true,
  },
  {
    id: "3",
    name: "Noir Sophisticate Gown",
    price: 195000,
    description: "A timeless black evening gown with a sweetheart neckline and gold waist accent. The structured bodice and full skirt create a classic silhouette that exudes sophistication and glamour.",
    fabric: "Duchess Satin with Lace Bodice",
    sizes: ["S", "M", "L", "XL"],
    images: [product3],
    category: "LE LUXE",
    featured: true,
    inStock: true,
  },
  {
    id: "4",
    name: "Rose Petal Romance Gown",
    price: 155000,
    description: "A romantic blush pink gown with delicate pleating and a beaded waist detail. The soft tulle fabric creates a dreamy, princess-like appearance perfect for special occasions.",
    fabric: "Soft Tulle with Beaded Embellishment",
    sizes: ["XS", "S", "M", "L"],
    images: [product4],
    category: "LE LUXE",
    featured: true,
    inStock: true,
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter((product) => product.featured);
};
