'use strict';
const { createIntegrationPreview } = require('../lib/integrations');
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });
  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    return res.status(200).json(createIntegrationPreview(payload));
  } catch (error) {
    if (error instanceof SyntaxError) return res.status(400).json({ error: 'JSON inválido.' });
    return res.status(400).json({ error: error.message });
  }
};
