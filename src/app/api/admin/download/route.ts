import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { getAllRSVPs } from '@/data/rsvp';

export async function GET() {
  try {
    // For now, skip authentication for development
    // In production, you might want to implement proper authentication
    
    const rsvps = await getAllRSVPs();

    // If no RSVPs, create sample data for the Excel
    const data = rsvps.length > 0 ? rsvps : [
      {
        id: "sample-1",
        name: "Sample Guest",
        willAttend: "yes",
        email: "sample@example.com",
        phone: "+1-555-0123",
        numberOfGuests: 2,
        dietaryRequirements: "No restrictions",
        songRequest: "Your Song",
        message: "Looking forward to celebrating!",
        invitationId: "sample-invitation",
        createdAt: new Date().toISOString()
      }
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, 'RSVPs');

    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="rsvp-data.xlsx"',
      },
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Excel file' },
      { status: 500 }
    );
  }
} 