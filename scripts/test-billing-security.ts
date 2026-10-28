import assert from 'node:assert/strict';
import { billingUrl } from '../app/lib/billing/config';
import { googlePurchaseReference } from '../app/lib/billing/providers/google-play';

process.env.NEXT_PUBLIC_APP_URL = 'https://conectaplus.app';
assert.equal(new URL(billingUrl('/dashboard/support')).origin, 'https://conectaplus.app');
assert.throws(() => billingUrl('https://evil.example/steal'), /invalid billing return path/);
assert.throws(() => billingUrl('//evil.example/steal'), /invalid billing return path/);
assert.equal(googlePurchaseReference('token-a'), googlePurchaseReference('token-a'));
assert.notEqual(googlePurchaseReference('token-a'), 'token-a');

console.log('billing security tests: PASS');
