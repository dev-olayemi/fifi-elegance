# 🚀 Deploy to Vercel - Quick Start

## Prerequisites
- GitHub account
- Vercel account (free)
- Turso account (free)

## 5-Minute Deployment

### Step 1: Set Up Turso Database (2 minutes)

```bash
# Install Turso CLI (Windows PowerShell)
irm get.tur.so/install.ps1 | iex

# Sign up
turso auth signup

# Create database
turso db create fifi-fashion-db

# Get credentials (SAVE THESE!)
turso db show fifi-fashion-db --url
turso db tokens create fifi-fashion-db
```

**Save these values:**
- Database URL: `libsql://fifi-fashion-db-xxxxx.turso.io`
- Auth Token: `eyJhbGc...` (long string)

### Step 2: Seed Your Database (1 minute)

Create `.env.production` file:
```env
DATABASE_URL="libsql://fifi-fashion-db-xxxxx.turso.io"
TURSO_AUTH_TOKEN="eyJhbGc..."
```

Run:
```bash
npx prisma db push
npm run db:seed
```

### Step 3: Push to GitHub (1 minute)

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 4: Deploy on Vercel (1 minute)

1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Add environment variables:
   - `DATABASE_URL` = Your Turso URL
   - `TURSO_AUTH_TOKEN` = Your Turso token
   - `CLOUDINARY_CLOUD_NAME` = `dgpu70zzs`
   - `CLOUDINARY_API_KEY` = `176115457645381`
   - `CLOUDINARY_API_SECRET` = `o1dPCtQemyRQwY6VXHiRPXIMffY`
4. Click **Deploy**

## Done! 🎉

Your site will be live at: `https://fifi-fashion.vercel.app`

### Test It:
- API: https://fifi-fashion.vercel.app/api/health
- Shop: https://fifi-fashion.vercel.app/shop
- Admin: https://fifi-fashion.vercel.app/fifi-admin

### Admin Login:
- Email: `admin@fififashionwears.com`
- Password: `FifiAdmin2024!`

## Troubleshooting

**"Prisma Client not found"**
→ Redeploy (Vercel will run `npx prisma generate`)

**"Database connection failed"**
→ Check environment variables in Vercel settings

**"API returns 404"**
→ Check that `api/index.ts` exists and `vercel.json` is correct

## What's Different in Production?

| Environment | Frontend | Backend | Database |
|------------|----------|---------|----------|
| **Local** | localhost:8080 | localhost:3001 | dev.db (SQLite) |
| **Production** | vercel.app | vercel.app/api | Turso (Cloud) |

## Cost: $0/month

- Vercel: FREE
- Turso: FREE (500 DBs, 9GB storage)
- Cloudinary: FREE (25 credits/month)

## Need More Help?

See `VERCEL_DEPLOYMENT_GUIDE.md` for detailed instructions.
