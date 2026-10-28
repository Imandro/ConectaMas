"use client";

import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const EXEMPT_PREFIXES = ['/legal', '/account/delete', '/auth', '/dashboard/support'];

export default function LegalConsentGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { status } = useSession();
  const [allowed, setAllowed] = useState(true);
  const [checking, setChecking] = useState(false);
  const exempt = EXEMPT_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  useEffect(() => {
    if (status !== 'authenticated' || exempt) { setAllowed(true); return; }
    setChecking(true);
    fetch('/api/legal/status', { cache: 'no-store' }).then((response) => response.json()).then((data) => {
      setAllowed(Boolean(data.allowed));
    }).catch(() => setAllowed(false)).finally(() => setChecking(false));
  }, [exempt, pathname, status]);

  if (status !== 'authenticated' || exempt || allowed) return <>{children}</>;
  if (checking) return <div className="min-vh-100 d-flex align-items-center justify-content-center">Verificando documentos legales…</div>;
  return <main className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-4"><div className="ui-surface p-4 text-center" style={{ maxWidth: 520 }}>
    <h1 className="h4 fw-bold">Acepta los documentos vigentes</h1>
    <p className="text-muted">Debes actualizar tu consentimiento antes de usar las funciones de la cuenta.</p>
    <a className="btn btn-primary w-100 mb-2" href="/legal/accept">Revisar documentos</a>
    <button className="btn btn-outline-secondary w-100" onClick={() => signOut({ callbackUrl: '/auth/login' })}>Cerrar sesión</button>
  </div></main>;
}
