import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllWeddingAttire, 
  createWeddingAttire, 
  updateWeddingAttire, 
  deleteWeddingAttire,
  initializeDatabase 
} from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

// GET - Get all wedding attire guidelines
export async function GET() {
  try {
    await initializeDatabase();
    const attire = await getAllWeddingAttire();
    
    const transformedAttire = attire.map((item: any) => ({
      id: item.id,
      category: item.category,
      title: item.title,
      description: item.description,
      colorScheme: item.color_scheme,
      dressCode: item.dress_code,
      guidelines: item.guidelines,
      photos: item.photos || [],
      sortOrder: item.sort_order,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
    
    return NextResponse.json(transformedAttire, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  } catch (error) {
    console.error('Error fetching wedding attire:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wedding attire' },
      { status: 500 }
    );
  }
}

// POST - Create a new wedding attire guideline
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const attireData = await request.json();
    
    const newAttire = {
      category: attireData.category,
      title: attireData.title,
      description: attireData.description,
      colorScheme: attireData.colorScheme,
      dressCode: attireData.dressCode,
      guidelines: attireData.guidelines,
      photos: attireData.photos || [],
      sortOrder: attireData.sortOrder
    };
    
    const result = await createWeddingAttire(newAttire);
    
    return NextResponse.json({ 
      success: true, 
      attire: {
        id: result.id,
        category: result.category,
        title: result.title,
        description: result.description,
        colorScheme: result.color_scheme,
        dressCode: result.dress_code,
        guidelines: result.guidelines,
        photos: result.photos || [],
        sortOrder: result.sort_order,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      }
    });
  } catch (error) {
    console.error('Error creating wedding attire:', error);
    return NextResponse.json(
      { error: 'Failed to create wedding attire' },
      { status: 500 }
    );
  }
}

// PUT - Update a wedding attire guideline
export async function PUT(request: NextRequest) {
  try {
    await initializeDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Attire ID is required' },
        { status: 400 }
      );
    }
    
    const attireData = await request.json();
    
    const updatedAttire = {
      category: attireData.category,
      title: attireData.title,
      description: attireData.description,
      colorScheme: attireData.colorScheme,
      dressCode: attireData.dressCode,
      guidelines: attireData.guidelines,
      photos: attireData.photos || [],
      sortOrder: attireData.sortOrder
    };
    
    const result = await updateWeddingAttire(parseInt(id), updatedAttire);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Wedding attire not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      attire: {
        id: result.id,
        category: result.category,
        title: result.title,
        description: result.description,
        colorScheme: result.color_scheme,
        dressCode: result.dress_code,
        guidelines: result.guidelines,
        photos: result.photos || [],
        sortOrder: result.sort_order,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      }
    });
  } catch (error) {
    console.error('Error updating wedding attire:', error);
    return NextResponse.json(
      { error: 'Failed to update wedding attire' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a wedding attire guideline
export async function DELETE(request: NextRequest) {
  try {
    await initializeDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Attire ID is required' },
        { status: 400 }
      );
    }
    
    const result = await deleteWeddingAttire(parseInt(id));
    
    if (!result) {
      return NextResponse.json(
        { error: 'Wedding attire not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Wedding attire deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting wedding attire:', error);
    return NextResponse.json(
      { error: 'Failed to delete wedding attire' },
      { status: 500 }
    );
  }
}