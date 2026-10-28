export const GLASS_INTENSITIES = ['subtle', 'balanced', 'rich'] as const;

export type GlassIntensity = typeof GLASS_INTENSITIES[number];

export const DEFAULT_GLASS_INTENSITY: GlassIntensity = 'balanced';

export function resolveGlassIntensity(value: string | null | undefined): GlassIntensity {
    return GLASS_INTENSITIES.includes(value as GlassIntensity)
        ? value as GlassIntensity
        : DEFAULT_GLASS_INTENSITY;
}
