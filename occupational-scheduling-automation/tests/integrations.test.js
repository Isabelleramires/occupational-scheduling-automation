'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { validateEvent, buildSoapPreview, createIntegrationPreview } = require('../lib/integrations');
const base = { externalId:'DEMO-EVENT-001', examType:'Periódico', unit:'Unidade Demonstrativa', exams:['Avaliação clínica','Audiometria'] };
test('normaliza evento fictício válido', () => {
  assert.deepEqual(validateEvent(base), { ...base, status:'pendente' });
});
test('rejeita tipos desconhecidos e identificadores inválidos', () => {
  assert.throws(() => validateEvent({...base, examType:'desconhecido'}));
  assert.throws(() => validateEvent({...base, externalId:'<script>'}));
  assert.throws(() => validateEvent({...base, exams:[]}));
});
test('faz escape de valores XML dinâmicos', () => {
  const xml = buildSoapPreview({...base, unit:'Teste & <tag>'});
  assert.match(xml, /Teste &amp; &lt;tag&gt;/);
  assert.doesNotMatch(xml, /<tag>/);
});
test('não dispara chamadas externas e produz prévia', () => {
  const result = createIntegrationPreview(base);
  assert.equal(result.mode,'simulation');
  assert.equal(result.normalized.externalId, 'DEMO-EVENT-001');
  assert.match(result.soapEnvelope, /<soap:Envelope/);
});
