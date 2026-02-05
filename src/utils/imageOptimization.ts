/**
 * Image Optimization Utility for SEO
 * Handles responsive image generation, lazy loading, and WebP conversion
 */

interface ImageOptimizationProps {
  cloudinaryId: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  quality?: 'auto' | 'good' | 'best';
  loading?: 'lazy' | 'eager';
}

/**
 * Generate optimized Cloudinary image URL with auto WebP conversion
 */
export const generateOptimizedImageUrl = ({
  cloudinaryId,
  width = 800,
  height = 800,
  quality = 'auto'
}: Omit<ImageOptimizationProps, 'alt' | 'sizes' | 'loading'>) => {
  const baseUrl = 'https://res.cloudinary.com/your-cloud/image/upload';
  const transforms = [
    `w_${width}`, // Width
    `h_${height}`, // Height
    'c_fill', // Crop mode
    'g_auto', // Gravity auto
    'q_auto', // Quality auto
    'f_auto', // Format auto (WebP for modern browsers)
    'dpr_auto' // Device pixel ratio auto
  ];

  return `${baseUrl}/${transforms.join(',')}/${cloudinaryId}`;
};

/**
 * Generate responsive image URL with multiple sizes
 */
export const generateResponsiveImageUrl = (
  cloudinaryId: string,
  quality: 'auto' | 'good' | 'best' = 'auto'
) => {
  const baseUrl = 'https://res.cloudinary.com/your-cloud/image/upload';
  
  return {
    mobile: `${baseUrl}/w_400,c_scale,q_${quality},f_auto/${cloudinaryId}`,
    tablet: `${baseUrl}/w_800,c_scale,q_${quality},f_auto/${cloudinaryId}`,
    desktop: `${baseUrl}/w_1200,c_scale,q_${quality},f_auto/${cloudinaryId}`,
    hero: `${baseUrl}/w_1920,c_scale,q_${quality},f_auto/${cloudinaryId}`,
    thumbnail: `${baseUrl}/w_200,h_200,c_fill,q_auto,f_auto/${cloudinaryId}`
  };
};

/**
 * Image srcSet for responsive loading
 */
export const generateImageSrcSet = (cloudinaryId: string) => {
  const baseUrl = 'https://res.cloudinary.com/your-cloud/image/upload';
  
  return [
    `${baseUrl}/w_400,q_auto,f_auto/${cloudinaryId} 400w`,
    `${baseUrl}/w_600,q_auto,f_auto/${cloudinaryId} 600w`,
    `${baseUrl}/w_800,q_auto,f_auto/${cloudinaryId} 800w`,
    `${baseUrl}/w_1000,q_auto,f_auto/${cloudinaryId} 1000w`,
    `${baseUrl}/w_1200,q_auto,f_auto/${cloudinaryId} 1200w`
  ].join(', ');
};

/**
 * Image sizes attribute for responsive design
 */
export const generateImageSizes = () => {
  return [
    '(max-width: 640px) 100vw',
    '(max-width: 1024px) 80vw',
    '(max-width: 1280px) 70vw',
    '50vw'
  ].join(', ');
};

/**
 * SEO-optimized image component attributes
 */
export const generateImageAttrs = (props: ImageOptimizationProps) => {
  const { cloudinaryId, alt, width = 800, height = 800, loading = 'lazy', quality = 'auto' } = props;
  const url = generateOptimizedImageUrl({ cloudinaryId, width, height, quality });
  const srcSet = generateImageSrcSet(cloudinaryId);
  const sizes = generateImageSizes();

  return {
    src: url,
    alt: `${alt} | Premium Fashion by Fifi Fashion Wears`,
    srcSet,
    sizes,
    loading,
    decoding: 'async' as const,
    width,
    height,
    crossOrigin: 'anonymous' as const
  };
};

/**
 * Image filename optimizer
 * Converts image names to SEO-friendly format
 */
export const optimizeImageFilename = (
  productName: string,
  color: string,
  size?: string,
  angle?: string
): string => {
  const sanitize = (str: string) => 
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  let filename = `${sanitize(productName)}-${sanitize(color)}`;
  if (size) filename += `-${sanitize(size)}`;
  if (angle) filename += `-${sanitize(angle)}`;
  
  return `${filename}.jpg`;
};

/**
 * Alt text generator following SEO best practices
 */
export const generateAltText = (
  productName: string,
  color: string,
  style?: string,
  size?: string
): string => {
  const parts = [
    `${color}`,
    `${style || 'luxury'}`,
    `${productName}`,
    'by Fifi Fashion Wears'
  ];
  
  if (size) parts.splice(2, 0, `size ${size}`);
  
  return parts
    .filter(Boolean)
    .join(' ')
    .charAt(0)
    .toUpperCase() + 
    parts
      .filter(Boolean)
      .join(' ')
      .slice(1);
};

/**
 * Image optimization checklist
 */
export const imageSEOChecklist = {
  fileSize: 'Compress to < 100KB for web',
  format: 'Use WebP with JPG fallback',
  filename: 'Use descriptive, hyphenated names',
  altText: 'Include product + color + brand',
  dimensions: 'Match aspect ratio (1:1 for products)',
  lazyLoad: 'Enable lazy loading for below-fold images',
  responsive: 'Provide srcSet for all breakpoints',
  quality: 'Use quality:auto for dynamic optimization',
  metadata: 'Include EXIF copyright data',
  cloudinary: 'Use CDN for global distribution'
};

/**
 * Export optimized image batch for products
 */
export const batchOptimizeImages = (products: Array<{
  id: string;
  name: string;
  color: string;
  images: string[];
}>) => {
  return products.map(product => ({
    id: product.id,
    name: product.name,
    optimized: product.images.map((image, index) => ({
      original: image,
      filename: optimizeImageFilename(
        product.name,
        product.color,
        'main',
        `view-${index + 1}`
      ),
      url: generateOptimizedImageUrl({
        cloudinaryId: image,
        width: 1000,
        height: 1000,
        quality: 'auto'
      }),
      srcSet: generateImageSrcSet(image),
      alt: generateAltText(product.name, product.color, 'Premium')
    }))
  }));
};

export default {
  generateOptimizedImageUrl,
  generateResponsiveImageUrl,
  generateImageSrcSet,
  generateImageSizes,
  generateImageAttrs,
  optimizeImageFilename,
  generateAltText,
  imageSEOChecklist,
  batchOptimizeImages
};
