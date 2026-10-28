"use client";

import { useEffect, useState } from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';
import {
    DESIGN_MODE_EVENT,
    DESIGN_MODE_STORAGE_KEY,
    GLASS_INTENSITY_EVENT,
    GLASS_INTENSITY_STORAGE_KEY,
    setDesignMode,
    setGlassIntensity,
} from './DesignVariantProvider';
import { DEFAULT_DESIGN_MODE, resolveDesignMode, type DesignMode } from '@/app/lib/designModes';
import { DEFAULT_GLASS_INTENSITY, GLASS_INTENSITIES, resolveGlassIntensity, type GlassIntensity } from '@/app/lib/glassModes';

export function useDesignMode(initialMode?: DesignMode) {
    const [mode, setMode] = useState<DesignMode>(initialMode || DEFAULT_DESIGN_MODE);

    useEffect(() => {
        const queryMode = new URLSearchParams(window.location.search).get('mode');
        const savedMode = window.localStorage.getItem(DESIGN_MODE_STORAGE_KEY);
        setMode(initialMode || resolveDesignMode(queryMode || savedMode || document.documentElement.dataset.mode));

        const handleChange = (event: Event) => {
            setMode(resolveDesignMode((event as CustomEvent<DesignMode>).detail));
        };
        window.addEventListener(DESIGN_MODE_EVENT, handleChange);
        return () => window.removeEventListener(DESIGN_MODE_EVENT, handleChange);
    }, [initialMode]);

    return mode;
}

export function useGlassIntensity(initialIntensity?: GlassIntensity) {
    const [intensity, setIntensity] = useState<GlassIntensity>(initialIntensity || DEFAULT_GLASS_INTENSITY);

    useEffect(() => {
        const queryIntensity = new URLSearchParams(window.location.search).get('glass');
        let savedIntensity: string | null = null;
        try {
            savedIntensity = window.localStorage.getItem(GLASS_INTENSITY_STORAGE_KEY);
        } catch {
            // Use the document value when browser storage is unavailable.
        }
        setIntensity(initialIntensity || resolveGlassIntensity(queryIntensity || savedIntensity || document.documentElement.dataset.glass));

        const handleChange = (event: Event) => {
            setIntensity(resolveGlassIntensity((event as CustomEvent<GlassIntensity>).detail));
        };
        window.addEventListener(GLASS_INTENSITY_EVENT, handleChange);
        return () => window.removeEventListener(GLASS_INTENSITY_EVENT, handleChange);
    }, [initialIntensity]);

    return intensity;
}

export default function DesignModeSwitcher({ initialMode }: { initialMode?: DesignMode }) {
    const mode = useDesignMode(initialMode);

    return (
        <div className="design-mode-switcher" aria-label="Elegir modo de Fuego">
            {([
                ['dark', 'Oscuro', Moon],
                ['light', 'Claro', Sun],
            ] as const).map(([value, label, Icon]) => (
                <button
                    key={value}
                    type="button"
                    className={`design-mode-option ${mode === value ? 'is-selected' : ''}`}
                    aria-pressed={mode === value}
                    onClick={() => setDesignMode(value)}
                >
                    <Icon size={16} aria-hidden="true" />
                    {label}
                </button>
            ))}
        </div>
    );
}

export function DashboardModeToggle() {
    const mode = useDesignMode();
    const nextMode: DesignMode = mode === 'dark' ? 'light' : 'dark';
    const Icon = nextMode === 'dark' ? Moon : Sun;

    return (
        <button
            type="button"
            className="dashboard-mode-toggle"
            aria-label={`Cambiar a modo ${nextMode === 'dark' ? 'oscuro' : 'claro'}`}
            onClick={() => setDesignMode(nextMode)}
        >
            <Icon size={18} aria-hidden="true" />
            <span>Modo {nextMode === 'dark' ? 'oscuro' : 'claro'}</span>
        </button>
    );
}

const GLASS_LABELS: Record<GlassIntensity, string> = {
    subtle: 'Sutil',
    balanced: 'Equilibrado',
    rich: 'Intenso',
};

export function GlassIntensitySwitcher() {
    const intensity = useGlassIntensity();

    return (
        <div className="glass-intensity-switcher" role="group" aria-label="Intensidad del efecto Liquid Glass">
            <div className="glass-intensity-heading">
                <Sparkles size={16} aria-hidden="true" />
                <span>Liquid Glass</span>
            </div>
            <div className="glass-intensity-options">
                {GLASS_INTENSITIES.map((value) => (
                    <button
                        key={value}
                        type="button"
                        className={`glass-intensity-option ${intensity === value ? 'is-selected' : ''}`}
                        aria-pressed={intensity === value}
                        onClick={() => setGlassIntensity(value)}
                    >
                        {GLASS_LABELS[value]}
                    </button>
                ))}
            </div>
        </div>
    );
}
