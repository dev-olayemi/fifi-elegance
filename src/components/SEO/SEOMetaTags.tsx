import React, { useEffect } from 'react';

/**
 * SEO Component: Dynamic Meta Tags Manager
 * Updates meta tags for each page for better SEO
 */

interface SEOMetaTagsProps {
  title: string;
  description: string;
  keywords?: string;
  url?: string;
  image?: string;
  author?: string;
  type?: 'website' | 'article' | 'product';
  twitterHandle?: string;
}

const SEOMetaTags: React.FC<SEOMetaTagsProps> = ({
  title,
  description,
  keywords = '',
  url = 'https://fififashion.shop',
  image = 'https://fififashion.shop/src/assets/logo.png',
  author = 'Fifi Fashion Wears',
  type = 'website',
  twitterHandle = '@FifiFashionWears'
}) => {
  useEffect(() => {
    // Update Page Title
    document.title = title;

    // Update Meta Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Update Keywords
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      }
    }

    // Update Canonical URL
    let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (link) {
      link.href = url;
    } else {
      link = document.createElement('link');
      link.rel = 'canonical';
      link.href = url;
      document.head.appendChild(link);
    }

    // Update Open Graph Tags
    updateMetaProperty('og:title', title);
    updateMetaProperty('og:description', description);
    updateMetaProperty('og:image', image);
    updateMetaProperty('og:url', url);
    updateMetaProperty('og:type', type);

    // Update Twitter Card Tags
    updateMetaName('twitter:title', title);
    updateMetaName('twitter:description', description);
    updateMetaName('twitter:image', image);
    updateMetaName('twitter:creator', twitterHandle);

    // Function to update or create meta property
    function updateMetaProperty(property: string, content: string) {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (meta) {
        meta.content = content;
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.content = content;
        document.head.appendChild(meta);
      }
    }

    // Function to update or create meta name
    function updateMetaName(name: string, content: string) {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (meta) {
        meta.content = content;
      } else {
        meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    }
  }, [title, description, keywords, url, image, author, type, twitterHandle]);

  return null;
};

export default SEOMetaTags;
