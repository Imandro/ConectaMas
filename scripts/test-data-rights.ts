import assert from 'node:assert/strict';
import fs from 'node:fs';
import { canDeleteWithSubscriptions, sanitizePaymentRecord } from '../app/lib/account/data-rights';

assert.equal(canDeleteWithSubscriptions([]).allowed, true);
assert.equal(canDeleteWithSubscriptions([{ status: 'ACTIVE' }]).allowed, false);
assert.equal(canDeleteWithSubscriptions([{ status: 'CANCELLED' }]).allowed, true);
assert.equal(canDeleteWithSubscriptions([{ status: 'CANCELLED', currentPeriodEnd: new Date(Date.now() + 60_000) }]).allowed, false);
const payment = sanitizePaymentRecord({ provider: 'paypal', providerResourceId: 'secret-ref', amount: 2.99, currency: 'USD', status: 'PAID', metadata: { token: 'secret' } });
assert.equal('userId' in payment, false);
assert.equal('providerResourceId' in payment, false);
assert.equal('metadata' in payment, false);
assert.equal(payment.provider, 'paypal');
assert.match(fs.readFileSync('app/dashboard/profile/ClientProfileActions.tsx', 'utf8'), /clearClientPrivateData/);
const privacyConsent = fs.readFileSync('app/lib/privacy-consent.ts', 'utf8');
assert.match(privacyConsent, /deleteDatabase\('conecta-plus-offline'\)/);
assert.match(privacyConsent, /offline-pages-v1-/);
assert.doesNotMatch(privacyConsent, /keys\.map\(\(key\) => window\.caches\.delete\(key\)\)/);
console.log('data rights tests passed');
