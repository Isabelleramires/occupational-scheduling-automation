'use strict';
// Adapter opcional de ilustração: NÃO é chamado pelas páginas públicas ou pelas APIs deste demo.
// A chave de serviço deve ficar apenas em variáveis privadas do ambiente do servidor.
async function upsertExample(reference, examType, unit) {
  const base = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) throw new Error('Configure Supabase somente no ambiente privado de desenvolvimento.');
  if (!/^DEMO-[A-Z0-9-]{3,40}$/.test(reference)) throw new Error('ID fictício inválido.');
  if (!/^https:\/\/[\w.-]+\.supabase\.co\/?$/.test(base)) throw new Error('Use URL de projeto Supabase de teste.');
  const response = await fetch(`${base.replace(/\/$/, '')}/rest/v1/demo_convocations?on_conflict=id`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ id: reference, exam_type: examType, unit_label: unit, status: 'pendente' }),
    signal: AbortSignal.timeout(5000)
  });
  if (!response.ok) throw new Error(`Operação de demonstração recusada (HTTP ${response.status}).`);
  return { saved: true, id: reference };
}
module.exports = { upsertExample };
