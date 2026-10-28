'use strict';

/**
 * Adapter demonstrativo: não se conecta a serviços reais.
 * Em produção, validação, autenticação, rastreabilidade, idempotência e
 * tratamento robusto de SOAP/XML seriam necessários.
 */
const TYPES = Object.freeze(['Admissional', 'Periódico', 'Retorno ao trabalho', 'Mudança de função', 'Demissional']);
const EXAMS = Object.freeze(['Avaliação clínica', 'Audiometria', 'Acuidade visual', 'Eletrocardiograma']);

function normalizeText(value, max = 90) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ').slice(0, max);
}
function escapeXml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
function validateEvent(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Envie um objeto JSON.');
  const id = normalizeText(raw.externalId, 50);
  const type = normalizeText(raw.examType, 50);
  const unit = normalizeText(raw.unit, 80);
  if (!/^[a-zA-Z0-9_-]{4,50}$/.test(id)) throw new Error('externalId inválido (4 a 50 caracteres alfanuméricos, _ ou -).');
  if (!TYPES.includes(type)) throw new Error('examType deve conter um tipo de exame permitido.');
  if (!unit) throw new Error('unit é obrigatório.');
  const exams = Array.isArray(raw.exams) ? raw.exams : [];
  if (!exams.length || exams.length > 4 || exams.some(item => !EXAMS.includes(item))) {
    throw new Error('exams deve conter de 1 a 4 exames conhecidos.');
  }
  return { externalId: id, examType: type, unit, exams: [...new Set(exams)], status: 'pendente' };
}
function buildSoapPreview(event) {
  // Envelope ilustrativo: NÃO representa esquema de nenhum fornecedor.
  const lines = event.exams.map(exam => `        <demo:Exam>${escapeXml(exam)}</demo:Exam>`).join('\n');
  return `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:demo="urn:demo:occupational-scheduling">
  <soap:Body>
    <demo:CreateRequest>
      <demo:Reference>${escapeXml(event.externalId)}</demo:Reference>
      <demo:Type>${escapeXml(event.examType)}</demo:Type>
      <demo:Unit>${escapeXml(event.unit)}</demo:Unit>
      <demo:Exams>
${lines}
      </demo:Exams>
    </demo:CreateRequest>
  </soap:Body>
</soap:Envelope>`;
}
function createIntegrationPreview(raw) {
  const normalized = validateEvent(raw);
  return {
    mode: 'simulation',
    warning: 'Nenhuma requisição foi enviada a sistemas externos; não houve gravação em banco.',
    normalized,
    rest: { method: 'POST', path: '/api/integration-preview', contentType: 'application/json' },
    soapEnvelope: buildSoapPreview(normalized)
  };
}
module.exports = { TYPES, EXAMS, normalizeText, escapeXml, validateEvent, buildSoapPreview, createIntegrationPreview };
