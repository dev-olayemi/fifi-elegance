import { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Image as ImageIcon, X, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { productApi } from '@/lib/api/products';
import { categoryApi } from '@/lib/api/categories';
import { uploadToCloudinary } from '@/lib/cloudinary';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const Products = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    categoryId: '',
    sizes: '',
    colors: '',
    fabric: '',
    care: '',
    stock: '',
    isActive: true,
    isFeatured: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productApi.getAll(),
        categoryApi.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setImageUrls([...imageUrls, imageInput.trim()]);
      setImageInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Show message to use URL input instead
    toast({
      title: 'Use URL Input Instead',
      description: 'Please upload images to Cloudinary manually and paste the URLs below. This is simpler and more reliable!',
      variant: 'default',
    });
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (imageUrls.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one product image',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
        categoryId: formData.categoryId,
        sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(Boolean) : undefined,
        fabric: formData.fabric || undefined,
        care: formData.care || undefined,
        images: imageUrls,
        stock: parseInt(formData.stock),
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
      };

      if (editingId) {
        // Update existing product
        await productApi.update(editingId, productData);
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        // Create new product
        await productApi.create(productData);
        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      }
      
      setIsAddDialogOpen(false);
      setEditingId(null);
      resetForm();
      loadData();
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create product',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productApi.delete(id);
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    
    // Parse images if JSON string
    let images = product.images;
    if (typeof images === 'string') {
      try {
        images = JSON.parse(images);
      } catch {
        images = [images];
      }
    }
    
    // Parse sizes if JSON string
    let sizes = product.sizes;
    if (typeof sizes === 'string') {
      try {
        sizes = JSON.parse(sizes);
      } catch {
        sizes = [];
      }
    }
    
    // Parse colors if JSON string
    let colors = product.colors;
    if (typeof colors === 'string') {
      try {
        colors = JSON.parse(colors);
      } catch {
        colors = [];
      }
    }
    
    setImageUrls(images || []);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      comparePrice: product.comparePrice?.toString() || '',
      categoryId: product.categoryId,
      sizes: Array.isArray(sizes) ? sizes.join(', ') : '',
      colors: Array.isArray(colors) ? colors.join(', ') : '',
      fabric: product.fabric || '',
      care: product.care || '',
      stock: product.stock.toString(),
      isActive: product.isActive ?? true,
      isFeatured: product.isFeatured ?? false,
    });
    setIsAddDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      comparePrice: '',
      categoryId: '',
      sizes: '',
      colors: '',
      fabric: '',
      care: '',
      stock: '',
      isActive: true,
      isFeatured: false,
    });
    setImageUrls([]);
    setImageInput('');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#1a1f3a]">Products</h1>
            <p className="text-gray-600 mt-1">Manage your LE LUXE collection ({products.length} products)</p>
          </div>
          
          <Dialog 
            open={isAddDialogOpen} 
            onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) {
                setEditingId(null);
                resetForm();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-[#d4af37] text-[#1a1f3a] hover:bg-[#d4af37]/90 font-semibold">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif text-[#1a1f3a]">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
                <DialogDescription>
                  {editingId ? 'Update product information' : 'Create a new product for your LE LUXE collection'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Product Images */}
                <div className="space-y-2">
                  <Label>Product Images *</Label>
                  
                  {/* URL Input - PRIMARY METHOD */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Product Image URLs (Recommended)</Label>
                    <div className="flex gap-2">
                      <Input
                        value={imageInput}
                        onChange={(e) => setImageInput(e.target.value)}
                        placeholder="Paste Cloudinary image URL here"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddImage();
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddImage} className="bg-[#d4af37] text-[#1a1f3a] hover:bg-[#d4af37]/90">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                      <p className="font-semibold text-blue-900 mb-1">📸 How to get image URLs:</p>
                      <ol className="text-blue-800 space-y-1 ml-4 list-decimal">
                        <li>Go to <a href="https://cloudinary.com/console/media_library" target="_blank" className="underline">Cloudinary Media Library</a></li>
                        <li>Upload your images</li>
                        <li>Click on image → Copy "Secure URL"</li>
                        <li>Paste URL here and click +</li>
                      </ol>
                    </div>
                  </div>

                  {/* File Upload - DISABLED (shows message) */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Files (Click for instructions)
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      File upload requires Cloudinary setup. Use URL input above instead!
                    </p>
                  </div>

                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            className="w-full h-24 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input 
                      id="name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Elegant Evening Gown" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={formData.categoryId}
                      onValueChange={(value) => setFormData({...formData, categoryId: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea 
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the product in detail..."
                    rows={4}
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₦) *</Label>
                    <Input 
                      id="price" 
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="50000" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="comparePrice">Compare Price (₦)</Label>
                    <Input 
                      id="comparePrice" 
                      type="number"
                      value={formData.comparePrice}
                      onChange={(e) => setFormData({...formData, comparePrice: e.target.value})}
                      placeholder="75000" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input 
                      id="stock" 
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      placeholder="10" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fabric">Fabric</Label>
                    <Input 
                      id="fabric"
                      value={formData.fabric}
                      onChange={(e) => setFormData({...formData, fabric: e.target.value})}
                      placeholder="Silk, Satin, Lace" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sizes">Available Sizes (comma-separated) *</Label>
                  <Input 
                    id="sizes"
                    value={formData.sizes}
                    onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                    placeholder="XS, S, M, L, XL" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colors">Available Colors (comma-separated)</Label>
                  <Input 
                    id="colors"
                    value={formData.colors}
                    onChange={(e) => setFormData({...formData, colors: e.target.value})}
                    placeholder="Black, Navy, Gold" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="care">Care Instructions</Label>
                  <Textarea 
                    id="care"
                    value={formData.care}
                    onChange={(e) => setFormData({...formData, care: e.target.value})}
                    placeholder="Dry clean only. Do not bleach..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="rounded" 
                    />
                    <span className="text-sm">Active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                      className="rounded" 
                    />
                    <span className="text-sm">Featured</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      resetForm();
                      setEditingId(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-[#d4af37] text-[#1a1f3a] hover:bg-[#d4af37]/90"
                  >
                    {editingId ? 'Update Product' : 'Create Product'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No products yet. Click "Add Product" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const images = JSON.parse(product.images || '[]');
              const firstImage = images[0] || '/placeholder.svg';
              
              return (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={firstImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-lg text-[#1a1f3a] mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-lg font-bold text-[#1a1f3a]">
                          ₦{product.price.toLocaleString()}
                        </p>
                        {product.comparePrice && (
                          <p className="text-sm text-gray-500 line-through">
                            ₦{product.comparePrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Stock: {product.stock}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Products;
