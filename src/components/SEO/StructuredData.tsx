/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';

/**
 * SEO Component: Injects JSON-LD Structured Data
 * Helps Google understand your website structure, products, and organization
 * Used for Rich Snippets and Enhanced Search Results
 */

interface StructuredDataProps {
  type?: 'organization' | 'product' | 'product-collection' | 'breadcrumb' | 'faq' | 'review';
  data?: Record<string, any>;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type = 'organization', data = {} }) => {
  useEffect(() => {
    // Organization Schema
    if (type === 'organization') {
      const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Fifi Fashion Wears',
        alternateName: 'Fifi Fashion - LE LUXE',
        url: 'https://fififashion.shop',
        logo: 'https://fififashion.shop/src/assets/logo.png',
        description: 'Premium fashion house specializing in luxury ready-to-wear and custom bespoke designs',
        contact: [
          {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            telephone: '+2348122815425',
            contactOption: 'TollFree',
            areaServed: 'NG'
          },
          {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            email: 'fififashionwears@gmail.com',
            areaServed: 'NG'
          }
        ],
        sameAs: [
          'https://www.instagram.com/fifi_fashion_wears1',
          'https://www.facebook.com/fififashionwears',
          'https://www.tiktok.com/@fififashionwears'
        ],
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'NG',
          addressLocality: 'Lagos',
          postalCode: 'Lagos, Nigeria'
        },
        foundingDate: '2020',
        foundingLocation: 'Lagos, Nigeria',
        areaServed: ['NG', 'GB', 'US', 'CA'],
        potentialAction: {
          '@type': 'ReserveAction',
          target: 'https://fififashion.shop/bespoke',
          name: 'Book Custom Bespoke Design'
        }
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(organizationSchema);
      document.head.appendChild(script);
    }

    // Product Schema
    if (type === 'product' && data) {
      const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: data.name || 'Fifi Fashion Product',
        image: data.image || 'https://fififashion.shop/src/assets/logo.png',
        description: data.description || 'Premium fashion from Fifi Fashion Wears',
        brand: {
          '@type': 'Brand',
          name: 'Fifi Fashion Wears'
        },
        offers: {
          '@type': 'Offer',
          url: data.url || 'https://fififashion.shop/product',
          priceCurrency: data.currency || 'NGN',
          price: data.price || '0',
          availability: data.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: 'Fifi Fashion Wears'
          }
        },
        sku: data.sku,
        aggregateRating: data.rating && typeof data.rating === 'object' ? {
          '@type': 'AggregateRating',
          ratingValue: (data.rating as any).value,
          reviewCount: (data.rating as any).count
        } : undefined
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(productSchema);
      document.head.appendChild(script);
    }

    // Product Collection Schema (for Shop page)
    if (type === 'product-collection') {
      const collectionSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Fifi Fashion Shop',
        description: 'Browse our complete collection of luxury ready-to-wear and bespoke fashion',
        url: 'https://fififashion.shop/shop',
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: data.products?.map((product: Record<string, unknown>, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `https://fififashion.shop/product/${product.id}`,
            name: product.name,
            image: product.image,
            description: product.description
          }))
        }
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(collectionSchema);
      document.head.appendChild(script);
    }

    // Breadcrumb Schema
    if (type === 'breadcrumb' && data.items) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.items.map((item: Record<string, unknown>, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        }))
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(breadcrumbSchema);
      document.head.appendChild(script);
    }

    // FAQ Schema
    if (type === 'faq' && data.faqs) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.faqs.map((faq: Record<string, unknown>) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(faqSchema);
      document.head.appendChild(script);
    }

    // Review/Rating Schema
    if (type === 'review' && data) {
      const reviewSchema = {
        '@context': 'https://schema.org',
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: data.rating,
          bestRating: '5',
          worstRating: '1'
        },
        reviewBody: data.body,
        author: {
          '@type': 'Person',
          name: data.author
        },
        itemReviewed: {
          '@type': 'Product',
          name: data.productName,
          image: data.productImage
        }
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(reviewSchema);
      document.head.appendChild(script);
    }
  }, [type, data]);

  return null; // This component only injects scripts, doesn't render anything
};

export default StructuredData;
