import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products';
import categoriesRouter from './routes/categories';
import banksRouter from './routes/banks';
import settingsRouter from './routes/settings';
import ordersRouter from './routes/orders';
import bespokeRouter from './routes/bespoke';
import customersRouter from './routes/customers';
import seoRouter from './routes/seo';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/banks', banksRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/bespoke', bespokeRouter);
app.use('/api/customers', customersRouter);
app.use('/', seoRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Fifi Fashion Wears API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`📁 Database: ${process.env.DATABASE_URL || 'file:./dev.db'}`);
});
