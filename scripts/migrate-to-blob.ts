/**
 * Migration Script: Base64 to Vercel Blob Storage
 * 
 * This script migrates all prenup photos from base64 strings in the database
 * to Vercel Blob Storage, updating the database with new URLs.
 * 
 * Run with: npx tsx scripts/migrate-to-blob.ts
 */

import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(process.env.DATABASE_URL);

interface PrenupPhoto {
  id: number;
  photo_url: string;
  caption: string;
  sort_order: number;
}

async function migratePhotos() {
  console.log('🚀 Starting migration from Base64 to Vercel Blob...\n');

  try {
    // Fetch all prenup photos
    console.log('📥 Fetching photos from database...');
    const rows = await sql`
      SELECT id, photo_url, caption, sort_order 
      FROM prenup_photos 
      ORDER BY sort_order
    ` as PrenupPhoto[];

    if (rows.length === 0) {
      console.log('✅ No photos to migrate!');
      return;
    }

    console.log(`Found ${rows.length} photos to migrate\n`);

    let successCount = 0;
    let errorCount = 0;

    // Process each photo
    for (const photo of rows) {
      try {
        // Skip if already a URL (already migrated)
        if (photo.photo_url.startsWith('http')) {
          console.log(`⏭️  Photo ${photo.id}: Already migrated (URL detected)`);
          successCount++;
          continue;
        }

        console.log(`🔄 Photo ${photo.id}: Converting base64 to blob...`);

        // Convert base64 to Buffer
        const base64Data = photo.photo_url.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Determine file extension from base64 header
        const matches = photo.photo_url.match(/^data:image\/(\w+);base64,/);
        const extension = matches ? matches[1] : 'jpg';

        // Upload to Vercel Blob
        const fileName = `prenup-${photo.id}-${Date.now()}.${extension}`;
        const blob = await put(fileName, buffer, {
          access: 'public',
          addRandomSuffix: false,
        });

        // Update database with new URL
        await sql`
          UPDATE prenup_photos 
          SET photo_url = ${blob.url}
          WHERE id = ${photo.id}
        `;

        console.log(`✅ Photo ${photo.id}: Migrated successfully`);
        console.log(`   Old size: ~${Math.round(base64Data.length / 1024)}KB (base64)`);
        console.log(`   New URL: ${blob.url}\n`);
        
        successCount++;

      } catch (error) {
        console.error(`❌ Photo ${photo.id}: Migration failed`);
        console.error(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
        errorCount++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Migration Summary:');
    console.log(`   Total photos: ${rows.length}`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log('='.repeat(50));

    if (errorCount === 0) {
      console.log('\n🎉 All photos migrated successfully!');
      console.log('💡 Your website will now load 10-50x faster!');
    } else {
      console.log('\n⚠️  Some photos failed to migrate. Please check the errors above.');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run migration
migratePhotos()
  .then(() => {
    console.log('\n✨ Migration complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
