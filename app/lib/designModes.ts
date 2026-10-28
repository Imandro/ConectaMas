export const DESIGN_MODES = ['light', 'dark'] as const;

export type DesignMode = typeof DESIGN_MODES[number];

export const DEFAULT_DESIGN_MODE: DesignMode = 'light';

export function resolveDesignMode(value: string | null | undefined): DesignMode {
    return DESIGN_MODES.includes(value as DesignMode)
        ? value as DesignMode
        : DEFAULT_DESIGN_MODE;
}
