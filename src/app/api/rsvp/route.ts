import { NextResponse } from 'next/server';
import { saveRSVP } from '@/data/rsvp';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const savedEntry = await saveRSVP(body);
    return NextResponse.json({ success: true, data: savedEntry });
  } catch (error) {
    console.error('RSVP submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit RSVP' }, 
      { status: 500 }
    );
  }
} 