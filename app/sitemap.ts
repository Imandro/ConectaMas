import type { MetadataRoute } from 'next';
import { PUBLIC_RESOURCES } from '@/app/lib/public-content';

const BASE_URL = 'https://conectamas.live';

export default function sitemap(): MetadataRoute.Sitemap {
    const publicRoutes: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: new Date('2026-10-28'), changeFrequency: 'weekly', priority: 1 },
        { url: `${BASE_URL}/about`, lastModified: new Date('2026-10-28'), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/recursos`, lastModified: new Date('2026-10-28'), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE_URL}/legal/privacy`, lastModified: new Date('2026-10-28'), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${BASE_URL}/legal/cookies`, lastModified: new Date('2026-10-28'), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${BASE_URL}/legal/terms`, lastModified: new Date('2026-10-28'), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${BASE_URL}/legal/refunds`, lastModified: new Date('2026-10-28'), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${BASE_URL}/legal/community`, lastModified: new Date('2026-10-28'), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${BASE_URL}/legal/age`, lastModified: new Date('2026-10-28'), changeFrequency: 'yearly', priority: 0.3 },
    ];
    return [...publicRoutes, ...PUBLIC_RESOURCES.map((resource) => ({
        url: `${BASE_URL}/recursos/${resource.slug}`,
        lastModified: new Date(resource.publishedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))];
}
