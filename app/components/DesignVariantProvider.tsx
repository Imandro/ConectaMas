"use client";

import { useLayoutEffect } from 'react';
import { DEFAULT_DESIGN_VARIANT, resolveDesignVariant, type DesignVariant } from '@/app/lib/designVariants';
import { DEFAULT_DESIGN_MODE, resolveDesignMode, type DesignMode } from '@/app/lib/designModes';
import { DEFAULT_GLASS_INTENSITY, resolveGlassIntensity, type GlassIntensity } from '@/app/lib/glassModes';

export const DESIGN_VARIANT_STORAGE_KEY = 'conectaplus_design_variant';
export const DESIGN_VARIANT_EVENT = 'conectaplus-design-variant';
export const DESIGN_MODE_STORAGE_KEY = 'conectaplus_design_mode';
export const DESIGN_MODE_EVENT = 'conectaplus-design-mode';
export const GLASS_INTENSITY_STORAGE_KEY = 'conectaplus_glass_intensity';
export const GLASS_INTENSITY_EVENT = 'conectaplus-glass-intensity';

function setBrowserThemeColor(mode: DesignMode) {
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute(
        'content',
        mode === 'dark' ? '#0B1B32' : '#F7F8FA',
    );
}

export function setDesignVariant(variant: DesignVariant) {
    const root = document.documentElement;
    root.classList.add('design-theme-switching');
    root.dataset.design = variant;
    window.localStorage.setItem(DESIGN_VARIANT_STORAGE_KEY, variant);
    window.dispatchEvent(new CustomEvent<DesignVariant>(DESIGN_VARIANT_EVENT, { detail: variant }));
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('design-theme-switching')));
}

export function setDesignMode(mode: DesignMode) {
    const root = document.documentElement;
    root.classList.add('design-theme-switching');
    root.dataset.mode = mode;
    setBrowserThemeColor(mode);
    window.localStorage.setItem(DESIGN_MODE_STORAGE_KEY, mode);
    window.dispatchEvent(new CustomEvent<DesignMode>(DESIGN_MODE_EVENT, { detail: mode }));
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('design-theme-switching')));
}

export function setGlassIntensity(intensity: GlassIntensity) {
    const root = document.documentElement;
    root.dataset.glass = intensity;
    try {
        window.localStorage.setItem(GLASS_INTENSITY_STORAGE_KEY, intensity);
    } catch {
        // Continue with the current session when browser storage is unavailable.
    }
    window.dispatchEvent(new CustomEvent<GlassIntensity>(GLASS_INTENSITY_EVENT, { detail: intensity }));
}

export default function DesignVariantProvider({ children }: { children: React.ReactNode }) {
    useLayoutEffect(() => {
        const queryVariant = new URLSearchParams(window.location.search).get('design');
        const savedVariant = window.localStorage.getItem(DESIGN_VARIANT_STORAGE_KEY);
        const variant = resolveDesignVariant(queryVariant || savedVariant || DEFAULT_DESIGN_VARIANT);
        const queryMode = new URLSearchParams(window.location.search).get('mode');
        const savedMode = window.localStorage.getItem(DESIGN_MODE_STORAGE_KEY);
        const mode = resolveDesignMode(queryMode || savedMode || DEFAULT_DESIGN_MODE);
        const queryGlass = new URLSearchParams(window.location.search).get('glass');
        let savedGlass: string | null = null;
        try {
            savedGlass = window.localStorage.getItem(GLASS_INTENSITY_STORAGE_KEY);
        } catch {
            // Use the default when browser storage is unavailable.
        }
        const glass = resolveGlassIntensity(queryGlass || savedGlass || DEFAULT_GLASS_INTENSITY);

        document.documentElement.dataset.design = variant;
        document.documentElement.dataset.mode = mode;
        document.documentElement.dataset.glass = glass;
        setBrowserThemeColor(mode);
        window.localStorage.setItem(DESIGN_VARIANT_STORAGE_KEY, variant);
        window.localStorage.setItem(DESIGN_MODE_STORAGE_KEY, mode);
        try {
            window.localStorage.setItem(GLASS_INTENSITY_STORAGE_KEY, glass);
        } catch {
            // Keep the selected mode in the current document only.
        }
    }, []);

    return children;
}
