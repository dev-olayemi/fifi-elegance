import { API_URL } from './config';

export const customersApi = {
  async getAll() {
    const response = await fetch(`${API_URL}/customers`);
    if (!response.ok) throw new Error('Failed to fetch customers');
    return response.json();
  },

  async getById(id: string) {
    const response = await fetch(`${API_URL}/customers/${id}`);
    if (!response.ok) throw new Error('Failed to fetch customer');
    return response.json();
  },
};
