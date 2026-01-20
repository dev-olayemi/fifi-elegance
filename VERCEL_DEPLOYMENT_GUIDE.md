# 🚀 Vercel Deployment Guide - Fifi Fashion Wears

## ⚠️ Important: Database Setup Required

Vercel serverless functions don't support SQLite file databases. You need to use **Turso** (LibSQL cloud database) for production.

## Step 1: Set Up Turso Database (FREE)

### 1.1 Install Turso CLI
```bash
# Windows (PowerShell)
irm get.tur.so/install.ps1 | iex

# Or download from: https://docs.turso.tech/cli/installation
```

### 1.2 Create Turso Account & Database
```bash
# Sign up (opens browser)
turso auth signup

# Create database
turso db create fifi-fashion-db

# Get database URL
turso db show fifi-fashion-db --url

# Create auth token
turso db tokens create fifi-fashion-db
```

### 1.3 Save These Values
You'll get:
- **Database URL**: `libsql://fifi-fashion-db-[your-username].turso.io`
- **Auth Token**: `eyJhbGc...` (long token string)

## Step 2: Update Prisma for Turso

Your `prisma/schema.prisma` already supports LibSQL! Just verify it has:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

## Step 3: Set Up Vercel Environment Variables

### 3.1 Go to Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project: `fifi-fashion`
3. Go to **Settings** → **Environment Variables**

### 3.2 Add These Variables

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `DATABASE_URL` | `libsql://fifi-fashion-db-[your-username].turso.io` | From Turso |
| `TURSO_AUTH_TOKEN` | `eyJhbGc...` | From Turso |
| `CLOUDINARY_CLOUD_NAME` | `dgpu70zzs` | Your Cloudinary |
| `CLOUDINARY_API_KEY` | `176115457645381` | Your Cloudinary |
| `CLOUDINARY_API_SECRET` | `o1dPCtQemyRQwY6VXHiRPXIMffY` | Your Cloudinary |

**Important:** Make sure to add these to **Production**, **Preview**, and **Development** environments!

## Step 4: Update Database Connection for Production

Update `server/prisma.ts` to use Turso auth token:

```typescript
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const libsql = createClient({
  url: process.env.DATABASE_URL || 'file:./dev.db',
  authToken: process.env.TURSO_AUTH_TOKEN, // Add this line
});

const adapter = new PrismaLibSql(libsql);
const prisma = new PrismaClient({ adapter });

export default prisma;
```

## Step 5: Seed Your Production Database

### 5.1 Update .env for Turso
```bash
# .env.production (create this file)
DATABASE_URL="libsql://fifi-fashion-db-[your-username].turso.io"
TURSO_AUTH_TOKEN="eyJhbGc..."
```

### 5.2 Run Migrations & Seed
```bash
# Push schema to Turso
npx prisma db push

# Seed the database
npm run db:seed
```

## Step 6: Deploy to Vercel

### Option A: Deploy via Git (Recommended)

1. **Push to GitHub:**
```bash
git add .
git commit -m "Ready for Vercel deployment with Turso"
git push origin main
```

2. **Connect to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Vite
   - Click **Deploy**

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## Step 7: Verify Deployment

### 7.1 Check API Health
Visit: `https://fifi-fashion.vercel.app/api/health`

Should return:
```json
{
  "status": "ok",
  "message": "Fifi Fashion Wears API is running on Vercel"
}
```

### 7.2 Test Endpoints
- Products: `https://fifi-fashion.vercel.app/api/products`
- Banks: `https://fifi-fashion.vercel.app/api/banks/active`
- Categories: `https://fifi-fashion.vercel.app/api/categories`

### 7.3 Test Frontend
- Home: `https://fifi-fashion.vercel.app/`
- Shop: `https://fifi-fashion.vercel.app/shop`
- Admin: `https://fifi-fashion.vercel.app/fifi-admin`

## Step 8: Admin Login

Use the same credentials:
- **Email:** admin@fififashionwears.com
- **Password:** FifiAdmin2024!

## Troubleshooting

### Issue: "Prisma Client not found"
**Solution:** Vercel needs to generate Prisma Client during build
- Check that `vercel-build` script includes `npx prisma generate`
- Redeploy

### Issue: "Database connection failed"
**Solution:** Check environment variables
- Verify `DATABASE_URL` and `TURSO_AUTH_TOKEN` are set in Vercel
- Make sure they're in all environments (Production, Preview, Development)

### Issue: "API routes return 404"
**Solution:** Check `vercel.json` configuration
- Verify routes are properly configured
- Check that `api/index.ts` exists

### Issue: "CORS errors"
**Solution:** Already handled in `api/index.ts` with `cors()` middleware

## What Changed for Deployment

### Files Created:
1. ✅ `api/index.ts` - Vercel serverless function wrapper
2. ✅ `src/lib/api/config.ts` - Dynamic API URL configuration
3. ✅ `vercel.json` - Vercel deployment configuration

### Files Modified:
1. ✅ All API files in `src/lib/api/*.ts` - Use dynamic API_URL
2. ✅ `src/pages/Checkout.tsx` - Use dynamic API_URL
3. ✅ `src/pages/Bespoke.tsx` - Use dynamic API_URL
4. ✅ `package.json` - Added `vercel-build` script
5. ✅ `server/prisma.ts` - Added Turso auth token support

### How It Works:

**Development (localhost):**
- Frontend: `http://localhost:8080`
- Backend: `http://localhost:3001`
- Database: `dev.db` (SQLite file)

**Production (Vercel):**
- Frontend: `https://fifi-fashion.vercel.app`
- Backend: `https://fifi-fashion.vercel.app/api/*` (serverless)
- Database: Turso (LibSQL cloud)

## Cost Breakdown

- **Vercel Hosting:** FREE (Hobby plan)
- **Turso Database:** FREE (500 databases, 9GB storage, 1B row reads/month)
- **Cloudinary:** FREE (25 credits/month)

**Total: $0/month** 🎉

## Post-Deployment Checklist

- [ ] Turso database created and seeded
- [ ] Environment variables set in Vercel
- [ ] Deployment successful
- [ ] API health check passes
- [ ] Products load on shop page
- [ ] Can add to cart
- [ ] Checkout process works
- [ ] Orders save to database
- [ ] Bank details display
- [ ] Bespoke form works
- [ ] Admin login works
- [ ] Admin can manage orders
- [ ] Admin can manage bespoke requests

## Need Help?

### Turso Documentation
https://docs.turso.tech/

### Vercel Documentation
https://vercel.com/docs

### Check Logs
```bash
# View deployment logs
vercel logs

# View function logs
vercel logs --follow
```

## Quick Commands Reference

```bash
# Local development
npm run dev:all

# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Check Turso database
turso db shell fifi-fashion-db

# View Turso databases
turso db list

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database
npm run db:seed
```

## 🎉 You're Ready to Deploy!

Follow the steps above and your Fifi Fashion Wears store will be live on Vercel with a cloud database!
