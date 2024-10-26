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

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'bays.xlsx');
    const buffer = await fs.readFile(filePath);
    const workbook = XLSX.read(buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const bays: BayData[] = jsonData.map((row) => {
      const typedRow = row as ExcelBayRow;
      // Parse URLs with error handling
      let urls: string[] = [];
      try {
        if (typedRow['URLs']) {
          urls = typedRow['URLs'].split('|')
            .map((url: string) => url.trim())
            .filter((url: string) => url && isValidUrl(url));
        }
      } catch (error) {
        console.warn('Error parsing URLs for bay:', typedRow['Bay Number'], error);
      }

      // Get the hangar number from the Hangar column (previously Flightline)
      const hangar = parseInt(String(typedRow['Hangar'])) || 0;

      return {
        bayNumber: typedRow['Bay Number'] || '',
        hangar,
        serialNumber: typedRow['Serial Number'] || '',
        customerName: typedRow['Customer Name'] || '',
        rank: parseInt(String(typedRow['Rank'])) || 0,
        urls: urls
      };
    });

    return NextResponse.json(bays);
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return NextResponse.json({ error: 'Failed to read bays data' }, { status: 500 });
  }
}
