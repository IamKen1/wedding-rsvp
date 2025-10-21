import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Create sample template data with new category structure
    const templateData = [
      // Parents - MUST use bride/groom for side
      { name: 'Josefina Igaya', role: 'Mother of the Bride', category: 'parents', side: 'bride', description: '', sortOrder: 1 },
      { name: 'Antonio Igaya', role: 'Father of the Bride', category: 'parents', side: 'bride', description: '', sortOrder: 2 },
      { name: 'Marites Gutierrez', role: 'Mother of the Groom', category: 'parents', side: 'groom', description: '', sortOrder: 3 },
      { name: 'Rafael Gutierrez', role: 'Father of the Groom', category: 'parents', side: 'groom', description: '', sortOrder: 4 },
      
      // Principal Sponsors - MUST use male/female for side
      { name: 'Ponciano Rivera', role: 'Principal Sponsor', category: 'sponsors', side: 'male', description: '', sortOrder: 1 },
      { name: 'Victoriano Sullera', role: 'Principal Sponsor', category: 'sponsors', side: 'male', description: '', sortOrder: 2 },
      { name: 'Angeles Duque', role: 'Principal Sponsor', category: 'sponsors', side: 'male', description: '', sortOrder: 3 },
      { name: 'Jorge Mariano', role: 'Principal Sponsor', category: 'sponsors', side: 'male', description: '', sortOrder: 4 },
      { name: 'Rudolfo Palaganas', role: 'Principal Sponsor', category: 'sponsors', side: 'male', description: '', sortOrder: 5 },
      { name: 'Milagros Gutierrez', role: 'Principal Sponsor', category: 'sponsors', side: 'female', description: '', sortOrder: 1 },
      { name: 'Lilibeth Dayrit Jose', role: 'Principal Sponsor', category: 'sponsors', side: 'female', description: '', sortOrder: 2 },
      { name: 'Maria Luisa Maxwell', role: 'Principal Sponsor', category: 'sponsors', side: 'female', description: '', sortOrder: 3 },
      { name: 'Julie Barquez', role: 'Principal Sponsor', category: 'sponsors', side: 'female', description: '', sortOrder: 4 },
      { name: 'Imelda Mendoza', role: 'Principal Sponsor', category: 'sponsors', side: 'female', description: '', sortOrder: 5 },
      
      // Other Entourage - Can use any side (bride/groom/male/female/both)
      { name: 'Rommel Columbano', role: 'Best Man', category: 'other', side: 'both', description: '', sortOrder: 1 },
      { name: 'Jolina Madrilejo', role: 'Matron of Honor', category: 'other', side: 'both', description: '', sortOrder: 2 },
      { name: 'Dexter Junio', role: 'Groomsman - Candle', category: 'other', side: 'both', description: '', sortOrder: 3 },
      { name: 'Yumi Palomares', role: 'Bridesmaid - Candle', category: 'other', side: 'both', description: '', sortOrder: 4 },
      { name: 'Yohan Palomares', role: 'Groomsman - Veil', category: 'other', side: 'both', description: '', sortOrder: 5 },
      { name: 'Rose Marie Gutierrez', role: 'Bridesmaid - Veil', category: 'other', side: 'both', description: '', sortOrder: 6 },
      { name: 'Denzel Madrilejo', role: 'Groomsman - Cord', category: 'other', side: 'both', description: '', sortOrder: 7 },
      { name: 'Trisha Fajardo', role: 'Bridesmaid - Cord', category: 'other', side: 'both', description: '', sortOrder: 8 },
      { name: 'Kyrios Giel Aguirre', role: 'Ring Bearer', category: 'other', side: 'both', description: '', sortOrder: 9 },
      { name: 'Reneboy Ramos Jr.', role: 'Coin Bearer', category: 'other', side: 'both', description: '', sortOrder: 10 },
      { name: 'Arkin Valderama', role: 'Bible Bearer', category: 'other', side: 'both', description: '', sortOrder: 11 },
      { name: 'Kylie Gwyn Aguirre', role: 'Flower Girl', category: 'other', side: 'both', description: '', sortOrder: 12 },
      { name: 'Kendall Taylor Fajardo', role: 'Flower Girl', category: 'other', side: 'both', description: '', sortOrder: 13 },
      { name: 'Kiara Columbano', role: 'Flower Girl', category: 'other', side: 'both', description: '', sortOrder: 14 },
    ];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);

    // Set column widths for better readability
    ws['!cols'] = [
      { wch: 30 }, // name
      { wch: 25 }, // role
      { wch: 15 }, // category
      { wch: 12 }, // side
      { wch: 40 }, // description
      { wch: 12 }  // sortOrder
    ];

    // Instructions are implicitly defined by the sample data and column names
    // Users can refer to documentation or tooltip hints in the admin UI
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Wedding Entourage');

    // Generate Excel buffer
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="wedding-entourage-template.xlsx"',
      },
    });

  } catch (error) {
    console.error('Error generating entourage template:', error);
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    );
  }
}
