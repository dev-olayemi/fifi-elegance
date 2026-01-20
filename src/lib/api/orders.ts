import { API_URL } from './config';

export const ordersApi = {
  async getAll() {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  async getById(id: string) {
    const response = await fetch(`${API_URL}/orders/${id}`);
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  },

  async updateStatus(id: string, status: string, paymentStatus?: string) {
    const response = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, paymentStatus }),
    });
    if (!response.ok) throw new Error('Failed to update order status');
    return response.json();
  },

  async confirmPayment(id: string) {
    const response = await fetch(`${API_URL}/orders/${id}/confirm-payment`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to confirm payment');
    return response.json();
  },
};
