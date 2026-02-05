/*
  Upload files in public/ to Cloudinary and generate src/data/cloudinaryMap.json
  Usage:
    1. npm install cloudinary dotenv
    2. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to .env
    3. node scripts/upload_to_cloudinary.js
*/

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { v2: cloudinary } = require('cloudinary');

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Cloudinary credentials not found in .env. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const publicDir = path.join(__dirname, '..', 'public');
const outDir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const filesToUpload = [
  // images
  'fifi-gallery-1.jpg','fifi-gallery-2.jpg','fifi-gallery-3.jpg','fifi-gallery-4.jpg','fifi-gallery-5.jpg','fifi-gallery-6.jpg','fifi-gallery-7.jpg','fifi-gallery-8.jpg','fifi-gallery-9.jpg','fifi-gallery-10.jpg','fifi-gallery-11.jpg','fifi-gallery-12.jpg',
  'img1.jpg','img2.jpg','img3.jpg','img4.jpg','img5.jpg','img6.jpg',
  // videos
  'branding.mp4','vid1.mp4','fifi.mp4'
];

(async () => {
  const map = {};
  for (const file of filesToUpload) {
    const fullPath = path.join(publicDir, file);
    if (!fs.existsSync(fullPath)) {
      console.warn('Skipping missing file:', file);
      continue;
    }

    const ext = path.extname(file).toLowerCase();
    const resourceType = ext === '.mp4' || ext === '.webm' ? 'video' : 'image';
    try {
      console.log('Uploading', file, 'as', resourceType);
      const res = await cloudinary.uploader.upload(fullPath, {
        resource_type: resourceType,
        folder: 'fifi-fashion',
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        quality: 'auto',
        fetch_format: 'auto'
      });
      map[file] = res.secure_url;
      console.log('Uploaded:', file, '->', res.secure_url);
    } catch (err) {
      console.error('Upload failed for', file, err.message || err);
    }
  }

  const outPath = path.join(outDir, 'cloudinaryMap.json');
  fs.writeFileSync(outPath, JSON.stringify(map, null, 2), 'utf8');
  console.log('Wrote mapping to', outPath);
})();
