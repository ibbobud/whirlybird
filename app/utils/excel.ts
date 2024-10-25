import * as XLSX from 'xlsx';
import path from 'path';
import { promises as fs } from 'fs';

export interface BayData {
  bayNumber: number;
  flightline: number;
  serialNumber: string;
  customerName: string;
  rank: number;
  urls: string[];
}

export async function readExcelFile(): Promise<BayData[]> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'bays.xlsx');
    const buffer = await fs.readFile(filePath);
    const workbook = XLSX.read(buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    return jsonData.map((row: any) => ({
      bayNumber: parseInt(row['Bay Number']),
      flightline: parseInt(row['Flightline']),
      serialNumber: row['Serial Number'],
      customerName: row['Customer Name'],
      rank: parseInt(row['Rank']),
      urls: row['URLs'].split('|')
    }));
  } catch (error) {
    console.error('Error reading Excel file:', error);
    throw error;
  }
}

export async function writeExcelFile(data: BayData[]) {
  try {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map(bay => ({
        'Bay Number': bay.bayNumber,
        'Flightline': bay.flightline,
        'Serial Number': bay.serialNumber,
        'Customer Name': bay.customerName,
        'Rank': bay.rank,
        'URLs': bay.urls.join('|')
      }))
    );
    
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
