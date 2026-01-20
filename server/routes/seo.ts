import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// Generate XML Sitemap
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://fififashionwears.com';
    
    // Get all products
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    });

    // Build sitemap
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Static pages
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: 'shop', priority: '0.9', changefreq: 'daily' },
      { url: 'bespoke', priority: '0.8', changefreq: 'weekly' },
      { url: 'about', priority: '0.7', changefreq: 'monthly' },
      { url: 'contact', priority: '0.7', changefreq: 'monthly' },
      { url: 'faq', priority: '0.6', changefreq: 'monthly' },
      { url: 'size-guide', priority: '0.6', changefreq: 'monthly' },
      { url: 'shipping', priority: '0.6', changefreq: 'monthly' },
      { url: 'returns', priority: '0.6', changefreq: 'monthly' },
      { url: 'privacy', priority: '0.5', changefreq: 'yearly' },
      { url: 'terms', priority: '0.5', changefreq: 'yearly' },
    ];

    staticPages.forEach((page) => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/${page.url}</loc>\n`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;
      sitemap += '  </url>\n';
    });

    // Product pages
    products.forEach((product) => {
      const lastmod = product.updatedAt.toISOString().split('T')[0];
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/product/${product.id}</loc>\n`;
      sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
      sitemap += '    <changefreq>weekly</changefreq>\n';
      sitemap += '    <priority>0.8</priority>\n';
      sitemap += '  </url>\n';
    });

    sitemap += '</urlset>';

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
});

export default router;
