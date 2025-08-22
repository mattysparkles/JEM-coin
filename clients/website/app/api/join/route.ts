import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const RATE_LIMIT_MS = 60_000
const lastSeen = new Map<string, number>()

function getIp(req: Request) {
  const hf = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
  return hf ? hf.split(',')[0].trim() : 'unknown'
}

function ensureDataDir() {
  const dir = process.env.DATA_DIR || './data'
  const resolved = path.resolve(process.cwd(), dir)
  fs.mkdirSync(resolved, { recursive: true })
  return resolved
}

export async function POST(req: Request) {
  const ip = getIp(req)
  const key = `join:${ip}`
  const now = Date.now()
  const last = lastSeen.get(key) || 0
  if (now - last < RATE_LIMIT_MS) {
    return NextResponse.json({ error: 'Rate limit' }, { status: 429 })
  }
  lastSeen.set(key, now)

  const form = await req.formData()
  const website = (form.get('website') as string) || ''
  if (website) return NextResponse.json({ error: 'spam' }, { status: 400 })

  const name = (form.get('name') as string) || ''
  const email = (form.get('email') as string) || ''
  const interest = (form.get('interest') as string) || ''
  const notes = (form.get('notes') as string) || ''

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400 })
  }

  const dir = ensureDataDir()
  const out = {
    ts: new Date().toISOString(),
    ip,
    name,
    email,
    interest,
    notes,
  }
  const file = path.join(dir, 'waitlist.ndjson')
  fs.appendFileSync(file, JSON.stringify(out) + '\n')
  return NextResponse.json({ ok: true })
}

