import { NextResponse } from 'next/server';
import { initializeDatabase, getAllPrenupPhotos } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

// Public GET endpoint - Get all prenup photos for display on RSVP page
export async function GET() {
  try {
    console.log('Fetching prenup photos...');
    await initializeDatabase();
    const photos = await getAllPrenupPhotos();
    console.log('Raw photos from DB:', photos);
    
    // Transform database column names to camelCase
    const transformedPhotos = photos.map((photo: any) => ({
      id: photo.id,
      photoUrl: photo.photo_url,
      caption: photo.caption,
      sortOrder: photo.sort_order,
      createdAt: photo.created_at,
      updatedAt: photo.updated_at
    }));
    
    console.log('Transformed photos:', transformedPhotos);
    
    return NextResponse.json(transformedPhotos, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  } catch (error) {
    console.error('Error fetching prenup photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prenup photos' },
      { status: 500 }
    );
  }
}
