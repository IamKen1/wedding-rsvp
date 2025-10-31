import { NextRequest, NextResponse } from 'next/server';
import { 
  initializeDatabase, 
  getAllPrenupPhotos, 
  createPrenupPhoto, 
  updatePrenupPhoto, 
  deletePrenupPhoto,
  createMultiplePrenupPhotos 
} from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

// GET - Get all prenup photos
export async function GET() {
  try {
    await initializeDatabase();
    const photos = await getAllPrenupPhotos();
    
    // Transform database column names to camelCase
    const transformedPhotos = photos.map((photo: any) => ({
      id: photo.id,
      photoUrl: photo.photo_url,
      caption: photo.caption,
      sortOrder: photo.sort_order,
      createdAt: photo.created_at,
      updatedAt: photo.updated_at
    }));
    
    return NextResponse.json({ photos: transformedPhotos });
  } catch (error) {
    console.error('Error fetching prenup photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prenup photos' },
      { status: 500 }
    );
  }
}

// POST - Create new prenup photo(s)
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const body = await request.json();
    
    // Check if it's a batch upload
    if (Array.isArray(body.photos)) {
      const photos = await createMultiplePrenupPhotos(
        body.photos.map((p: any, index: number) => ({
          photoUrl: p.photoUrl,
          caption: p.caption || '',
          sortOrder: p.sortOrder !== undefined ? p.sortOrder : index
        }))
      );
      
      return NextResponse.json({ 
        success: true, 
        photos: photos.map((p: any) => ({
          id: p.id,
          photoUrl: p.photo_url,
          caption: p.caption,
          sortOrder: p.sort_order
        }))
      });
    } else {
      // Single photo upload
      const photo = await createPrenupPhoto({
        photoUrl: body.photoUrl,
        caption: body.caption || '',
        sortOrder: body.sortOrder || 0
      });
      
      return NextResponse.json({ 
        success: true, 
        photo: {
          id: photo.id,
          photoUrl: photo.photo_url,
          caption: photo.caption,
          sortOrder: photo.sort_order
        }
      });
    }
  } catch (error) {
    console.error('Error creating prenup photo:', error);
    return NextResponse.json(
      { error: 'Failed to create prenup photo' },
      { status: 500 }
    );
  }
}

// PUT - Update a prenup photo
export async function PUT(request: NextRequest) {
  try {
    await initializeDatabase();
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Photo ID is required' },
        { status: 400 }
      );
    }
    
    const photo = await updatePrenupPhoto(body.id, {
      photoUrl: body.photoUrl,
      caption: body.caption || '',
      sortOrder: body.sortOrder || 0
    });
    
    return NextResponse.json({ 
      success: true, 
      photo: {
        id: photo.id,
        photoUrl: photo.photo_url,
        caption: photo.caption,
        sortOrder: photo.sort_order
      }
    });
  } catch (error) {
    console.error('Error updating prenup photo:', error);
    return NextResponse.json(
      { error: 'Failed to update prenup photo' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a prenup photo
export async function DELETE(request: NextRequest) {
  try {
    await initializeDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Photo ID is required' },
        { status: 400 }
      );
    }
    
    await deletePrenupPhoto(parseInt(id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting prenup photo:', error);
    return NextResponse.json(
      { error: 'Failed to delete prenup photo' },
      { status: 500 }
    );
  }
}
