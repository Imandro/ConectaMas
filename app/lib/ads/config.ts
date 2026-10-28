export type AdsProvider = 'off' | 'sponsor' | 'monetag';
export type AdPlacement = 'dashboard' | 'games';

type SponsorConfig = {
    name: string;
    tagline: string;
    url: string;
    cta: string;
    category: string;
    label: 'Patrocinado';
};

type MonetagConfig = {
    tagSrc: string;
    zoneId: string;
    format: 'in_page_push_banner';
};

export type PublicAdsConfig = {
    enabled: boolean;
    provider: AdsProvider;
    sponsor?: SponsorConfig;
    monetag?: MonetagConfig;
};

const ALLOWED_PLACEMENTS = new Set<AdPlacement>(['dashboard', 'games']);
const BLOCKED_SPONSOR_CONTENT = /apuesta|casino|alcohol|cita|dating|sexo|sexual|droga|astrolog|hazte rico|dinero fácil|política|sensacional/i;

export function isAdPlacementAllowed(placement: string): placement is AdPlacement {
    return ALLOWED_PLACEMENTS.has(placement as AdPlacement);
}

function providerFromEnv(value: string | undefined): AdsProvider {
    if (value === 'monetag' || value === 'sponsor' || value === 'off') return value;
    return 'off';
}

function httpsUrl(value: string | undefined) {
    if (!value) return null;
    try {
        const url = new URL(value);
        return url.protocol === 'https:' ? url.toString() : null;
    } catch {
        return null;
    }
}

function monetagTag(value: string | undefined, zoneId: string | undefined) {
    if (!value || !zoneId || !/^\d{4,12}$/.test(zoneId)) return null;
    try {
        const url = new URL(value);
        if (url.protocol !== 'https:' || !/\/tag\.min\.js$/.test(url.pathname)) return null;
        return { tagSrc: url.toString(), zoneId };
    } catch {
        return null;
    }
}

export function getPublicAdsConfig(): PublicAdsConfig {
    const provider = providerFromEnv(process.env.ADS_PROVIDER);

    if (provider === 'sponsor') {
        const url = httpsUrl(process.env.NEXT_PUBLIC_SPONSOR_URL);
        const name = process.env.NEXT_PUBLIC_SPONSOR_NAME?.trim();
        const tagline = process.env.NEXT_PUBLIC_SPONSOR_TAGLINE?.trim();
        const cta = process.env.NEXT_PUBLIC_SPONSOR_CTA?.trim();
        const category = process.env.NEXT_PUBLIC_SPONSOR_CATEGORY?.trim();
        const copy = `${name ?? ''} ${tagline ?? ''} ${category ?? ''}`;
        if (process.env.SPONSOR_APPROVED === 'true' && url && name && tagline && cta && category && !BLOCKED_SPONSOR_CONTENT.test(copy)) {
            return {
                enabled: true,
                provider,
                sponsor: { name, tagline, url, cta, category, label: 'Patrocinado' },
            };
        }
        return { enabled: false, provider };
    }

    if (provider === 'monetag') {
        const tag = monetagTag(process.env.MONETAG_TAG_SRC?.trim(), process.env.MONETAG_ZONE_ID?.trim());
        if (process.env.MONETAG_ENABLED === 'true' && tag) {
            return {
                enabled: true,
                provider,
                monetag: { ...tag, format: 'in_page_push_banner' },
            };
        }
        return { enabled: false, provider };
    }

    return { enabled: false, provider };
}
