export const DESIGN_VARIANTS = ['calma', 'comunidad', 'fuego'] as const;

export type DesignVariant = typeof DESIGN_VARIANTS[number];

export const DEFAULT_DESIGN_VARIANT: DesignVariant = 'fuego';

export function resolveDesignVariant(value: string | null | undefined): DesignVariant {
    return DESIGN_VARIANTS.includes(value as DesignVariant)
        ? value as DesignVariant
        : DEFAULT_DESIGN_VARIANT;
}
