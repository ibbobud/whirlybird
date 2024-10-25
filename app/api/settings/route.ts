import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const settingsPath = path.join(process.cwd(), 'data', 'settings.json')
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'))
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const settingsPath = path.join(process.cwd(), 'data', 'settings.json')
    
    const settings = {
      refreshInterval: body.refreshInterval
    }
    
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2))
    
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
