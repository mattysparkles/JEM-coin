'use client';

import { useEffect, useState } from 'react';
import { revokeConsent } from '@/components/ConsentBanner';

export default function PrivacyPage() {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    setConsent(localStorage.getItem('jems-consent') === 'true');
  }, []);

  return (
    <main className="prose p-4" id="main">
      <h1>Privacy</h1>
      <p>This site uses a simple tracker to understand usage. No personal data is stored.</p>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => {
            if (e.target.checked) {
              localStorage.setItem('jems-consent', 'true');
              location.reload();
            } else {
              revokeConsent();
              setConsent(false);
            }
          }}
        />
        Allow tracking
      </label>
    </main>
  );
}
