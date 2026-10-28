'use strict';
module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido.' });
  return res.status(200).json({ status: 'ok', mode: 'demo', integrations: 'simulated' });
};
