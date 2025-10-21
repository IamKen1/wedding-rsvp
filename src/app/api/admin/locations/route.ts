import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllWeddingLocations, 
  createWeddingLocation, 
  updateWeddingLocation, 
  deleteWeddingLocation,
  initializeDatabase 
} from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

// GET - Get all wedding locations
export async function GET() {
  try {
    await initializeDatabase();
    const locations = await getAllWeddingLocations();
    
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

// POST - Create a new wedding location
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const locationData = await request.json();
    
    const newLocation = {
      name: locationData.name,
      address: locationData.address,
      contactPhone: locationData.contactPhone,
      contactEmail: locationData.contactEmail,
      directions: locationData.directions,
      specialInstructions: locationData.specialInstructions,
      mapUrl: locationData.mapUrl,
      mapPhoto: locationData.mapPhoto,
      sortOrder: locationData.sortOrder
    };
    
    const result = await createWeddingLocation(newLocation);
    
    return NextResponse.json({ 
      success: true, 
      location: {
        id: result.id,
        name: result.name,
        address: result.address,
        contactPhone: result.contact_phone,
        contactEmail: result.contact_email,
        directions: result.directions,
        specialInstructions: result.special_instructions,
        mapUrl: result.map_url,
        mapPhoto: result.map_photo,
        sortOrder: result.sort_order,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      }
    });
  } catch (error) {
    console.error('Error creating wedding location:', error);
    return NextResponse.json(
      { error: 'Failed to create wedding location' },
      { status: 500 }
    );
  }
}

// PUT - Update a wedding location
export async function PUT(request: NextRequest) {
  try {
    await initializeDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Location ID is required' },
        { status: 400 }
      );
    }
    
    const locationData = await request.json();
    
    const updatedLocation = {
      name: locationData.name,
      address: locationData.address,
      contactPhone: locationData.contactPhone,
      contactEmail: locationData.contactEmail,
      directions: locationData.directions,
      specialInstructions: locationData.specialInstructions,
      mapUrl: locationData.mapUrl,
      mapPhoto: locationData.mapPhoto,
      sortOrder: locationData.sortOrder
    };
    
    const result = await updateWeddingLocation(parseInt(id), updatedLocation);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Wedding location not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      location: {
        id: result.id,
        name: result.name,
        address: result.address,
        contactPhone: result.contact_phone,
        contactEmail: result.contact_email,
        directions: result.directions,
        specialInstructions: result.special_instructions,
        mapUrl: result.map_url,
        mapPhoto: result.map_photo,
        sortOrder: result.sort_order,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      }
    });
  } catch (error) {
    console.error('Error updating wedding location:', error);
    return NextResponse.json(
      { error: 'Failed to update wedding location' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a wedding location
export async function DELETE(request: NextRequest) {
  try {
    await initializeDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Location ID is required' },
        { status: 400 }
      );
    }
    
    const result = await deleteWeddingLocation(parseInt(id));
    
    if (!result) {
      return NextResponse.json(
        { error: 'Wedding location not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Wedding location deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting wedding location:', error);
    return NextResponse.json(
      { error: 'Failed to delete wedding location' },
      { status: 500 }
    );
  }
}