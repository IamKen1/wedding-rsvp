import { NextRequest, NextResponse } from 'next/server';
import { getAllRSVPs } from '@/data/rsvp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invitationCode = searchParams.get('invitationCode');

    if (!invitationCode) {
      return NextResponse.json(
        { error: 'Invitation code is required' },
        { status: 400 }
      );
    }

    const allRSVPs = await getAllRSVPs();
    const existingRSVP = allRSVPs.find(rsvp => rsvp.invitationCode === invitationCode);

    if (existingRSVP) {
      return NextResponse.json({ 
        hasRSVP: true, 
        rsvp: {
          id: existingRSVP.id,
          name: existingRSVP.name,
          willAttend: existingRSVP.willAttend,
          numberOfGuests: existingRSVP.numberOfGuests,
          email: existingRSVP.email,
          phone: existingRSVP.phone,
          message: existingRSVP.message,
          timestamp: existingRSVP.timestamp
        }
      });
    }

    return NextResponse.json({ hasRSVP: false });

  } catch (error) {
    console.error('Error checking RSVP:', error);
    return NextResponse.json(
      { error: 'Failed to check RSVP status' },
      { status: 500 }
    );
  }
}