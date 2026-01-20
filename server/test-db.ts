import dotenv from 'dotenv';
dotenv.config();

import prisma from './prisma';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Try to fetch categories
    const categories = await prisma.category.findMany();
    console.log('✅ Categories found:', categories.length);
    
    // Try to fetch products
    const products = await prisma.product.findMany();
    console.log('✅ Products found:', products.length);
    
    // Try to fetch settings
    const settings = await prisma.siteSetting.findMany();
    console.log('✅ Settings found:', settings.length);
    
    console.log('\n🎉 Database connection successful!');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
