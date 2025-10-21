import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllGuests as dbGetAllGuests,
  createGuest,
  deleteGuest as dbDeleteGuest,
  updateGuest,
  initializeDatabase
} from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Get all guests
export async function GET() {
  try {
    await initializeDatabase();
    const guests = await dbGetAllGuests();
    
    const transformedGuests = guests.map((guest: any) => ({
      invitationCode: guest.invitationCode,
      name: guest.name,
      email: guest.email || undefined,
      allocatedSeats: guest.allocatedSeats,
      notes: guest.notes || undefined
    }));
    
    return NextResponse.json(transformedGuests);
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guests' },
      { status: 500 }
    );
  }
}

// POST - Add a new guest
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const guestData = await request.json();
    
    // Generate random invitation code if not provided
    const invitationCode = guestData.invitationCode || generateRandomCode();
    
    const newGuest = {
      invitationCode,
      name: guestData.name,
      email: guestData.email,
      allocatedSeats: guestData.allocatedSeats,
      notes: guestData.notes
    };
    
    const result = await createGuest(newGuest);
    
    const transformedGuest = {
      invitationCode: result.invitation_code,
      name: result.name,
      email: result.email,
      allocatedSeats: result.allocated_seats,
      notes: result.notes
    };
    
    return NextResponse.json({ guest: transformedGuest });
  } catch (error) {
    console.error('Error adding guest:', error);
    return NextResponse.json(
      { error: 'Failed to add guest' },
      { status: 500 }
    );
  }
}

// PUT - Update a guest
export async function PUT(request: NextRequest) {
  try {
    await initializeDatabase();
    const guestData = await request.json();
    
    if (!guestData.invitationCode) {
      return NextResponse.json(
        { error: 'Invitation code is required' },
        { status: 400 }
      );
    }
    
    const updatedGuest = {
      invitationCode: guestData.invitationCode,
      name: guestData.name,
      email: guestData.email,
      allocatedSeats: guestData.allocatedSeats,
      notes: guestData.notes
    };
    
    const result = await updateGuest(updatedGuest);
    
    return NextResponse.json({ 
      success: true, 
      guest: result 
    });
  } catch (error) {
    console.error('Error updating guest:', error);
    return NextResponse.json(
      { error: 'Failed to update guest' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a guest
export async function DELETE(request: NextRequest) {
  try {
    await initializeDatabase();
    const { searchParams } = new URL(request.url);
    const invitationCode = searchParams.get('id');
    
    if (!invitationCode) {
      return NextResponse.json(
        { error: 'Invitation code is required' },
        { status: 400 }
      );
    }
    
    const result = await dbDeleteGuest(invitationCode);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Guest not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting guest:', error);
    return NextResponse.json(
      { error: 'Failed to delete guest' },
      { status: 500 }
    );
  }
}

function generateRandomCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}