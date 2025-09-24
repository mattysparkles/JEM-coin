'use client';
import React, { useState } from 'react';

export default function ValidatorsPage(){
  const [form, setForm] = useState({name:'',email:'',org:'',infra:[],region:'',tz:'',github:'',twitter:'',motivation:''});
  const [status, setStatus] = useState('');
  function setField(k:any,v:any){ setForm({...form,[k]:v}); }
  async function submit(e:React.FormEvent){ e.preventDefault(); setStatus(''); const res=await fetch('/api/apply',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); const j=await res.json(); if(j?.ok) setStatus('submitted'); else setStatus('error'); }
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Apply as a Validator</h1>
      <p className="text-gray-700 mb-4">We’re selecting an initial cohort of validators to help bootstrap the network. Successful applicants will run nodes, participate in finality committees, and help test PoE mechanics. Tell us about your infra, region, and motivation.</p>
      {status==='submitted' ? <div className="p-4 bg-green-50">Thanks — we received your application.</div> : (
      <form onSubmit={submit} className="space-y-4">
        <label className="block"><div className="text-sm">Name</div><input value={form.name} onChange={e=>setField('name',e.target.value)} className="w-full border px-3 py-2 rounded"/></label>
        <label className="block"><div className="text-sm">Email</div><input type="email" value={form.email} onChange={e=>setField('email',e.target.value)} className="w-full border px-3 py-2 rounded"/></label>
        <label className="block"><div className="text-sm">Org or Solo</div><input value={form.org} onChange={e=>setField('org',e.target.value)} className="w-full border px-3 py-2 rounded"/></label>
        <label className="block"><div className="text-sm">Infra Profile (e.g., k8s, bare metal, VPS, edge)</div><input value={Array.isArray(form.infra)?form.infra.join(','):form.infra} onChange={e=>setField('infra',e.target.value.split(','))} className="w-full border px-3 py-2 rounded"/></label>
        <label className="block"><div className="text-sm">Region / Timezone</div><input value={form.region} onChange={e=>setField('region',e.target.value)} className="w-full border px-3 py-2 rounded"/></label>
        <label className="block"><div className="text-sm">GitHub</div><input value={form.github} onChange={e=>setField('github',e.target.value)} className="w-full border px-3 py-2 rounded"/></label>
        <label className="block"><div className="text-sm">Twitter</div><input value={form.twitter} onChange={e=>setField('twitter',e.target.value)} className="w-full border px-3 py-2 rounded"/></label>
        <label className="block"><div className="text-sm">Motivation / Availability</div><textarea placeholder="Why do you want to run a validator? Typical uptime, maintenance window, contactability." value={form.motivation} onChange={e=>setField('motivation',e.target.value)} className="w-full border px-3 py-2 rounded"/></label>
        <div><button className="px-4 py-2 bg-blue-600 text-white rounded">Apply</button></div>
      </form>)}
    </main>
  );
}
