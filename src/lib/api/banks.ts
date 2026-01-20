import { API_URL } from './config';

export interface BankFormData {
  bankName: string;
  accountName: string;
  accountNumber: string;
  isActive: boolean;
}

export const bankApi = {
  async getAll() {
    const response = await fetch(`${API_URL}/banks`);
    if (!response.ok) throw new Error('Failed to fetch banks');
    return response.json();
  },

  async getActive() {
    const response = await fetch(`${API_URL}/banks/active`);
    if (!response.ok) throw new Error('Failed to fetch active banks');
    return response.json();
  },

  async getById(id: string) {
    const response = await fetch(`${API_URL}/banks/${id}`);
    if (!response.ok) throw new Error('Failed to fetch bank');
    return response.json();
  },

  async create(data: BankFormData) {
    const response = await fetch(`${API_URL}/banks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create bank');
    return response.json();
  },

  async update(id: string, data: Partial<BankFormData>) {
    const response = await fetch(`${API_URL}/banks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update bank');
    return response.json();
  },

  async delete(id: string) {
    const response = await fetch(`${API_URL}/banks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete bank');
    return response.json();
  },
};
