import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const rateMap = new Map<string, number>();
const WINDOW = 60; // seconds

function ensureDataDir(){
  const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data');
  if(!fs.existsSync(dataDir)) fs.mkdirSync(dataDir,{recursive:true});
  return dataDir;
}

export async function POST(req: Request){
  try{
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0] || 'cli';
    const now = Math.floor(Date.now()/1000);
    const key = ip+':apply';
    const last = rateMap.get(key) || 0;
    if(now - last < WINDOW) return NextResponse.json({ok:false,error:'rate_limited'}, {status:429});
    rateMap.set(key, now);
    const body = await req.json();
    if(body.website) return NextResponse.json({ok:false,error:'spam'}, {status:400});
    const record = {...body, ts: new Date().toISOString(), ip};
    const dataDir = ensureDataDir();
    fs.appendFileSync(path.join(dataDir,'validators.ndjson'), JSON.stringify(record)+'\n');
    return NextResponse.json({ok:true});
  }catch(err:any){
    return NextResponse.json({ok:false,error:err.message||String(err)}, {status:500});
  }
}
