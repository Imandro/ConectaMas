"use client";

import Link from 'next/link';
import { X, UserPlus, Info } from 'lucide-react';
import { useState } from 'react';

export default function GuestBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-warning-subtle border-bottom border-warning px-3 py-2" style={{ fontSize: '0.85rem' }}>
      <div className="d-flex align-items-center justify-content-between gap-2 mx-auto" style={{ maxWidth: '1200px' }}>
        <div className="d-flex align-items-center gap-2">
          <Info size={16} className="text-warning flex-shrink-0" />
          <span className="text-dark">
            Estás navegando como <strong>invitado</strong>. Tu progreso no se guardará al cerrar el navegador.
          </span>
        </div>
        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          <Link
            href="/auth/register"
            className="btn btn-warning btn-sm fw-bold rounded-pill text-dark d-flex align-items-center gap-1"
            style={{ fontSize: '0.75rem' }}
          >
            <UserPlus size={14} />
            Crear cuenta
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="btn btn-link text-muted p-0 border-0"
            style={{ textDecoration: 'none' }}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
