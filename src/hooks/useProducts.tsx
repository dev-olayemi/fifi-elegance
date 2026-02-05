import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product, Category } from "@/lib/database.types";
import { products as staticProducts } from "@/data/products";

export interface ProductWithCategory extends Omit<Product, 'category_id'> {
  category: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            name
          )
        `)
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;

      if (productsData && productsData.length > 0) {
        const formattedProducts: ProductWithCategory[] = productsData.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          description: p.description,
          fabric: p.fabric,
          sizes: p.sizes || [],
          images: p.images || [],
          category: p.categories?.name || "LE LUXE",
          featured: p.featured,
          in_stock: p.in_stock,
          created_at: p.created_at,
          updated_at: p.updated_at,
        }));
        setProducts(formattedProducts);
      } else {
        // Fallback to static products
        const fallbackProducts: ProductWithCategory[] = staticProducts.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          description: p.description,
          fabric: p.fabric,
          sizes: p.sizes,
          images: p.images,
          category: p.category,
          featured: p.featured,
          in_stock: p.inStock,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));
        setProducts(fallbackProducts);
      }
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message);
      // Fallback to static products
      const fallbackProducts: ProductWithCategory[] = staticProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description,
        fabric: p.fabric,
        sizes: p.sizes,
        images: p.images,
        category: p.category,
        featured: p.featured,
        in_stock: p.inStock,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
      setProducts(fallbackProducts);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (err: any) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const getProductById = (id: string): ProductWithCategory | undefined => {
    return products.find((product) => product.id === id);
  };

  const getFeaturedProducts = (): ProductWithCategory[] => {
    return products.filter((product) => product.featured);
  };

  const refetch = async () => {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchCategories()]);
    setLoading(false);
  };

  return {
    products,
    categories,
    loading,
    error,
    getProductById,
    getFeaturedProducts,
    refetch,
  };
};
