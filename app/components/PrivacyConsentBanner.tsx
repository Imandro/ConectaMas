"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAnalyticsConsent, setAnalyticsConsent, type AnalyticsConsent } from '@/app/lib/privacy-consent';

export default function PrivacyConsentBanner() {
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);
  useEffect(() => setConsent(getAnalyticsConsent()), []);
  if (consent) return null;
  const choose = (value: AnalyticsConsent) => { setAnalyticsConsent(value); setConsent(value); window.dispatchEvent(new Event('conecta-privacy-consent')); };
  return <aside className="privacy-consent-banner position-fixed bottom-0 start-0 end-0 p-3" style={{ zIndex: 10000 }}><div className="ui-surface shadow-lg p-3 d-flex flex-column flex-md-row align-items-md-center gap-3">
    <p className="small text-muted mb-0 flex-grow-1">Usamos almacenamiento necesario y analítica opcional. <Link href="/legal/cookies">Ver preferencias</Link>.</p>
    <div className="d-flex gap-2"><button className="btn btn-outline-secondary btn-sm" onClick={() => choose('declined')}>Rechazar analítica</button><button className="btn btn-primary btn-sm" onClick={() => choose('accepted')}>Aceptar analítica</button></div>
  </div></aside>;
}
