// Vercel Serverless Function for API
import express from 'express';
import cors from 'cors';
import productsRouter from '../server/routes/products';
import categoriesRouter from '../server/routes/categories';
import banksRouter from '../server/routes/banks';
import settingsRouter from '../server/routes/settings';
import ordersRouter from '../server/routes/orders';
import bespokeRouter from '../server/routes/bespoke';
import customersRouter from '../server/routes/customers';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/banks', banksRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/bespoke', bespokeRouter);
app.use('/api/customers', customersRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Fifi Fashion Wears API is running on Vercel' });
});

// Export for Vercel
export default app;
