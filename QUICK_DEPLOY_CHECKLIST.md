# ✅ Quick Deploy Checklist

## Before You Deploy

- [ ] Code is committed to GitHub
- [ ] All tests pass locally
- [ ] Admin login works locally
- [ ] Checkout works locally

## Turso Setup (2 minutes)

```bash
# Install CLI
irm get.tur.so/install.ps1 | iex

# Create account & database
turso auth signup
turso db create fifi-fashion-db

# Get credentials (SAVE THESE!)
turso db show fifi-fashion-db --url
turso db tokens create fifi-fashion-db
```

**Save:**
- [ ] Database URL: `libsql://...`
- [ ] Auth Token: `eyJhbGc...`

## Seed Database (1 minute)

Create `.env.production`:
```env
DATABASE_URL="libsql://your-url-here"
TURSO_AUTH_TOKEN="your-token-here"
```

Run:
```bash
npx prisma db push
npm run db:seed
```

- [ ] Database seeded successfully

## Deploy to Vercel (2 minutes)

1. Go to https://vercel.com/new
2. Import GitHub repo: `fifi-fashion`
3. Add environment variables:

```
DATABASE_URL = libsql://...
TURSO_AUTH_TOKEN = eyJhbGc...
CLOUDINARY_CLOUD_NAME = dgpu70zzs
CLOUDINARY_API_KEY = 176115457645381
CLOUDINARY_API_SECRET = o1dPCtQemyRQwY6VXHiRPXIMffY
```

4. Click **Deploy**

- [ ] Deployment successful

## Verify Deployment (1 minute)

Test these URLs:

- [ ] https://fifi-fashion.vercel.app (Homepage loads)
- [ ] https://fifi-fashion.vercel.app/api/health (Returns OK)
- [ ] https://fifi-fashion.vercel.app/shop (Products load)
- [ ] https://fifi-fashion.vercel.app/fifi-admin (Admin login works)

## Test Complete Flow (3 minutes)

- [ ] Add product to cart
- [ ] Go to checkout
- [ ] Fill details and submit
- [ ] Order number appears
- [ ] Bank details display
- [ ] Login to admin
- [ ] Order appears in admin panel
- [ ] Can confirm payment

## Done! 🎉

Your site is live at: **https://fifi-fashion.vercel.app**

---

## If Something Goes Wrong

### Build fails
→ Check Vercel logs, ensure all dependencies installed

### API 404
→ Verify `api/index.ts` exists

### Database error
→ Check environment variables in Vercel

### Need help?
→ See `VERCEL_DEPLOYMENT_GUIDE.md` for detailed instructions

---

**Total Time: ~10 minutes**
**Total Cost: $0/month**
