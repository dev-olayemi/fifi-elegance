import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CloudinaryUpload from "@/components/admin/CloudinaryUpload";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Product, Category } from "@/lib/database.types";

interface ProductFormData {
  name: string;
  price: number;
  description: string;
  fabric: string;
  sizes: string[];
  images: string[];
  category_id: string;
  featured: boolean;
  in_stock: boolean;
}

const defaultFormData: ProductFormData = {
  name: "",
  price: 0,
  description: "",
  fabric: "",
  sizes: ["XS", "S", "M", "L", "XL"],
  images: [],
  category_id: "",
  featured: false,
  in_stock: true,
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(defaultFormData);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("name"),
      ]);

      if (productsRes.error) throw productsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;

      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddDialog = () => {
    setEditingProduct(null);
    setFormData(defaultFormData);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || "",
      fabric: product.fabric || "",
      sizes: product.sizes || [],
      images: product.images || [],
      category_id: product.category_id || "",
      featured: product.featured,
      in_stock: product.in_stock,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) {
      toast.error("Please fill in required fields");
      return;
    }

    setSaving(true);
    try {
      if (editingProduct) {
        const updateData = {
          name: formData.name,
          price: formData.price,
          description: formData.description,
          fabric: formData.fabric,
          sizes: formData.sizes,
          images: formData.images,
          category_id: formData.category_id || null,
          featured: formData.featured,
          in_stock: formData.in_stock,
          updated_at: new Date().toISOString(),
        };
        
        const { error } = await supabase
          .from("products")
          .update(updateData)
          .eq("id", editingProduct.id);

        if (error) throw error;
        toast.success("Product updated successfully");
      } else {
        const insertData = {
          name: formData.name,
          price: formData.price,
          description: formData.description,
          fabric: formData.fabric,
          sizes: formData.sizes,
          images: formData.images,
          category_id: formData.category_id || null,
          featured: formData.featured,
          in_stock: formData.in_stock,
        };
        
        const { error } = await supabase.from("products").insert([insertData]);

        if (error) throw error;
        toast.success("Product added successfully");
      }

      setIsDialogOpen(false);
      fetchData();
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;
      toast.success("Product deleted");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  const toggleSize = (size: string) => {
    const sizes = formData.sizes.includes(size)
      ? formData.sizes.filter((s) => s !== size)
      : [...formData.sizes, size];
    setFormData({ ...formData, sizes });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl text-foreground mb-2">Products</h1>
            <p className="text-muted-foreground">
              Manage your product catalog
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="luxury" onClick={openAddDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Product Images */}
                <div>
                  <Label className="mb-3 block">Product Images</Label>
                  <CloudinaryUpload
                    images={formData.images}
                    onImagesChange={(images) => setFormData({ ...formData, images })}
                  />
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Midnight Elegance Gown"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₦) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      placeholder="185000"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the product..."
                    rows={3}
                  />
                </div>

                {/* Fabric */}
                <div className="space-y-2">
                  <Label htmlFor="fabric">Fabric</Label>
                  <Input
                    id="fabric"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    placeholder="e.g. Premium Chiffon with Gold Thread"
                  />
                </div>

                {/* Sizes */}
                <div className="space-y-2">
                  <Label>Available Sizes</Label>
                  <div className="flex flex-wrap gap-2">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`w-12 h-10 rounded border transition-colors ${
                          formData.sizes.includes(size)
                            ? "border-gold bg-gold/10 text-foreground"
                            : "border-border hover:border-gold"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={formData.featured}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, featured: checked })
                      }
                    />
                    <Label>Featured Product</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={formData.in_stock}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, in_stock: checked })
                      }
                    />
                    <Label>In Stock</Label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="luxury"
                    className="flex-1"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Product"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg">
            <p className="text-muted-foreground">No products found</p>
            <Button variant="luxury" className="mt-4" onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-medium">Product</th>
                    <th className="text-left p-4 font-medium">Price</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Stock</th>
                    <th className="text-left p-4 font-medium hidden lg:table-cell">Featured</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                            {product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                No img
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium truncate max-w-[200px]">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.sizes?.length || 0} sizes
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium">{formatPrice(product.price)}</td>
                      <td className="p-4 hidden md:table-cell">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            product.in_stock
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.in_stock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        {product.featured && (
                          <span className="px-2 py-1 rounded-full text-xs bg-gold/20 text-gold">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(product)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
