import { NextResponse } from 'next/server'
import { URL } from 'url'

const RPC_INTERNAL = process.env.RPC_INTERNAL_URL || process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:7070'

function isAllowedHost(u: URL) {
  const h = u.hostname
  return (
    h === 'localhost' ||
    h === '127.0.0.1' ||
    h === '::1' ||
    h.startsWith('10.') ||
    h.startsWith('192.168.') ||
    h.startsWith('172.')
  )
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const path = url.pathname.replace('/api/rpc-proxy', '') || '/'
    const target = new URL(RPC_INTERNAL)
    if (!isAllowedHost(target)) return NextResponse.json({ ok: false, error: 'Forbidden target' }, { status: 403 })
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2000)
    try {
      const res = await fetch(target.toString().replace(/\/$/, '') + path, { signal: controller.signal })
      const text = await res.text()
      return new NextResponse(text, { status: res.status, headers: { 'content-type': res.headers.get('content-type') || 'application/json' } })
    } finally {
      clearTimeout(timeout)
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || 'request failed' })
  }
}

