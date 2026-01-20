import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({
  adapter,
  log: ['query', 'error', 'warn'],
});

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Admin User
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@fififashionwears.com' },
    update: {},
    create: {
      email: 'admin@fififashionwears.com',
      password: 'FifiAdmin2024!', // In production, this should be hashed
      name: 'Fifi Admin',
      role: 'admin',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create Categories
  const leLuxeCategory = await prisma.category.upsert({
    where: { slug: 'le-luxe' },
    update: {},
    create: {
      name: 'LE LUXE',
      slug: 'le-luxe',
      description: 'Premium Ready-to-Wear Collection - Elegant, well-tailored outfits that highlight confidence and individuality',
      image: 'https://res.cloudinary.com/dgpu70zzs/image/upload/v1/fifi/categories/le-luxe',
      isActive: true,
    },
  });
  console.log('✅ Category created:', leLuxeCategory.name);

  // Create Site Settings
  const siteSettings = [
    { key: 'site_name', value: 'Fifi Fashion Wears', type: 'text' },
    { key: 'site_tagline', value: 'LE LUXE - Premium Ready-to-Wear Collection', type: 'text' },
    { key: 'contact_email', value: 'fififashionwears@gmail.com', type: 'text' },
    { key: 'contact_phone', value: '08122815425', type: 'text' },
    { key: 'contact_whatsapp', value: '08122815425', type: 'text' },
    { key: 'instagram_url', value: 'https://www.instagram.com/fifi_fashion_wears1', type: 'text' },
    { key: 'bank_name', value: 'Your Bank Name', type: 'text' },
    { key: 'account_number', value: '1234567890', type: 'text' },
    { key: 'account_name', value: 'Fifi Fashion Wears', type: 'text' },
    { key: 'shipping_fee', value: '2000', type: 'number' },
    { key: 'free_shipping_threshold', value: '50000', type: 'number' },
  ];

  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log('✅ Site settings created');

  // Create SEO Settings
  const seoSettings = [
    {
      key: 'seo_home_title',
      value: 'Fifi Fashion Wears - LE LUXE Premium Ready-to-Wear Collection',
      type: 'text',
    },
    {
      key: 'seo_home_description',
      value: 'Discover elegant, well-tailored outfits that highlight confidence and individuality. Premium ready-to-wear and custom bespoke fashion.',
      type: 'text',
    },
    {
      key: 'seo_home_keywords',
      value: 'fashion, luxury fashion, ready-to-wear, bespoke, custom dresses, elegant fashion, premium fashion',
      type: 'text',
    },
    {
      key: 'seo_shop_title',
      value: 'Shop LE LUXE Collection - Fifi Fashion Wears',
      type: 'text',
    },
    {
      key: 'seo_shop_description',
      value: 'Browse our premium ready-to-wear collection. Elegant dresses crafted with attention to detail and premium finishing.',
      type: 'text',
    },
    {
      key: 'seo_bespoke_title',
      value: 'Custom Bespoke Orders - Fifi Fashion Wears',
      type: 'text',
    },
    {
      key: 'seo_bespoke_description',
      value: 'Request a custom-made dress tailored to your exact measurements and preferences. Premium bespoke fashion services.',
      type: 'text',
    },
  ];

  for (const seo of seoSettings) {
    await prisma.siteSetting.upsert({
      where: { key: seo.key },
      update: { value: seo.value, type: seo.type },
      create: seo,
    });
  }
  console.log('✅ SEO settings created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
