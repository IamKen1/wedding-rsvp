import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { initializeDatabase } from '@/lib/db';
import { sql } from '@/lib/db';

export const runtime = 'nodejs';

interface EntourageRow {
  name: string;
  role: string;
  side: 'bride' | 'groom' | 'male' | 'female' | 'both';
  category: 'parents' | 'sponsors' | 'other';
  description?: string;
  sortOrder: number;
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
        { error: 'Invalid file type. Please upload an Excel file (.xlsx or .xls)' },
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
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

    if (jsonData.length === 0) {
      return NextResponse.json(
        { error: 'Excel file is empty' },
        { status: 400 }
      );
    }

    // Validate and process data
    const entourageMembers: EntourageRow[] = [];
    const errors: string[] = [];

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowNum = i + 2; // Excel row number (accounting for header)

      // Validate required fields
      if (!row.name || typeof row.name !== 'string') {
        errors.push(`Row ${rowNum}: Name is required`);
        continue;
      }

      if (!row.role || typeof row.role !== 'string') {
        errors.push(`Row ${rowNum}: Role is required`);
        continue;
      }

      // Validate category
      const validCategories = ['parents', 'sponsors', 'other'];
      const category = row.category || 'other';
      if (!validCategories.includes(category)) {
        errors.push(`Row ${rowNum}: Category must be "parents", "sponsors", or "other"`);
        continue;
      }

      // Validate side based on category
      let side = row.side;
      if (category === 'parents') {
        if (side !== 'bride' && side !== 'groom') {
          errors.push(`Row ${rowNum}: For parents, side must be "bride" or "groom"`);
          continue;
        }
      } else if (category === 'sponsors') {
        if (side !== 'male' && side !== 'female') {
          errors.push(`Row ${rowNum}: For sponsors, side must be "male" or "female"`);
          continue;
        }
      } else {
        // For 'other' category, accept all sides
        const validSides = ['bride', 'groom', 'male', 'female', 'both'];
        if (!validSides.includes(side)) {
          errors.push(`Row ${rowNum}: Side must be one of: bride, groom, male, female, both`);
          continue;
        }
      }

      if (row.sortOrder === undefined || isNaN(Number(row.sortOrder))) {
        errors.push(`Row ${rowNum}: sortOrder must be a number`);
        continue;
      }

      entourageMembers.push({
        name: row.name.trim(),
        role: row.role.trim(),
        side: side as 'bride' | 'groom' | 'male' | 'female' | 'both',
        category: category as 'parents' | 'sponsors' | 'other',
        description: row.description ? String(row.description).trim() : '',
        sortOrder: Number(row.sortOrder)
      });
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Validation errors found',
          errors: errors,
          processedCount: entourageMembers.length,
          totalRows: jsonData.length
        },
        { status: 400 }
      );
    }

    // Initialize database
    await initializeDatabase();

    // Insert entourage members
    const insertedMembers = [];
    const insertErrors = [];

    for (const member of entourageMembers) {
      try {
        const result = await sql`
          INSERT INTO wedding_entourage (name, role, side, category, description, sort_order, image_url)
          VALUES (
            ${member.name},
            ${member.role},
            ${member.side},
            ${member.category},
            ${member.description || ''},
            ${member.sortOrder},
            ''
          )
          RETURNING id, name, role, side, category, description, sort_order as "sortOrder"
        `;
        
        insertedMembers.push(result[0]);
      } catch (err: any) {
        console.error(`Error inserting ${member.name}:`, err);
        insertErrors.push(`Failed to insert ${member.name}: ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${insertedMembers.length} entourage members`,
      insertedCount: insertedMembers.length,
      totalProcessed: entourageMembers.length,
      errors: insertErrors.length > 0 ? insertErrors : undefined,
      members: insertedMembers
    });

  } catch (error: any) {
    console.error('Error processing entourage upload:', error);
    return NextResponse.json(
      { error: 'Failed to process upload', details: error.message },
      { status: 500 }
    );
  }
}
