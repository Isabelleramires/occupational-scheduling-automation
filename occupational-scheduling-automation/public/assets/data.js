/* Estado local para uma demonstração isolada: nenhuma chamada externa é feita aqui. */
(function (global) {
  'use strict';
  const KEY = 'occupational_demo_v1';
  const CLINICS = Object.freeze([
    { id: 'CL-EX-01', name: 'Clínica Modelo Centro', area: 'Centro · Local ilustrativo', note: 'Atendimento clínico ocupacional', initials: 'CM' },
    { id: 'CL-EX-02', name: 'Espaço Saúde Exemplo', area: 'Região Sul · Local ilustrativo', note: 'Exames complementares', initials: 'ES' },
    { id: 'CL-EX-03', name: 'Unidade Laboratório Demo', area: 'Região Leste · Local ilustrativo', note: 'Atendimento e avaliações', initials: 'UL' }
  ]);
  const TYPES = ['Admissional', 'Periódico', 'Retorno ao trabalho', 'Mudança de função', 'Demissional'];
  const SAMPLE_NAMES = ['Ana Exemplo', 'Bruno Demonstração', 'Camila Fictícia', 'Diego Modelo', 'Eva Exemplo'];
  function futureDate(offset) {
    const now = new Date(); now.setHours(12, 0, 0, 0); now.setDate(now.getDate() + offset);
    return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
  }
  function weekdays(count = 10) {
    const list = []; let offset = 1;
    while (list.length < count && offset < 45) {
      const date = futureDate(offset++);
      const weekday = new Date(date + 'T12:00:00').getDay();
      if (weekday !== 0 && weekday !== 6) list.push(date);
    }
    return list;
  }
  function initialState() {
    return { version: 1, nextId: 1006, convocations: [
      { id: 'DEMO-1001', name: SAMPLE_NAMES[0], company: 'Empresa Fictícia', unit: 'Unidade Demonstrativa', examType: 'Periódico', exams: ['Avaliação clínica', 'Audiometria'], booking: null },
      { id: 'DEMO-1002', name: SAMPLE_NAMES[1], company: 'Empresa Fictícia', unit: 'Unidade Demonstrativa', examType: 'Admissional', exams: ['Avaliação clínica'], booking: { clinicId: 'CL-EX-02', date: weekdays()[2], time: '09:30' } },
      { id: 'DEMO-1003', name: SAMPLE_NAMES[2], company: 'Empresa Fictícia', unit: 'Unidade Demonstrativa', examType: 'Mudança de função', exams: ['Avaliação clínica', 'Acuidade visual'], booking: null },
      { id: 'DEMO-1004', name: SAMPLE_NAMES[3], company: 'Empresa Fictícia', unit: 'Unidade Demonstrativa', examType: 'Retorno ao trabalho', exams: ['Avaliação clínica'], booking: null },
      { id: 'DEMO-1005', name: SAMPLE_NAMES[4], company: 'Empresa Fictícia', unit: 'Unidade Demonstrativa', examType: 'Demissional', exams: ['Avaliação clínica'], booking: null }
    ] };
  }
  function load() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (value && value.version === 1 && Array.isArray(value.convocations) && Number.isInteger(value.nextId)) return value;
    } catch (_ignored) { /* Fallback para estado inicial */ }
    const fresh = initialState();
    save(fresh);
    return fresh;
  }
  function save(state) { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_ignored) {} return state; }
  function get(id) { return load().convocations.find(c => c.id === id) || null; }
  function updateBooking(id, booking) {
    if (!CLINICS.some(c => c.id === booking?.clinicId) || !weekdays(15).includes(booking?.date) || !/^\d{2}:\d{2}$/.test(booking?.time)) throw new Error('Seleção inválida.');
    const state = load(); const convocation = state.convocations.find(c => c.id === id);
    if (!convocation) throw new Error('Convocação não encontrada.');
    convocation.booking = { clinicId: booking.clinicId, date: booking.date, time: booking.time };
    save(state); return convocation;
  }
  function create({ name, examType, unit }) {
    name = String(name || '').trim().slice(0, 70);
    unit = String(unit || '').trim().slice(0, 70);
    if (!name || !unit || !TYPES.includes(examType)) throw new Error('Preencha os dados corretamente.');
    const state = load();
    const entry = { id: 'DEMO-' + state.nextId++, name, company: 'Empresa Fictícia', unit, examType, exams: ['Avaliação clínica'], booking: null };
    state.convocations.unshift(entry); save(state); return entry;
  }
  function reset() { return save(initialState()); }
  function clinicById(id) { return CLINICS.find(c => c.id === id) || null; }
  function formatDate(value, options = { day: '2-digit', month: 'long', year: 'numeric' }) {
    const parsed = new Date(value + 'T12:00:00');
    return Number.isNaN(parsed.getTime()) ? '—' : new Intl.DateTimeFormat('pt-BR', options).format(parsed);
  }
  function html(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  global.DemoData = { CLINICS, TYPES, weekdays, load, get, save, updateBooking, create, reset, clinicById, formatDate, html };
})(window);
