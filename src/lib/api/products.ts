import { API_URL } from './config';

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  categoryId: string;
  sizes: string[];
  colors?: string[];
  fabric?: string;
  care?: string;
  images: string[];
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
}

export const productApi = {
  async getAll() {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async getById(id: string) {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  async create(data: ProductFormData) {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  async update(id: string, data: Partial<ProductFormData>) {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  async delete(id: string) {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
  },
};
