import { NextResponse } from 'next/server';
import { getAllWeddingLocations, initializeDatabase } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

// Public GET endpoint - Get all wedding locations for display on RSVP page
export async function GET() {
  try {
    console.log('Fetching wedding locations...');
    await initializeDatabase();
    const locations = await getAllWeddingLocations();
    console.log('Raw locations from DB:', locations);
    
    // Transform database column names to camelCase
    const transformedLocations = locations.map((location: any) => ({
      id: location.id,
      name: location.name,
      address: location.address,
      contactPhone: location.contact_phone,
      contactEmail: location.contact_email,
      directions: location.directions,
      specialInstructions: location.special_instructions,
      mapUrl: location.map_url,
      mapPhoto: location.map_photo,
      sortOrder: location.sort_order,
      createdAt: location.created_at,
      updatedAt: location.updated_at
    }));
    
    console.log('Transformed locations:', transformedLocations);
    
    return NextResponse.json(transformedLocations, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  } catch (error) {
    console.error('Error fetching wedding locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wedding locations' },
      { status: 500 }
    );
  }
}
