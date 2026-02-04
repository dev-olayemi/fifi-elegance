import { supabase } from "../supabase";

type DbProduct = Record<string, any>;

function normalize(row: DbProduct) {
  if (!row) return row;
  const images = typeof row.images === "string" ? JSON.parse(row.images) : row.images || [];
  const sizes = typeof row.sizes === "string" ? JSON.parse(row.sizes) : row.sizes || [];
  const colors = typeof row.colors === "string" ? JSON.parse(row.colors) : row.colors || [];
  const category = row.category_name
    ? { id: row.category_id || null, name: row.category_name }
    : row.category || null;

  return {
    ...row,
    images,
    sizes,
    colors,
    category,
  };
}

export const productApi = {
  async getAll() {
    const { data, error } = await supabase.from("products").select("*");
    if (error) throw error;
    return (data || []).map(normalize);
  },

  async getById(id: string) {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return normalize(data as DbProduct);
  },

  async getFeatured() {
    const { data, error } = await supabase.from("products").select("*").eq("featured", true);
    if (error) throw error;
    return (data || []).map(normalize);
  },
};

export default productApi;
