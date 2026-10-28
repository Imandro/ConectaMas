import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'twa-manifest.json'), 'utf8'));
const gradle = fs.readFileSync(path.join(root, 'bwrap-build/app/build.gradle'), 'utf8');
const delegationService = fs.readFileSync(path.join(root, 'bwrap-build/app/src/main/java/com/conecta_plus/app/DelegationService.java'), 'utf8');
const androidManifest = fs.readFileSync(path.join(root, 'bwrap-build/app/src/main/AndroidManifest.xml'), 'utf8');

assert.equal(manifest.appVersion, '1.9');
assert.equal(manifest.appVersionCode, 11);
assert.equal(manifest.features?.playBilling?.enabled, true);
assert.match(gradle, /versionCode\s+11/);
assert.match(gradle, /versionName\s+"1\.9"/);
assert.match(gradle, /com\.google\.androidbrowserhelper:billing:1\.1\.0/);
assert.match(delegationService, /DigitalGoodsRequestHandler/);
assert.match(androidManifest, /com\.google\.androidbrowserhelper\.playbilling\.provider\.PaymentActivity/);

console.log('android release config tests: PASS');
