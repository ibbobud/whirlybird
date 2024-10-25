import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'data', 'settings.json');

export async function GET() {
  try {
    const settings = await fs.readFile(settingsPath, 'utf-8');
    return NextResponse.json(JSON.parse(settings));
  } catch (error) {
    // If file doesn't exist, return default settings
    return NextResponse.json({ rotationInterval: 10000 });
  }
}

export async function PUT(request: Request) {
  try {
    const settings = await request.json();
    
    // Ensure the data directory exists
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
    
    // Write the settings to file
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
