'use client';

import { useEffect, useState } from 'react';
import { isAdPlacementAllowed, type AdPlacement, type PublicAdsConfig } from '@/app/lib/ads/config';
import { isCapacitorRuntime } from '@/app/lib/runtime';

type Props = { placement: AdPlacement };

const BLOCKED_PATHS = ['/dashboard/bible', '/dashboard/sos', '/dashboard/checkin', '/dashboard/prayer', '/dashboard/community', '/dashboard/forums', '/dashboard/groups', '/dashboard/diary', '/dashboard/payments', '/dashboard/support', '/dashboard/premium', '/dashboard/chat', '/dashboard/qa'];

function MonetagSlot({ src, zoneId }: { src: string; zoneId: string }) {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.dataset.zone = zoneId;
        script.dataset.cfasync = 'false';
        script.dataset.conectaMonetag = 'true';
        document.head.appendChild(script);
        return () => {
            script.remove();
            document.querySelectorAll('[data-conecta-monetag-ad]').forEach((element) => element.remove());
        };
    }, [src, zoneId]);

    return <>
        <div className="small text-muted text-center mb-1">Publicidad</div>
        <div
            className="conecta-monetag-slot"
            data-conecta-monetag-ad="true"
            data-zone={zoneId}
            aria-label="Publicidad"
        />
    </>;
}

function isSensitivePath() {
    return typeof window !== 'undefined' && BLOCKED_PATHS.some((path) => window.location.pathname === path || window.location.pathname.startsWith(`${path}/`));
}

export default function AdBanner({ placement }: Props) {
    const [config, setConfig] = useState<PublicAdsConfig | null>(null);
    const [premium, setPremium] = useState(false);
    const [duplicate, setDuplicate] = useState(false);

    useEffect(() => {
        if (!isAdPlacementAllowed(placement) || isCapacitorRuntime() || isSensitivePath()) return;
        if (document.querySelector('[data-conecta-ad-banner="true"]')) {
            setDuplicate(true);
            return;
        }

        let active = true;
        Promise.all([
            fetch('/api/ads/config', { cache: 'no-store' }).then((response) => response.json() as Promise<PublicAdsConfig>),
            fetch('/api/billing/me', { cache: 'no-store' }).then((response) => response.ok ? response.json() : null).catch(() => null),
        ]).then(([adsConfig, billing]) => {
            if (!active) return;
            setConfig(adsConfig);
            setPremium(Boolean(billing?.entitlement?.active));
        }).catch(() => undefined);

        return () => { active = false; };
    }, [placement]);

    if (duplicate || premium || !config?.enabled || !isAdPlacementAllowed(placement)) return null;
    if (config.provider === 'sponsor' && config.sponsor) {
        return <aside className="ad-banner sponsor-ad my-4" data-conecta-ad-banner="true" aria-label="Contenido patrocinado">
            <div className="card border-0 shadow-sm overflow-hidden">
                <div className="card-body p-3 p-md-4 d-flex flex-column flex-md-row align-items-md-center gap-3">
                    <div className="flex-grow-1">
                        <div className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>{config.sponsor.label} · {config.sponsor.category}</div>
                        <h2 className="h5 fw-bold text-secondary mb-1 mt-2">{config.sponsor.name}</h2>
                        <p className="small text-muted mb-0">{config.sponsor.tagline}</p>
                    </div>
                    <a href={config.sponsor.url} className="btn btn-outline-primary rounded-pill px-4" target="_blank" rel="sponsored noopener noreferrer">
                        {config.sponsor.cta}
                    </a>
                </div>
            </div>
        </aside>;
    }

    if (config.provider === 'monetag' && config.monetag) {
        return <aside className="ad-banner monetag-ad my-4" data-conecta-ad-banner="true" aria-label="Publicidad">
            <MonetagSlot src={config.monetag.tagSrc} zoneId={config.monetag.zoneId} />
        </aside>;
    }

    return null;
}
