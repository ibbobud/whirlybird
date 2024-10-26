import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import { BayData } from '../../utils/excel';

interface ExcelBayRow {
  'Bay Number': string;
  'Hangar': number;
  'Serial Number': string;
  'Customer Name': string;
  'Rank': number;
  'URLs': string;
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function sanitizeUrls(urls: string[]): string[] {
  if (!Array.isArray(urls)) return [];
  return urls
    .map(url => url?.trim())
    .filter(url => url && isValidUrl(url));
}

export async function PUT(request: Request) {
  try {
    const updatedBay: BayData = await request.json();
    const filePath = path.join(process.cwd(), 'data', 'bays.xlsx');
    
    // Read current data
    const buffer = await fs.readFile(filePath);
    const workbook = XLSX.read(buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    // Update the matching bay
    const updatedData = jsonData.map((row) => {
      const typedRow = row as ExcelBayRow;
      if (typedRow['Bay Number'] === updatedBay.bayNumber) {
        return {
          'Bay Number': updatedBay.bayNumber,
          'Hangar': updatedBay.hangar,
          'Serial Number': updatedBay.serialNumber,
          'Customer Name': updatedBay.customerName,
          'Rank': updatedBay.rank,
          'URLs': sanitizeUrls(updatedBay.urls).join('|')
        };
      }
      return typedRow;
    });
    
    // Write back to Excel
    const newWorksheet = XLSX.utils.json_to_sheet(updatedData);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Bays');
    
    const buffer2 = XLSX.write(newWorkbook, { type: 'buffer', bookType: 'xlsx' });
    await fs.writeFile(filePath, buffer2);
    
    return NextResponse.json(updatedBay);
  } catch (error) {
    console.error('Error updating bay:', error);
    return NextResponse.json({ error: 'Failed to update bay' }, { status: 500 });
  }
}
