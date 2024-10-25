import { NextResponse } from 'next/server';
import { readExcelFile } from '../../utils/excel';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const headersList = await headers();
    const bays = await readExcelFile();
    return NextResponse.json(bays);
  } catch (error) {
    console.error('Error reading bays:', error);
    return NextResponse.json(
      { error: 'Failed to read bays data' }, 
      { status: 500 }
    );
  }
}
