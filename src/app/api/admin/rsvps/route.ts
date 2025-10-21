import { NextResponse } from 'next/server';
import { getAllRSVPs } from '@/data/rsvp';
import { clearAllRSVPs } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rsvps = await getAllRSVPs();
    
    // Transform the data to match the expected format in the admin page
    const transformedRsvps = rsvps.map(rsvp => ({
      id: rsvp.id,
      name: rsvp.name,
      willAttend: rsvp.willAttend,
      email: rsvp.email,
      phone: rsvp.phone || '',
      numberOfGuests: rsvp.numberOfGuests,
      dietaryRequirements: rsvp.dietaryRequirements,
      songRequest: rsvp.songRequest,
      message: rsvp.message,
      invitationId: rsvp.invitationCode,
      createdAt: rsvp.timestamp
    }));
    
    return NextResponse.json(transformedRsvps);
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSVPs' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const result = await clearAllRSVPs();
    
    console.log('All RSVPs cleared successfully');
    return NextResponse.json({ 
      success: true, 
      message: 'All RSVPs have been cleared successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error clearing RSVPs:', error);
    return NextResponse.json(
      { error: 'Failed to clear RSVPs' },
      { status: 500 }
    );
  }
}