import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllWeddingEntourage, 
  createWeddingEntourage, 
  updateWeddingEntourage, 
  deleteWeddingEntourage,
  initializeDatabase 
} from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

// GET - Get all wedding entourage members
export async function GET() {
  try {
    await initializeDatabase();
    const entourage = await getAllWeddingEntourage();
    
    const transformedEntourage = entourage.map((member: any) => ({
      id: member.id,
      name: member.name,
      role: member.role,
      side: member.side,
      category: member.category || 'other',
      description: member.description,
      imageUrl: member.image_url,
      sortOrder: member.sort_order,
      createdAt: member.created_at,
      updatedAt: member.updated_at
    }));
    
    return NextResponse.json(transformedEntourage, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  } catch (error) {
    console.error('Error fetching wedding entourage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wedding entourage' },
      { status: 500 }
    );
  }
}

// POST - Create a new wedding entourage member
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const memberData = await request.json();
    
    const newMember = {
      name: memberData.name,
      role: memberData.role,
      side: memberData.side,
      category: memberData.category || 'other',
      description: memberData.description,
      imageUrl: memberData.imageUrl,
      sortOrder: memberData.sortOrder
    };
    
    const result = await createWeddingEntourage(newMember);
    
    return NextResponse.json({ 
      success: true, 
      member: {
        id: result.id,
        name: result.name,
        role: result.role,
        side: result.side,
        category: result.category,
        description: result.description,
        imageUrl: result.image_url,
        sortOrder: result.sort_order,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      }
    });
  } catch (error) {
    console.error('Error creating wedding entourage member:', error);
    return NextResponse.json(
      { error: 'Failed to create wedding entourage member' },
      { status: 500 }
    );
  }
}

// PUT - Update a wedding entourage member
export async function PUT(request: NextRequest) {
  try {
    await initializeDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      );
    }
    
    const memberData = await request.json();
    
    const updatedMember = {
      name: memberData.name,
      role: memberData.role,
      side: memberData.side,
      category: memberData.category || 'other',
      description: memberData.description,
      imageUrl: memberData.imageUrl,
      sortOrder: memberData.sortOrder
    };
    
    const result = await updateWeddingEntourage(parseInt(id), updatedMember);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Wedding entourage member not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      member: {
        id: result.id,
        name: result.name,
        role: result.role,
        side: result.side,
        category: result.category,
        description: result.description,
        imageUrl: result.image_url,
        sortOrder: result.sort_order,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      }
    });
  } catch (error) {
    console.error('Error updating wedding entourage member:', error);
    return NextResponse.json(
      { error: 'Failed to update wedding entourage member' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a wedding entourage member
export async function DELETE(request: NextRequest) {
  try {
    await initializeDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      );
    }
    
    const result = await deleteWeddingEntourage(parseInt(id));
    
    if (!result) {
      return NextResponse.json(
        { error: 'Wedding entourage member not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Wedding entourage member deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting wedding entourage member:', error);
    return NextResponse.json(
      { error: 'Failed to delete wedding entourage member' },
      { status: 500 }
    );
  }
}