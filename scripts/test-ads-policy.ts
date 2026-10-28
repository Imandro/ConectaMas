import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { getPublicAdsConfig, isAdPlacementAllowed } from '../app/lib/ads/config';

const root = process.cwd();
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');

delete process.env.ADS_PROVIDER;
assert.deepEqual(getPublicAdsConfig(), { enabled: false, provider: 'off' });
process.env.ADS_PROVIDER = 'monetag';
process.env.MONETAG_ENABLED = 'true';
process.env.MONETAG_TAG_SRC = 'https://publisher.example/act/files/tag.min.js?z=10667872';
process.env.MONETAG_ZONE_ID = '10667872';
let config = getPublicAdsConfig();
assert.equal(config.provider, 'monetag');
assert.equal(config.enabled, true);
assert.equal(config.monetag?.format, 'in_page_push_banner');
assert.equal(config.monetag?.zoneId, '10667872');
process.env.MONETAG_TAG_SRC = 'http://evil.example/tag.min.js';
assert.equal(getPublicAdsConfig().enabled, false);
process.env.MONETAG_TAG_SRC = 'https://publisher.example/act/files/tag.min.js?z=10667872';

process.env.ADS_PROVIDER = 'sponsor';
process.env.NEXT_PUBLIC_SPONSOR_NAME = 'Juegos Familiares';
process.env.NEXT_PUBLIC_SPONSOR_TAGLINE = 'Aprende y juega en familia.';
process.env.NEXT_PUBLIC_SPONSOR_URL = 'https://example.org/conecta';
process.env.NEXT_PUBLIC_SPONSOR_CTA = 'Conocer';
process.env.NEXT_PUBLIC_SPONSOR_CATEGORY = 'Juegos familiares';
process.env.SPONSOR_APPROVED = 'true';
config = getPublicAdsConfig();
assert.equal(config.provider, 'sponsor');
assert.equal(config.enabled, true);
assert.equal(config.sponsor?.label, 'Patrocinado');
assert.equal(config.sponsor?.url, 'https://example.org/conecta');

process.env.NEXT_PUBLIC_SPONSOR_URL = 'http://unsafe.example';
assert.equal(getPublicAdsConfig().enabled, false);
process.env.NEXT_PUBLIC_SPONSOR_URL = 'https://example.org/conecta';
process.env.NEXT_PUBLIC_SPONSOR_CATEGORY = 'Casino';
assert.equal(getPublicAdsConfig().enabled, false);

assert.equal(isAdPlacementAllowed('dashboard'), true);
assert.equal(isAdPlacementAllowed('games'), true);
assert.equal(isAdPlacementAllowed('bible'), false);
assert.match(read('app/components/AdBanner.tsx'), /isCapacitorRuntime/);
assert.match(read('app/components/AdBanner.tsx'), /MONETAG|monetag/i);
assert.match(read('app/components/AdBanner.tsx'), /data-zone/);
assert.doesNotMatch(read('app/components/AdBanner.tsx'), /ezoic|ezstandalone|adsbygoogle|pagead\.googlesyndication/i);
assert.doesNotMatch(read('app/lib/ads/config.ts'), /ezoic|adsense/i);
assert.doesNotMatch(read('app/legal/legalContent.ts'), /Ezoic|AdSense/);
assert.match(read('app/dashboard/page.tsx'), /<AdBanner placement="dashboard"/);
assert.match(read('app/dashboard/games/page.tsx'), /<AdBanner placement="games"/);
for (const file of ['app/dashboard/bible/page.tsx', 'app/dashboard/sos/page.tsx', 'app/dashboard/checkin/page.tsx', 'app/dashboard/prayer/page.tsx', 'app/dashboard/forums/page.tsx', 'app/dashboard/premium/page.tsx', 'app/dashboard/support/page.tsx']) {
  assert.doesNotMatch(read(file), /<AdBanner/);
}
assert.match(read('app/components/AdBanner.tsx'), /dashboard\/prayer/);
assert.match(read('app/components/AdBanner.tsx'), /dashboard\/forums/);
assert.match(read('app/recursos/page.tsx'), /Recursos/);
assert.match(read('app/robots.ts'), /conectamas\.live/);
assert.match(read('app/sitemap.ts'), /conectamas\.live/);
assert.match(read('app/layout.tsx'), /conectamas\.live/);
assert.match(read('app/legal/legalContent.ts'), /Monetag|patrocinad|sponsor/i);

console.log('ads policy tests passed');
