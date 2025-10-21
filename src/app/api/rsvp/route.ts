import { NextResponse } from 'next/server';
import { saveRSVP } from '@/data/rsvp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received RSVP request:', body);
    
    if (!body.name || !body.willAttend) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: name and attendance confirmation are required' },
        { status: 400 }
      );
    }

    // Ensure numberOfGuests has a default value and map invitationId to invitationCode
    const rsvpData = {
      name: body.name,
      email: body.email || '',
      phone: body.phone || '',
      willAttend: body.willAttend,
      numberOfGuests: body.numberOfGuests || (body.willAttend === 'yes' ? 1 : 0),
      dietaryRequirements: body.dietaryRequirements || '',
      songRequest: body.songRequest || '',
      message: body.message || '',
      invitationCode: body.invitationId || body.invitationCode || null
    };

    console.log('Processed RSVP data:', rsvpData);

    try {
      const savedEntry = await saveRSVP(rsvpData);
      console.log('RSVP saved successfully:', savedEntry);
      return NextResponse.json({ success: true, data: savedEntry });
    } catch (dbError) {
      console.error('Database error saving RSVP:', dbError);
      
      // Provide more specific error information
      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error';
      console.error('Detailed error:', errorMessage);
      
      return NextResponse.json(
        { 
          error: 'Failed to save RSVP. Please try again.',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('RSVP submission error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
} 