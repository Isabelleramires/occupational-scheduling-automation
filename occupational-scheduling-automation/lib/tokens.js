'use strict';
const crypto = require('node:crypto');

// Demonstra assinatura HMAC de um ID opaco. Nunca codifique dados pessoais no payload.
function encode(value) { return Buffer.from(JSON.stringify(value)).toString('base64url'); }
function issueDemoToken(reference, secret, now = Date.now()) {
  if (typeof secret !== 'string' || secret.length < 32) throw new Error('Configure DEMO_TOKEN_SECRET com pelo menos 32 caracteres.');
  if (typeof reference !== 'string' || !/^DEMO-[A-Z0-9-]{3,40}$/.test(reference)) throw new Error('Identificador demonstrativo inválido.');
  const payload = encode({ sub: reference, exp: Math.floor(now / 1000) + 15 * 60, scope: 'demo:read' });
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}
function verifyDemoToken(token, secret, now = Date.now()) {
  if (typeof token !== 'string' || typeof secret !== 'string' || !token.includes('.')) return null;
  const parts = token.split('.');
  if (parts.length !== 2 || !parts.every(part => /^[A-Za-z0-9_-]+$/.test(part))) return null;
  const [payload, signature] = parts;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest();
  let provided;
  try { provided = Buffer.from(signature, 'base64url'); } catch { return null; }
  if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!/^DEMO-[A-Z0-9-]{3,40}$/.test(data.sub) || data.scope !== 'demo:read' || !Number.isSafeInteger(data.exp) || data.exp <= Math.floor(now / 1000)) return null;
    return { sub: data.sub, exp: data.exp, scope: data.scope };
  } catch { return null; }
}
module.exports = { issueDemoToken, verifyDemoToken };
