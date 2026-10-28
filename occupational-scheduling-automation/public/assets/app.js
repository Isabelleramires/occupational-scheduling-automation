(function () {
  'use strict';
  const D = window.DemoData;
  const view = document.querySelector('#view');
  const footer = document.querySelector('#form-footer');
  const params = new URLSearchParams(location.search);
  const initial = D.load().convocations.find(c => !c.booking) || D.load().convocations[0];
  let id = params.get('id') && D.get(params.get('id')) ? params.get('id') : initial.id;
  let step = 1;
  let clinicId = null;
  let selectedDate = null;
  let selectedTime = null;
  const TIMES = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '13:30', '14:00', '14:30', '15:00', '15:30'];
  const icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  function toast(message) { const el = document.querySelector('#toast'); el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 3500); }
  function title(label, heading, desc) { return `<div class="section-tag">${label}</div><h2>${heading}</h2><p class="card-description">${desc}</p>`; }
  function row(label, value) { return `<div class="detail-row"><span>${D.html(label)}</span><strong>${D.html(value)}</strong></div>`; }
  function button(label, action, primary = true, disabled = false) { return `<button type="button" class="btn ${primary ? 'btn-primary' : 'btn-outline'}" data-action="${action}" ${disabled ? 'disabled' : ''}>${label}${primary ? icon : ''}</button>`; }
  function render() {
    const record = D.get(id);
    if (!record) { view.textContent = 'Convocação de demonstração não encontrada.'; return; }
    document.querySelector('#card-eyebrow').textContent = `ETAPA ${String(step).padStart(2,'0')} DE 05`;
    document.querySelectorAll('#step-list li').forEach(li => { const num = Number(li.dataset.step); li.classList.toggle('current', num === step); li.classList.toggle('complete', num < step); });
    if (step === 1) {
      view.innerHTML = title('CONVOCAÇÃO LOCALIZADA', 'Vamos começar?', 'Confira os dados da convocação fictícia antes de continuar.') +
        `<div class="person-banner"><div class="avatar">${D.html(record.name.slice(0, 1))}</div><div><span>COLABORADOR(A)</span><strong>${D.html(record.name)}</strong><small>${D.html(record.company)}</small></div><span class="status-tag ${record.booking ? 'success' : ''}">${record.booking ? 'Agendado' : 'Aguardando agendamento'}</span></div>` +
        `<div class="details">${row('Código da convocação', record.id)}${row('Unidade', record.unit)}${row('Tipo de exame', record.examType)}</div>` +
        `<p class="fine-print">Os registros são exemplos inventados, armazenados somente no seu navegador.</p>`;
      footer.innerHTML = `<span class="footer-caption">Identificação concluída</span><div class="footer-actions">${record.booking ? button('Ver agendamento', 'show-confirmation', false) : ''}${button(record.booking ? 'Reagendar' : 'Continuar', 'next')}</div>`;
    } else if (step === 2) {
      view.innerHTML = title('EXAMES SOLICITADOS', 'O que será realizado?', 'Confira os procedimentos incluídos na sua convocação de exemplo.') +
        `<div class="exam-list">${record.exams.map((exam, i) => `<div class="exam-item"><span class="exam-icon">✳</span><div><strong>${D.html(exam)}</strong><small>Procedimento ${String(i + 1).padStart(2,'0')} · Simulação</small></div><span class="check-icon">✓</span></div>`).join('')}</div><div class="notice"><span>ⓘ</span><p>Esta é uma lista ilustrativa. A realização de exames depende de uma solicitação real em ambiente autorizado.</p></div>`;
      footer.innerHTML = button('Voltar', 'back', false) + button('Escolher clínica', 'next');
    } else if (step === 3) {
      view.innerHTML = title('LOCAL DE ATENDIMENTO', 'Escolha uma clínica', 'Selecione uma unidade fictícia para continuar o agendamento demonstrativo.') +
        `<div class="clinic-list">${D.CLINICS.map(c => `<button type="button" class="clinic-option ${clinicId === c.id ? 'chosen' : ''}" data-clinic="${c.id}" aria-pressed="${clinicId === c.id}"><span class="clinic-avatar">${c.initials}</span><span class="clinic-copy"><b>${D.html(c.name)}</b><small>${D.html(c.area)}</small><small class="clinic-note">${D.html(c.note)}</small></span><span class="radio-indicator"></span></button>`).join('')}</div>`;
      footer.innerHTML = button('Voltar', 'back', false) + button('Selecionar clínica', 'next', true, !clinicId);
    } else if (step === 4) {
      const dates = D.weekdays(10);
      view.innerHTML = title('DISPONIBILIDADE', 'Quando fica melhor?', 'Escolha uma data e um horário. As opções são apenas ilustrativas, não representam agenda real.') +
        `<div class="section-subheading">Datas disponíveis <span>Próximos dias úteis</span></div>` +
        `<div class="date-grid">${dates.map(d => `<button type="button" class="date-button ${selectedDate === d ? 'chosen' : ''}" data-date="${d}" aria-pressed="${selectedDate === d}"><small>${D.html(D.formatDate(d, { weekday: 'short' }).replace('.', ''))}</small><b>${d.slice(-2)}</b><span>${D.html(D.formatDate(d, { month: 'short' }).replace('.', ''))}</span></button>`).join('')}</div>` +
        `<div class="section-subheading time-heading">Horários disponíveis <span>${selectedDate ? D.formatDate(selectedDate) : 'Selecione uma data primeiro'}</span></div>` +
        `<div class="time-grid">${selectedDate ? TIMES.map(t => `<button type="button" class="time-button ${selectedTime === t ? 'chosen' : ''}" data-time="${t}" aria-pressed="${selectedTime === t}">${t}</button>`).join('') : '<p class="empty-hint">Os horários aparecerão após a seleção da data.</p>'}</div>`;
      footer.innerHTML = button('Voltar', 'back', false) + button(record.booking ? 'Confirmar reagendamento' : 'Confirmar agendamento', 'confirm', true, !clinicId || !selectedDate || !selectedTime);
    } else if (step === 5) {
      const current = D.get(id);
      if (!current.booking) { step = 1; render(); return; }
      const clinic = D.clinicById(current.booking.clinicId);
      view.innerHTML = `<div class="success-icon">✓</div>` + title('AGENDAMENTO DEMONSTRATIVO', 'Tudo certo por aqui!', 'Sua simulação foi registrada neste navegador. Não existe agendamento real.') +
        `<div class="ticket"><div class="ticket-top"><span>COMPROVANTE DE SIMULAÇÃO</span><b>${D.html(current.id)}</b></div>${row('Colaborador(a)', current.name)}${row('Exame', current.examType)}${row('Clínica', clinic?.name || 'Clínica exemplo')}${row('Data', D.formatDate(current.booking.date))}${row('Horário', current.booking.time)}<div class="ticket-bottom">Somente demonstração · Sem validade para atendimento</div></div>` +
        `<div class="notice"><span>ⓘ</span><p>Para testar novamente, utilize “Reagendar” ou acesse o painel de gestão e reinicie a demonstração.</p></div>`;
      footer.innerHTML = button('Reagendar', 'reschedule', false) + button('Ir ao painel de gestão', 'dashboard');
    }
  }
  view.addEventListener('click', event => {
    const clinicButton = event.target.closest('[data-clinic]');
    if (clinicButton) { clinicId = clinicButton.dataset.clinic; selectedDate = null; selectedTime = null; render(); return; }
    const dateButton = event.target.closest('[data-date]');
    if (dateButton) { selectedDate = dateButton.dataset.date; selectedTime = null; render(); return; }
    const timeButton = event.target.closest('[data-time]');
    if (timeButton) { selectedTime = timeButton.dataset.time; render(); }
  });
  footer.addEventListener('click', event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (!action) return;
    if (action === 'back') { step = Math.max(1, step - 1); render(); }
    if (action === 'next') { if (step === 3 && !clinicId) return; step = Math.min(5, step + 1); render(); }
    if (action === 'show-confirmation') { step = 5; render(); }
    if (action === 'reschedule') { step = 3; clinicId = D.get(id)?.booking?.clinicId || null; selectedDate = null; selectedTime = null; render(); }
    if (action === 'dashboard') { location.href = './prestador.html'; }
    if (action === 'confirm') {
      try { D.updateBooking(id, { clinicId, date: selectedDate, time: selectedTime }); step = 5; toast('Simulação salva neste navegador.'); render(); }
      catch (error) { toast(error.message); }
    }
  });
  // O ID é fictício; preservamos o parâmetro para simular links individuais de convocação.
  if (!params.get('id') || !D.get(params.get('id'))) history.replaceState(null, '', '?id=' + encodeURIComponent(id));
  render();
})();
