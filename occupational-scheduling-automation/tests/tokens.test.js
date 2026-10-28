'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { issueDemoToken, verifyDemoToken } = require('../lib/tokens');
const SECRET = 'example-secret-for-local-tests-only-000000';
test('assina ID opaco e valida assinatura', () => {
  const token = issueDemoToken('DEMO-1001', SECRET, 1000000);
  assert.deepEqual(verifyDemoToken(token, SECRET, 1000000), {sub:'DEMO-1001',exp:1900,scope:'demo:read'});
  assert.equal(token.includes('Ana'), false);
});
test('rejeita expiração, alterações e chaves incorretas', () => {
  const token = issueDemoToken('DEMO-1001', SECRET, 1000000);
  assert.equal(verifyDemoToken(token, SECRET, 2000000), null);
  assert.equal(verifyDemoToken(token, SECRET + 'OTHER', 1000000), null);
  assert.equal(verifyDemoToken('garbage', SECRET), null);
});
test('requer segredo forte e identificador de exemplo', () => {
  assert.throws(() => issueDemoToken('DEMO-1001','weak'));
  assert.throws(() => issueDemoToken('CPF-123',SECRET));
});
