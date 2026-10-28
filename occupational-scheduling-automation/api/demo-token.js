'use strict';
const { issueDemoToken, verifyDemoToken } = require('../lib/tokens');
module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    if (!process.env.DEMO_TOKEN_SECRET || process.env.DEMO_TOKEN_SECRET.length < 32) {
      return res.status(503).json({ error: 'Demonstração de tokens desativada. Configure DEMO_TOKEN_SECRET no servidor.' });
    }
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const token = issueDemoToken(body?.reference, process.env.DEMO_TOKEN_SECRET);
      return res.status(200).json({ token, expiresInSeconds: 900, note: 'Token demonstrativo, sem dados pessoais e sem acesso real.' });
    } catch (error) { return res.status(400).json({ error: error.message }); }
  }
  if (req.method === 'GET') {
    const bearer = req.headers.authorization || '';
    const token = bearer.startsWith('Bearer ') ? bearer.slice(7) : '';
    const decoded = verifyDemoToken(token, process.env.DEMO_TOKEN_SECRET || '');
    return decoded ? res.status(200).json({ valid: true, ...decoded }) : res.status(401).json({ valid: false });
  }
  return res.status(405).json({ error: 'Método não permitido.' });
};
