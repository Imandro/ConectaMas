"use client";

import { Analytics } from '@vercel/analytics/next';
import { useEffect, useState } from 'react';
import { getAnalyticsConsent } from '@/app/lib/privacy-consent';

export default function AnalyticsConsentGate() {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const sync = () => setAllowed(getAnalyticsConsent() === 'accepted');
    sync(); window.addEventListener('conecta-privacy-consent', sync);
    return () => window.removeEventListener('conecta-privacy-consent', sync);
  }, []);
  return allowed ? <Analytics /> : null;
}
