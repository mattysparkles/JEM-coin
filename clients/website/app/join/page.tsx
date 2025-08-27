'use client';
import React, { useState } from 'react';

export default function JoinPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('builder');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, interest }),
    });
    const j = await res.json();
    if (j?.ok) setSubmitted(true);
    else setError(j?.error || 'Failed');
  }

  if (submitted) return <div className="p-6 max-w-2xl mx-auto">Thanks! We received your submission.</div>;

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Join the Waitlist</h1>
      <p className="text-gray-700 mb-4">Sign up to follow development, try early builds, and receive updates about token distributions and community events. Pick an interest so we can match you to the right early programs.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <div className="text-sm">Name</div>
          <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </label>
        <label className="block">
          <div className="text-sm">Email</div>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </label>
        <label className="block">
          <div className="text-sm">Interest</div>
          <select value={interest} onChange={(e)=>setInterest(e.target.value)} className="w-full border px-3 py-2 rounded">
            <option value="builder">Builder — building apps & integrations</option>
            <option value="validator">Validator — infra & node operators</option>
            <option value="user">User — early testers and community</option>
            <option value="other">Other — contributor, researcher, press</option>
          </select>
        </label>
        <div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Join</button>
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </div>
      </form>
    </main>
  );
}
