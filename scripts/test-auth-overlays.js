const fs = require('fs');
const assert = require('assert');

const files = [
  'app/auth/login/page.tsx',
  'app/auth/register/page.tsx',
  'app/auth/forgot-password/page.tsx',
  'app/offline/page.tsx',
  'app/legal/terms/page.tsx',
  'app/legal/privacy/page.tsx',
  'app/legal/cookies/page.tsx',
  'app/onboarding/OnboardingSteps.tsx',
  'app/onboarding/loading.tsx',
  'app/components/NotificationPrompt.tsx',
  'app/components/PWAInstallPrompt.tsx',
  'app/components/CheckinModal.tsx',
  'app/components/CountryModal.tsx',
  'app/components/InstagramModal.tsx',
  'app/components/LanguageRegionModal.tsx',
  'app/components/WhatsappModal.tsx',
];

const source = Object.fromEntries(files.map((file) => [file, fs.readFileSync(file, 'utf8')]));
const legalDocumentSource = fs.readFileSync('app/legal/LegalDocumentPage.tsx', 'utf8');

for (const file of files.slice(0, 4)) {
  assert.match(source[file], /ui-surface/, `${file} needs an opaque shared surface`);
}
assert.match(legalDocumentSource, /ui-surface/, 'shared legal document needs an opaque surface');
for (const file of files.slice(4, 7)) {
  assert.match(source[file], /LegalDocumentPage/, `${file} needs shared legal document surface`);
}
assert.match(source['app/onboarding/OnboardingSteps.tsx'], /ui-surface-glass/, 'onboarding panel needs shared functional surface');
assert.match(source['app/onboarding/loading.tsx'], /bg-primary[\s\S]*ui-surface-glass/, 'onboarding loading must keep the dark surface shell');
for (const file of files.slice(8)) {
  assert.match(source[file], /ui-surface-glass/, `${file} needs shared glass overlay surface`);
}

console.log('auth overlays: ok');
