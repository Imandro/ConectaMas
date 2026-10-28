const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const view = fs.readFileSync(path.join(root, 'app/dashboard/chat/ChatView.tsx'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'app/dashboard/chat/ChatView.module.scss'), 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(!view.includes('window.confirm'), 'chat history must use an in-app confirmation sheet');
assert(view.includes('clearHistoryOpen'), 'chat must expose confirmation sheet state');
assert(view.includes('voiceStatus'), 'chat must expose visible voice status');
assert(view.includes('role="alertdialog"'), 'delete confirmation must be an alertdialog');
assert(view.includes('successNotice'), 'chat must expose a non-error success notice');
assert(!view.includes("setError('Historial borrado.')"), 'history success must not use error state');
assert(styles.includes('.clearDialog'), 'chat must style the delete confirmation sheet');
assert(styles.includes('.voiceStatus'), 'chat must style voice status');
assert(styles.includes('.successNotice'), 'chat must style success notice');
assert(styles.includes('scale: 0.96'), 'chat press state must use scale 0.96');
assert(styles.includes('overscroll-behavior: contain'), 'chat sheets must contain scroll');
assert(styles.includes('prefers-reduced-motion: reduce'), 'chat must support reduced motion');
assert(styles.includes('forced-colors: active'), 'chat must support forced colors');
assert(!styles.includes('box-shadow: 0 8px 24px rgba(11, 27, 50, .08)'), 'chat must not use hardcoded bubble shadow');

console.log('AI chat visual contract passed');
