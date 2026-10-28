import assert from 'node:assert/strict';
import { isAllowedEmail, isEmailIdentifier } from '../app/lib/email-validation';

for (const email of [
  'persona@gmail.com',
  'persona@icloud.com',
  'persona@yahoo.com',
  'persona@outlook.com',
  ' Persona@GMAIL.COM ',
]) {
  assert.equal(isAllowedEmail(email), true, `${email} should be allowed`);
}

for (const email of [
  'persona@hotmail.com',
  'persona@gmail.co',
  'persona@gmail.com.evil',
  '@gmail.com',
  'persona gmail.com',
  '',
  null,
]) {
  assert.equal(isAllowedEmail(email), false, `${email} should be rejected`);
}

assert.equal(isEmailIdentifier('persona@hotmail.com'), true);
assert.equal(isEmailIdentifier('usuario'), false);
assert.equal(isEmailIdentifier('@usuario'), false);

console.log('email validation tests: PASS');
