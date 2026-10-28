"use client";

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import {
    DESIGN_VARIANT_EVENT,
    DESIGN_VARIANT_STORAGE_KEY,
    setDesignVariant,
} from './DesignVariantProvider';
import { DESIGN_VARIANTS, resolveDesignVariant, type DesignVariant } from '@/app/lib/designVariants';

const VARIANT_COPY: Record<DesignVariant, { label: string; description: string }> = {
    calma: { label: 'Calma', description: 'Cálida y contemplativa' },
    comunidad: { label: 'Comunidad', description: 'Clara y participativa' },
    fuego: { label: 'Fuego', description: 'Profunda y energética' },
};

export default function DesignVariantSwitcher({ initialVariant }: { initialVariant?: DesignVariant }) {
    const [selected, setSelected] = useState<DesignVariant>(initialVariant || 'calma');

    useEffect(() => {
        const queryVariant = new URLSearchParams(window.location.search).get('design');
        const savedVariant = window.localStorage.getItem(DESIGN_VARIANT_STORAGE_KEY);
        setSelected(initialVariant || resolveDesignVariant(queryVariant || savedVariant || document.documentElement.dataset.design));
        const handleChange = (event: Event) => {
            setSelected(resolveDesignVariant((event as CustomEvent<DesignVariant>).detail));
        };
        window.addEventListener(DESIGN_VARIANT_EVENT, handleChange);
        return () => window.removeEventListener(DESIGN_VARIANT_EVENT, handleChange);
    }, [initialVariant]);

    return (
        <div className="design-switcher" aria-label="Elegir versión visual">
            {DESIGN_VARIANTS.map((variant) => {
                const copy = VARIANT_COPY[variant];
                const isSelected = selected === variant;
                return (
                    <button
                        key={variant}
                        type="button"
                        className={`design-switcher-option ${isSelected ? 'is-selected' : ''}`}
                        aria-pressed={isSelected}
                        onClick={() => setDesignVariant(variant)}
                    >
                        <span className="design-switcher-dot" aria-hidden="true" />
                        <span className="text-start">
                            <span className="d-block fw-bold">{copy.label}</span>
                            <span className="d-block small text-muted">{copy.description}</span>
                        </span>
                        {isSelected && <Check size={18} aria-hidden="true" />}
                    </button>
                );
            })}
        </div>
    );
}
