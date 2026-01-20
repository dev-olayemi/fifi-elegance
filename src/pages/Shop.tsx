import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/cart/CartSidebar";
import ProductCard from "@/components/products/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, X } from "lucide-react";
import { setPageMeta, addStructuredData, createBreadcrumbs } from "@/lib/seo";

interface Product {
  id: string;
  name: string;
  price: number;
  category?: { name: string };
  images?: string[];
  description?: string;
  sizes?: string[];
  colors?: string[];
  fabric?: string;
}

const Shop = () => {
  const { products: allProducts, loading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Set SEO meta tags
  useEffect(() => {
    setPageMeta(
      "LE LUXE Collection - Fifi Fashion Wears | Premium Ready-to-Wear & Bespoke Dresses",
      "Browse Fifi Fashion Wears LE LUXE collection of premium ready-to-wear and custom bespoke dresses. Elegant, well-tailored designs with exceptional craftsmanship. Free shipping on orders over ₦50,000."
    );

    // Add breadcrumb structured data
    addStructuredData(createBreadcrumbs([
      { name: "Home", url: "/" },
      { name: "Shop", url: "/shop" }
    ]));
  }, []);

  // Extract unique categories from products
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      const uniqueCategories = Array.from(
        new Set(allProducts
          .filter((p: any) => p.category?.name)
          .map((p: any) => p.category!.name))
      ) as string[];
      setCategories(uniqueCategories);
    }
  }, [allProducts]);

  // Filter products based on search and filters
  useEffect(() => {
    let result = allProducts || [];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((product: any) => {
        const name = (product.name || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        const fabric = (product.fabric || '').toLowerCase();
        const colors = (product.colors || '').toLowerCase();
        
        return (
          name.includes(query) ||
          description.includes(query) ||
          fabric.includes(query) ||
          colors.includes(query)
        );
      });
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(
        (product: any) => product.category?.name === selectedCategory
      );
    }

    // Price filter
    if (selectedPrice) {
      const [min, max] = selectedPrice.split("-").map(Number);
      result = result.filter((product: any) => {
        const price = product.price;
        if (max === 0) return price >= min; // ₦500,000+
        return price >= min && price <= max;
      });
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, selectedPrice, allProducts]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedPrice("");
  };

  const priceRanges = [
    { label: "₦10,000 - ₦50,000", value: "10000-50000" },
    { label: "₦50,000 - ₦100,000", value: "50000-100000" },
    { label: "₦100,000 - ₦200,000", value: "100000-200000" },
    { label: "₦200,000+", value: "200000-0" },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <CartSidebar />
      <main className="pt-24 md:pt-28">
        {/* Hero Banner */}
        <section className="bg-navy text-cream py-16 md:py-24">
          <div className="luxury-container text-center">
            <p className="luxury-subheading text-gold mb-3">The Collection</p>
            <h1 className="font-serif text-4xl md:text-6xl mb-4">LE LUXE</h1>
            <p className="text-cream/80 max-w-2xl mx-auto">
              Discover our premium ready-to-wear collection. Each piece is crafted 
              with exceptional attention to detail and the finest materials.
            </p>
          </div>
        </section>

        {/* Search & Filters Section */}
        <section className="py-8 border-b border-border">
          <div className="luxury-container">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name, fabric, or style..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6 text-base"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Price Filter */}
              <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Prices</SelectItem>
                  {priceRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {(searchQuery || selectedCategory || selectedPrice) && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full sm:w-auto"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Active Filters Display */}
            {(searchQuery || selectedCategory || selectedPrice) && (
              <div className="mt-4 flex flex-wrap gap-2">
                <p className="text-sm text-muted-foreground">Active filters:</p>
                {searchQuery && (
                  <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-sm">
                    Search: {searchQuery}
                  </span>
                )}
                {selectedCategory && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {selectedCategory}
                  </span>
                )}
                {selectedPrice && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {priceRanges.find(r => r.value === selectedPrice)?.label}
                  </span>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 md:py-20">
          <div className="luxury-container">
            <div className="flex items-center justify-between mb-10">
              {loading ? (
                <Skeleton className="h-6 w-24" />
              ) : error ? (
                <p className="text-red-500">Error loading products</p>
              ) : (
                <p className="text-muted-foreground">
                  {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
                </p>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-96 w-full rounded-lg" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedCategory || selectedPrice
                    ? "No products match your filters. Try adjusting your search."
                    : "No products available"}
                </p>
                {(searchQuery || selectedCategory || selectedPrice) && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
