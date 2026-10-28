import assert from 'node:assert/strict';
import {
  CURRENT_LEGAL_VERSIONS,
  SUPPORTED_LEGAL_LOCALES,
  evaluateLegalAccess,
  isSupportedCountry,
} from '../app/lib/legal/policy';

assert.deepEqual(SUPPORTED_LEGAL_LOCALES, ['es', 'en', 'pt']);
assert.equal(CURRENT_LEGAL_VERSIONS.TERMS, CURRENT_LEGAL_VERSIONS.PRIVACY);
assert.equal(isSupportedCountry('NI'), true);
assert.equal(isSupportedCountry('OTHER'), false);
assert.deepEqual(evaluateLegalAccess('NI', 13), { allowed: true });
assert.deepEqual(evaluateLegalAccess('NI', 12), { allowed: false, reason: 'AGE_RESTRICTED' });
assert.deepEqual(evaluateLegalAccess('ES', 13), { allowed: false, reason: 'AGE_RESTRICTED' });
assert.deepEqual(evaluateLegalAccess('ES', 14), { allowed: true });
assert.deepEqual(evaluateLegalAccess('NI', 121), { allowed: false, reason: 'AGE_RESTRICTED' });
assert.deepEqual(evaluateLegalAccess('RO', 15), { allowed: false, reason: 'AGE_RESTRICTED' });
assert.deepEqual(evaluateLegalAccess('RO', 16), { allowed: true });
assert.deepEqual(evaluateLegalAccess('ZZ', 18), { allowed: false, reason: 'UNSUPPORTED_COUNTRY' });
assert.deepEqual(evaluateLegalAccess('OTHER', 18), { allowed: false, reason: 'UNSUPPORTED_COUNTRY' });
console.log('legal policy tests passed');
