const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const requiredFiles = [
  'app/lib/ai/policy.ts',
  'app/lib/ai/nvidia.ts',
  'app/lib/ai/prompts.ts',
  'app/api/ai/chat/route.ts',
  'app/api/ai/preferences/route.ts',
  'app/dashboard/chat/page.tsx',
  'app/dashboard/chat/ChatView.tsx',
  'app/dashboard/chat/ChatView.module.scss',
];

for (const relative of requiredFiles) {
  assert.equal(fs.existsSync(path.join(root, relative)), true, `Missing AI chat file: ${relative}`);
}

const route = fs.readFileSync(path.join(root, 'app/api/ai/chat/route.ts'), 'utf8');
const provider = fs.readFileSync(path.join(root, 'app/lib/ai/nvidia.ts'), 'utf8');
assert.match(provider, /NVIDIA_API_KEY/);
assert.match(route, /getApiUser/);
assert.match(route, /429/);
assert.match(route, /aiChatMessage/);
assert.match(route, /sos/);
assert.match(route, /user\.aiContextEnabled/);
assert.match(route, /: \[\]/);
assert.doesNotMatch(provider, /NEXT_PUBLIC_NVIDIA/);

const schema = fs.readFileSync(path.join(root, 'prisma/schema.prisma'), 'utf8');
assert.match(schema, /model AiChatMessage/);
assert.match(schema, /aiContextEnabled/);
assert.match(schema, /aiContextConsentAt/);

const nav = fs.readFileSync(path.join(root, 'app/components/DashboardNav.tsx'), 'utf8');
assert.match(nav, /dashboard\/chat/);

console.log('AI chat contract passed');
