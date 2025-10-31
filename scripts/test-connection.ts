import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function test() {
  console.log('Testing database connection...');
  try {
    const result = await sql`SELECT COUNT(*) as count FROM prenup_photos`;
    console.log('✅ Connection successful!');
    console.log('Total prenup photos:', result[0].count);
    
    const photos = await sql`SELECT id, LEFT(photo_url, 50) as photo_preview FROM prenup_photos LIMIT 3`;
    console.log('\nFirst 3 photos:');
    photos.forEach(p => console.log(`  ID ${p.id}: ${p.photo_preview}...`));
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

test();
