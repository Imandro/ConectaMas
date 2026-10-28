const assert = require('node:assert/strict');
require('ts-node/register/transpile-only');

const { DEFAULT_DESIGN_VARIANT, resolveDesignVariant } = require('../app/lib/designVariants');
const { DEFAULT_DESIGN_MODE, resolveDesignMode } = require('../app/lib/designModes');
const { DEFAULT_GLASS_INTENSITY, resolveGlassIntensity, GLASS_INTENSITIES } = require('../app/lib/glassModes');

assert.equal(resolveDesignVariant('calma'), 'calma');
assert.equal(resolveDesignVariant('comunidad'), 'comunidad');
assert.equal(resolveDesignVariant('fuego'), 'fuego');
assert.equal(resolveDesignVariant('unknown'), DEFAULT_DESIGN_VARIANT);
assert.equal(resolveDesignVariant(null), DEFAULT_DESIGN_VARIANT);
assert.equal(DEFAULT_DESIGN_VARIANT, 'fuego');
assert.equal(resolveDesignMode('dark'), 'dark');
assert.equal(resolveDesignMode('light'), 'light');
assert.equal(resolveDesignMode('unknown'), DEFAULT_DESIGN_MODE);
assert.equal(resolveDesignMode(null), DEFAULT_DESIGN_MODE);
assert.deepEqual(GLASS_INTENSITIES, ['subtle', 'balanced', 'rich']);
assert.equal(resolveGlassIntensity('subtle'), 'subtle');
assert.equal(resolveGlassIntensity('balanced'), 'balanced');
assert.equal(resolveGlassIntensity('rich'), 'rich');
assert.equal(resolveGlassIntensity('unknown'), DEFAULT_GLASS_INTENSITY);
assert.equal(resolveGlassIntensity(null), DEFAULT_GLASS_INTENSITY);
assert.equal(DEFAULT_GLASS_INTENSITY, 'balanced');

console.log('design variants: ok');
