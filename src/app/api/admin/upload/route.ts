import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { GuestInvitation } from '@/data/guests';

// Helper function to generate unique invitation ID
function generateInvitationId(name: string, existingIds: string[]): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  // Keep generating until we get a unique code
  do {
    result = '';
    // Generate 8 character random code (e.g., "K8X9M2P7")
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  } while (existingIds.includes(result));
  
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { error: 'Please upload an Excel file (.xlsx or .xls)' },
        { status: 400 }
      );
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      return NextResponse.json(
        { error: 'Excel file is empty or has no data' },
        { status: 400 }
      );
    }

    // Validate and process data
    const processedGuests: GuestInvitation[] = [];
    const errors: string[] = [];
    const existingIds: string[] = [];

    jsonData.forEach((row: any, index: number) => {
      const rowNumber = index + 2; // Excel rows start at 1, plus header row
      
      // Validate required fields
      if (!row.name || typeof row.name !== 'string') {
        errors.push(`Row ${rowNumber}: Name is required`);
        return;
      }

      if (!row.allocatedSeats || typeof row.allocatedSeats !== 'number' || row.allocatedSeats < 1) {
        errors.push(`Row ${rowNumber}: Allocated seats must be a number greater than 0`);
        return;
      }

      // Validate email format if provided
      if (row.email && typeof row.email === 'string' && row.email.trim() !== '') {
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(row.email.trim())) {
          errors.push(`Row ${rowNumber}: Invalid email format`);
          return;
        }
      }

      // Generate unique ID
      const invitationCode = generateInvitationId(row.name, existingIds);
      existingIds.push(invitationCode);

      // Create guest object
      const guest: GuestInvitation = {
        invitationCode,
        name: row.name.trim(),
        email: (row.email && typeof row.email === 'string' && row.email.trim() !== '') 
          ? row.email.trim() 
          : undefined,
        allocatedSeats: row.allocatedSeats,
        notes: (row.notes && typeof row.notes === 'string' && row.notes.trim() !== '') 
          ? row.notes.trim() 
          : undefined
      };

      processedGuests.push(guest);
    });

    // Return results
    return NextResponse.json({
      success: true,
      data: {
        guests: processedGuests,
        totalProcessed: processedGuests.length,
        errors: errors.length > 0 ? errors : undefined
      }
    });

  } catch (error) {
    console.error('Excel upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process Excel file. Please check the file format and try again.' },
      { status: 500 }
    );
  }
}