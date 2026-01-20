// API Configuration
// In production (Vercel), use relative path
// In development, use localhost
export const API_URL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:3001/api';
