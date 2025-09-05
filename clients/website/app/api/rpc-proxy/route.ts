import { NextResponse } from 'next/server';

export async function GET(){
  const target = process.env.RPC_INTERNAL_URL || process.env.NEXT_PUBLIC_RPC_URL || null;
  if(!target) return NextResponse.json({ok:false,error:'no_rpc_configured'});
  try{
    const controller = new AbortController();
    const id = setTimeout(()=>controller.abort(), 2000);
    const res = await fetch(target, {signal: controller.signal});
    clearTimeout(id);
    const text = await res.text();
    return new NextResponse(text, {status: res.status, headers: {'content-type': res.headers.get('content-type')||'text/plain'}});
  }catch(err:any){
    return NextResponse.json({ok:false,error:err.message||String(err)});
  }
}
