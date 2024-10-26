import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const settingsPath = path.join(process.cwd(), 'data', 'settings.json');
    const settings = await fs.readFile(settingsPath, 'utf8');
    return NextResponse.json(JSON.parse(settings));
  } catch {
    return NextResponse.json({ refreshInterval: 30 });
  }
}

export async function POST(request: Request) {
  try {
    const settings = await request.json();
    const settingsPath = path.join(process.cwd(), 'data', 'settings.json');
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
