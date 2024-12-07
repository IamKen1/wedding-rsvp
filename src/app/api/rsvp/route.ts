import { NextResponse } from 'next/server';
import { saveRSVP } from '../../../data/rsvp';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received RSVP request:', body);
    
    if (!body.name || !body.email || !body.willAttend) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const savedEntry = await saveRSVP(body);
    console.log('RSVP saved successfully:', savedEntry);
    return NextResponse.json({ success: true, data: savedEntry });
  } catch (error) {
    console.error('RSVP submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit RSVP' },
      { status: 500 }
    );
  }
} 