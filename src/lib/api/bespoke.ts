import { API_URL } from './config';

export interface BespokeFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerWhatsapp: string;
  description: string;
  measurements: any;
  budgetRange: string;
  deadline?: string;
  referenceImages?: string[];
}

export const bespokeApi = {
  async getAll() {
    const response = await fetch(`${API_URL}/bespoke`);
    if (!response.ok) throw new Error('Failed to fetch bespoke requests');
    return response.json();
  },

  async getById(id: string) {
    const response = await fetch(`${API_URL}/bespoke/${id}`);
    if (!response.ok) throw new Error('Failed to fetch bespoke request');
    return response.json();
  },

  async create(data: BespokeFormData) {
    const response = await fetch(`${API_URL}/bespoke`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create bespoke request');
    return response.json();
  },

  async update(id: string, data: any) {
    const response = await fetch(`${API_URL}/bespoke/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update bespoke request');
    return response.json();
  },

  async delete(id: string) {
    const response = await fetch(`${API_URL}/bespoke/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete bespoke request');
    return response.json();
  },
};
