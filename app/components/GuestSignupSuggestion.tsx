"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, UserPlus, Cloud, Trophy, Shield, MessageCircle } from 'lucide-react';
import { canShowSuggestion } from '@/app/lib/guest';

export default function GuestSignupSuggestion() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (canShowSuggestion()) {
      const timer = setTimeout(() => setVisible(true), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!visible || dismissed) return null;

  return (
    <div className="position-fixed bottom-0 start-0 w-100 p-3" style={{ zIndex: 9999, pointerEvents: 'none' }}>
      <div
        className="card border-0 shadow-lg mx-auto animate-slide-in-up"
        style={{
          maxWidth: '400px', borderRadius: '20px', pointerEvents: 'auto',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div className="card-body p-3 text-white">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="d-flex align-items-center gap-2">
              <UserPlus size={20} />
              <h6 className="fw-bold m-0">¿Quieres guardar tu progreso?</h6>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="btn btn-link text-white p-0 border-0"
              style={{ opacity: 0.7, textDecoration: 'none' }}
            >
              <X size={18} />
            </button>
          </div>
          <p className="small mb-2" style={{ opacity: 0.9 }}>
            Crea una cuenta gratuita y no pierdas tus avances:
          </p>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <span className="badge bg-white text-dark rounded-pill d-flex align-items-center gap-1 px-2 py-1">
              <Cloud size={12} /> Progreso en la nube
            </span>
            <span className="badge bg-white text-dark rounded-pill d-flex align-items-center gap-1 px-2 py-1">
              <Trophy size={12} /> Ligas y logros
            </span>
            <span className="badge bg-white text-dark rounded-pill d-flex align-items-center gap-1 px-2 py-1">
              <Shield size={12} /> Acceso a SOS
            </span>
            <span className="badge bg-white text-dark rounded-pill d-flex align-items-center gap-1 px-2 py-1">
              <MessageCircle size={12} /> Foro comunitario
            </span>
          </div>
          <div className="d-flex gap-2">
            <Link
              href="/auth/register"
              className="btn btn-light btn-sm fw-bold rounded-pill w-100 text-primary"
              onClick={() => setDismissed(true)}
            >
              Crear cuenta gratis
            </Link>
            <button
              onClick={() => setDismissed(true)}
              className="btn btn-outline-light btn-sm rounded-pill"
              style={{ opacity: 0.8 }}
            >
              Ahora no
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
