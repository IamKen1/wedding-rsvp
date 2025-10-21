import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    // Create sample template data
    const templateData = [
      {
        name: 'John & Jane Smith',
        email: 'john.smith@email.com',
        allocatedSeats: 2,
        notes: 'Couple from work'
      },
      {
        name: 'The Johnson Family',
        email: 'johnson.family@email.com',
        allocatedSeats: 4,
        notes: 'Parents + 2 children'
      },
      {
        name: 'Maria Garcia',
        email: '',
        allocatedSeats: 1,
        notes: 'No email available'
      }
    ];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);

    // Set column widths for better readability
    ws['!cols'] = [
      { wch: 25 }, // name
      { wch: 30 }, // email
      { wch: 15 }, // allocatedSeats
      { wch: 30 }  // notes
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Guest Invitations');

    // Generate Excel buffer
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="guest-invitation-template.xlsx"',
      },
    });

  } catch (error) {
    console.error('Template download error:', error);
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    );
  }
}