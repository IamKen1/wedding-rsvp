import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { getAllRSVPs } from '@/data/rsvp';
import { headers } from 'next/headers';

const ADMIN_PASSWORD = 'ilovejenna';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const rsvps = await getAllRSVPs();

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rsvps);

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