'use strict';
// Servidor local sem dependências, para rodar exatamente as mesmas APIs do projeto Vercel.
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { URL } = require('node:url');
const ROOT = path.resolve(__dirname, 'public');
const API = new Map([
  ['/api/health', require('./api/health')],
  ['/api/integration-preview', require('./api/integration-preview')],
  ['/api/demo-token', require('./api/demo-token')]
]);
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };
function respondJSON(res) {
  res.status = code => { res.statusCode = code; return res; };
  res.json = data => { res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(data)); return res; };
}
async function handler(req, res) {
  respondJSON(res);
  const pathname = new URL(req.url || '/', 'http://localhost').pathname;
  try {
    if (pathname.startsWith('/api/')) {
      const route = API.get(pathname);
      if (!route) return res.status(404).json({ error: 'Rota não encontrada.' });
      const chunks = []; let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 16 * 1024) return res.status(413).json({ error: 'Corpo da requisição excede 16 KB.' });
        chunks.push(chunk);
      }
      if (chunks.length) {
        try { req.body = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
        catch { return res.status(400).json({ error: 'JSON inválido.' }); }
      }
      return await route(req, res);
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return res.status(405).json({ error: 'Método não permitido.' });
    const filename = pathname === '/' ? '/index.html' : pathname === '/prestador' ? '/prestador.html' : pathname;
    const safePath = path.resolve(ROOT, '.' + filename);
    if (!safePath.startsWith(ROOT + path.sep)) return res.status(403).json({ error: 'Acesso negado.' });
    const content = await fs.readFile(safePath);
    res.setHeader('Content-Type', MIME[path.extname(safePath)] || 'application/octet-stream');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (req.method === 'HEAD') return res.end();
    return res.end(content);
  } catch (err) {
    if (err.code === 'ENOENT' || err.code === 'EISDIR') return res.status(404).json({ error: 'Arquivo não encontrado.' });
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  http.createServer(handler).listen(port, () => console.log(`Demo disponível em http://localhost:${port}`));
}
module.exports = handler;
