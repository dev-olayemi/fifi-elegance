import { API_URL } from './config';

export const settingsApi = {
  async getAll() {
    const response = await fetch(`${API_URL}/settings`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
  },

  async getByKey(key: string) {
    const response = await fetch(`${API_URL}/settings/${key}`);
    if (!response.ok) throw new Error('Failed to fetch setting');
    return response.json();
  },

  async upsert(key: string, value: string, type: string = 'text') {
    const response = await fetch(`${API_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value, type }),
    });
    if (!response.ok) throw new Error('Failed to save setting');
    return response.json();
  },

  async delete(key: string) {
    const response = await fetch(`${API_URL}/settings/${key}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete setting');
    return response.json();
  },
};
