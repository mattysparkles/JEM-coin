'use client';

import { useEffect, useState } from 'react';

const CONSENT_KEY = 'jems-consent';

function loadTracker() {
  if (document.getElementById('jems-tracker')) return;
  const s = document.createElement('script');
  s.src = '/jems.track.js';
  s.id = 'jems-tracker';
  s.defer = true;
  document.body.appendChild(s);
}

export function revokeConsent() {
  localStorage.removeItem(CONSENT_KEY);
  const el = document.getElementById('jems-tracker');
  if (el) el.remove();
}

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === 'true') {
      loadTracker();
    } else {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 bg-gray-800 text-white p-4 flex items-center justify-center gap-4">
      <span>This site uses a tracker. Accept?</span>
      <button
        className="px-4 py-2 bg-blue-600 rounded"
        onClick={() => {
          localStorage.setItem(CONSENT_KEY, 'true');
          loadTracker();
          setVisible(false);
        }}
      >
        Accept
      </button>
    </div>
  );
}
