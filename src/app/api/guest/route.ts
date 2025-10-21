import { NextRequest, NextResponse } from 'next/server';
import { getGuestByInvitationCode } from '@/data/rsvp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get('id');

    if (!invitationId) {
      return NextResponse.json(
        { error: 'Invitation ID is required' },
        { status: 400 }
      );
    }

    const guest = await getGuestByInvitationCode(invitationId);

    if (!guest) {
      return NextResponse.json(
        { error: 'Invalid invitation ID' },
        { status: 404 }
      );
    }

    // Return guest information without sensitive data
    const guestInfo = {
      invitationCode: guest.invitationCode,
      name: guest.name,
      allocatedSeats: guest.allocatedSeats,
      notes: guest.notes
    };

    return NextResponse.json({ guest: guestInfo });

  } catch (error) {
    console.error('Error fetching guest info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guest information' },
      { status: 500 }
    );
  }
}