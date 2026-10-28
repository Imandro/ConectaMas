"use client";

import Link from 'next/link';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { clearClientPrivateData } from '@/app/lib/privacy-consent';

export default function PublicAccountDeletePage() {
  const { status } = useSession();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  async function remove() {
    if (!confirm('Esta acción borra permanentemente tu cuenta y contenido. ¿Continuar?')) return;
    setLoading(true); setMessage('');
    const response = await fetch('/api/account/delete', { method: 'POST' });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setMessage(data.message || 'No se pudo borrar la cuenta.'); setLoading(false); return; }
    await clearClientPrivateData(); await signOut({ redirect: false }); window.location.href = '/';
  }
  return <main className="min-vh-100 bg-light py-5"><div className="container" style={{ maxWidth: 640 }}><div className="ui-surface p-4 p-md-5">
    <h1 className="h3 fw-bold">Borrar cuenta</h1><p className="text-muted">La solicitud elimina datos de cuenta, contenido, progreso y relaciones. Los registros mínimos de pago pueden conservarse sin identificador directo.</p>
    {message && <div className="alert alert-warning">{message}</div>}
    {status === 'authenticated' ? <><button className="btn btn-danger w-100" onClick={remove} disabled={loading}>{loading ? 'Borrando…' : 'Borrar mi cuenta'}</button><a className="btn btn-link w-100 mt-2" href="/api/account/export">Exportar mis datos</a></> : <Link href="/auth/login?callbackUrl=/account/delete" className="btn btn-primary w-100">Iniciar sesión para continuar</Link>}
    <p className="small text-muted mt-4 mb-0">Ayuda: <a href="mailto:marioalejandroruiz28@gmail.com">marioalejandroruiz@gmail.com</a></p>
  </div></div></main>;
}
