import * as XLSX from 'xlsx';
import path from 'path';
import { promises as fs } from 'fs';

export interface BayData {
  bayNumber: string; // Changed to string to store full bay identifier (e.g., "1-1")
  hangar: number; // Renamed from flightline
  serialNumber: string;
  customerName: string;
  rank: number;
  urls: string[];
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

export async function readExcelFile(): Promise<BayData[]> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'bays.xlsx');
    const buffer = await fs.readFile(filePath);
    const workbook = XLSX.read(buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    return jsonData.map((row: any) => {
      // Parse URLs with error handling
      let urls: string[] = [];
      try {
        if (row['URLs']) {
          urls = row['URLs'].split('|')
            .map((url: string) => url.trim())
            .filter((url: string) => url && isValidUrl(url));
        }
      } catch (error) {
        console.warn('Error parsing URLs for bay:', row['Bay Number'], error);
      }

      // Get the hangar number from the Hangar column (previously Flightline)
      const hangar = parseInt(row['Hangar']) || 0;

      return {
        bayNumber: row['Bay Number'] || '', // Now storing the full bay identifier
        hangar, // Using the new hangar field
        serialNumber: row['Serial Number'] || '',
        customerName: row['Customer Name'] || '',
        rank: parseInt(row['Rank']) || 0,
        urls: urls
      };
    });
  } catch (error) {
    console.error('Error reading Excel file:', error);
    throw error;
  }
}

export async function writeExcelFile(data: BayData[]) {
  try {
    // Validate and sanitize data before writing
    const sanitizedData = data.map(bay => ({
      'Bay Number': bay.bayNumber, // Now writing the full bay identifier
      'Hangar': bay.hangar, // Renamed from Flightline
      'Serial Number': bay.serialNumber || '',
      'Customer Name': bay.customerName || '',
      'Rank': bay.rank || 0,
      'URLs': sanitizeUrls(bay.urls).join('|')
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(sanitizedData);
    
    // Set column widths for better readability
    const colWidths = {
      'A': 10,  // Bay Number
      'B': 10,  // Hangar
      'C': 15,  // Serial Number
      'D': 20,  // Customer Name
      'E': 10,  // Rank
      'F': 50   // URLs
    };
    
    worksheet['!cols'] = Object.values(colWidths).map(width => ({ width }));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bays');
    
    const filePath = path.join(process.cwd(), 'data', 'bays.xlsx');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    await fs.writeFile(filePath, buffer);
  } catch (error) {
    console.error('Error writing Excel file:', error);
    throw error;
  }
}
