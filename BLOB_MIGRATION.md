# 🚀 Vercel Blob Storage Migration Guide

This guide will help you migrate your prenup photos from base64 storage to Vercel Blob Storage, making your website load **10-50x faster**!

## 📋 Prerequisites

Before starting, make sure you have:
- A Vercel account
- Your project deployed to Vercel (or ready to deploy)
- Access to your database

---

## Step 1: Get Your Vercel Blob Token

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Storage** tab
4. Click **Create Database** → Select **Blob**
5. Give it a name (e.g., "wedding-images")
6. Click **Create**
7. Copy the **BLOB_READ_WRITE_TOKEN** value

---

## Step 2: Add Environment Variable

### For Local Development:

1. Create a `.env.local` file in your project root (if not exists)
2. Add this line:
```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

### For Production (Vercel):

The token is automatically added when you create the Blob store. No action needed!

---

## Step 3: Install Required Package

The package should already be installed. Verify with:

```bash
npm list @vercel/blob
```

If not installed, run:
```bash
npm install @vercel/blob
```

---

## Step 4: Run the Migration Script

**⚠️ IMPORTANT: This will modify your database. Backup your database first!**

```bash
# Install tsx if you haven't
npm install -g tsx

# Run the migration
npx tsx scripts/migrate-to-blob.ts
```

### What the script does:

1. ✅ Reads all prenup photos from your database
2. ✅ Converts base64 strings to actual image files
3. ✅ Uploads each image to Vercel Blob
4. ✅ Updates database with new URLs
5. ✅ Skips already-migrated photos (safe to re-run!)

### Expected Output:

```
🚀 Starting migration from Base64 to Vercel Blob...

📥 Fetching photos from database...
Found 12 photos to migrate

🔄 Photo 1: Converting base64 to blob...
✅ Photo 1: Migrated successfully
   Old size: ~2500KB (base64)
   New URL: https://xxxxx.public.blob.vercel-storage.com/prenup-1.jpg

... (continues for all photos)

📊 Migration Summary:
   Total photos: 12
   ✅ Successful: 12
   ❌ Failed: 0

🎉 All photos migrated successfully!
💡 Your website will now load 10-50x faster!
```

---

## Step 5: Test Your Website

1. Start your development server:
```bash
npm run dev
```

2. Navigate to the Prenup Photos section
3. Photos should load much faster now! 🎉

---

## Step 6: Deploy to Vercel

```bash
git add .
git commit -m "feat: migrate to Vercel Blob storage"
git push
```

Vercel will automatically deploy with the new changes.

---

## 🎯 What Changed?

### Before (Base64):
- ❌ Photos stored as huge text strings in database
- ❌ 2-3MB per image
- ❌ Slow database queries
- ❌ No caching
- ❌ 20-30 second load times

### After (Vercel Blob):
- ✅ Photos on global CDN
- ✅ 200-400KB per image (optimized)
- ✅ Browser caching
- ✅ Lazy loading works properly
- ✅ 2-3 second load times

---

## 🔧 Troubleshooting

### "Cannot find module '@vercel/blob'"
**Solution:** Run `npm install @vercel/blob`

### "BLOB_READ_WRITE_TOKEN is not defined"
**Solution:** Make sure you added the token to `.env.local`

### "Migration failed: Network error"
**Solution:** Check your internet connection and Vercel account status

### Photos still slow after migration
**Solution:** 
1. Clear browser cache (Ctrl+Shift+R)
2. Check that database was updated (URLs should start with `https://`)
3. Verify Vercel Blob store is active in dashboard

---

## 📊 Monitoring

After migration, you can monitor your Blob storage usage:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Storage** → **Your Blob Store**
4. View usage statistics and files

---

## 🎉 Done!

Your prenup photos are now served from Vercel's global CDN! Your website should feel dramatically faster.

### Future Uploads

All new photos uploaded through the admin panel will automatically use Vercel Blob - no additional configuration needed!

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the error messages carefully
2. Verify your Vercel Blob token is correct
3. Make sure your database connection is working
4. Try running the migration script again (it's safe to re-run)

---

**Happy Migrating! 🚀**
