import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(__dirname, '..');
const schema = fs.readFileSync(path.join(root, 'prisma/schema.prisma'), 'utf8');

for (const model of ['BillingTransaction', 'BillingSubscription', 'BillingWebhookEvent', 'BillingPurchaseClaim']) {
    assert.match(schema, new RegExp(`model ${model}\\s*\\{`));
}

assert.match(schema, /providerResourceId\s+String\s+@unique/);
assert.match(schema, /providerSubscriptionId\s+String\s+@unique/);
assert.match(schema, /@@unique\(\[provider, providerEventId\]\)/);
assert.match(schema, /amount\s+Decimal\s+@db\.Decimal\(10,\s*2\)/);
assert.match(schema, /billingTransactions\s+BillingTransaction\[\]/);
assert.match(schema, /billingSubscriptions\s+BillingSubscription\[\]/);
assert.match(schema, /billingPurchaseClaims\s+BillingPurchaseClaim\[\]/);

console.log('billing schema tests: PASS');
