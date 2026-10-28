"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SUPPORTED_COUNTRY_OPTIONS } from '@/app/lib/legal/policy';
import { useLanguage } from '@/app/LanguageContext';

export default function LegalAcceptPage() {
  const { t } = useLanguage();
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');
  const [locale, setLocale] = useState<'es' | 'en' | 'pt'>('es');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/legal/status').then((response) => response.json()).then((data) => {
      if (data.age) setAge(String(data.age));
      if (data.country) setCountry(data.country);
      if (['es', 'en', 'pt'].includes(data.locale)) setLocale(data.locale);
    }).catch(() => undefined);
  }, []);

  async function accept(event: React.FormEvent) {
    event.preventDefault();
    if (!navigator.onLine) { setError(t.legal_accept.offline); return; }
    setLoading(true); setError('');
    const response = await fetch('/api/legal/consent', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ age, country, locale }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setError(data.message || t.legal_accept.error); setLoading(false); return; }
    window.location.href = '/dashboard';
  }

  return <main className="min-vh-100 bg-light py-5"><div className="container" style={{ maxWidth: 640 }}>
    <div className="ui-surface p-4 p-md-5">
      <h1 className="h3 fw-bold mb-3">{t.legal_accept.title}</h1>
      <p className="text-muted">{t.legal_accept.intro}</p>
      <p><Link href="/legal/terms">{t.legal_accept.terms}</Link> · <Link href="/legal/privacy">{t.legal_accept.privacy}</Link> · <Link href="/legal/community">{t.legal_accept.community}</Link> · <Link href="/legal/refunds">{t.legal_accept.refunds}</Link> · <Link href="/legal/age">{t.legal_accept.age}</Link></p>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={accept}>
        <label className="form-label">{t.legal_accept.age}<input className="form-control" type="number" min="13" max="120" value={age} onChange={(event) => setAge(event.target.value)} required /></label>
        <label className="form-label mt-3">{t.legal_accept.country}<select className="form-select" value={country} onChange={(event) => setCountry(event.target.value)} required><option value="">{t.legal_accept.country_placeholder}</option>{SUPPORTED_COUNTRY_OPTIONS.map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></label>
        <label className="form-label mt-3">{t.legal_accept.language}<select className="form-select" value={locale} onChange={(event) => setLocale(event.target.value as typeof locale)}><option value="es">Español</option><option value="en">English</option><option value="pt">Português</option></select></label>
        <button className="btn btn-primary w-100 mt-4" disabled={loading}>{loading ? t.legal_accept.saving : t.legal_accept.submit}</button>
      </form>
    </div>
  </div></main>;
}
