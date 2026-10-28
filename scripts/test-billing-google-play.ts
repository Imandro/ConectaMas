import assert from 'node:assert/strict';
import { googleProductCode, googleSubscriptionState } from '../app/lib/billing/providers/google-play';

assert.equal(googleProductCode('conecta_premium_monthly'), 'PREMIUM_MONTHLY');
assert.equal(googleProductCode('conecta_premium_yearly'), 'PREMIUM_YEARLY');
assert.equal(googleProductCode('unknown'), null);
assert.equal(googleSubscriptionState('SUBSCRIPTION_STATE_ACTIVE'), 'ACTIVE');
assert.equal(googleSubscriptionState('SUBSCRIPTION_STATE_CANCELED'), 'CANCELLED');
assert.equal(googleSubscriptionState('SUBSCRIPTION_STATE_EXPIRED'), 'EXPIRED');
assert.equal(googleSubscriptionState('unknown'), 'PENDING');

console.log('Google Play billing tests: PASS');
