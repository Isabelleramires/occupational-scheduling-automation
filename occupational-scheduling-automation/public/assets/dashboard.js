(function () {
  'use strict';
  const D = window.DemoData;
  const area = document.querySelector('#dashboard-view');
  const dialog = document.querySelector('#create-dialog');
  let tab = 'overview'; let search = ''; let filter = 'all';
  const SAMPLE = { externalId: 'DEMO-EVENT-001', examType: 'Periódico', unit: 'Unidade Demonstrativa', exams: ['Avaliação clínica', 'Audiometria'] };
  function toast(message) { const el = document.querySelector('#toast'); el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 3500); }
  function status(record) { return record.booking ? '<span class="status-tag success">● Agendado</span>' : '<span class="status-tag pending">● Pendente</span>'; }
  function link(record) { return `./index.html?id=${encodeURIComponent(record.id)}`; }
  function stats() {
    const all = D.load().convocations; const booked = all.filter(c => c.booking).length;
    return `<div class="stats-grid"><div class="stat-card"><span class="stat-ornament">▣</span><div class="stat-label">TOTAL DE CONVOCAÇÕES</div><div class="stat-number">${all.length.toString().padStart(2,'0')}</div><div class="stat-desc">Registros de demonstração</div></div><div class="stat-card"><span class="stat-ornament purple">◷</span><div class="stat-label">AGUARDANDO</div><div class="stat-number">${(all.length - booked).toString().padStart(2,'0')}</div><div class="stat-desc">Aguardando agendamento</div></div><div class="stat-card"><span class="stat-ornament green">✓</span><div class="stat-label">AGENDAMENTOS</div><div class="stat-number">${booked.toString().padStart(2,'0')}</div><div class="stat-desc">Salvos neste navegador</div></div></div>`;
  }
  function table(records) {
    return `<div class="table-wrap"><table><thead><tr><th>COLABORADOR(A)</th><th>TIPO DE EXAME</th><th>STATUS</th><th>DATA</th><th></th></tr></thead><tbody>${records.map(c => `<tr><td><div class="table-name"><span class="table-avatar">${D.html(c.name[0])}</span><div><b>${D.html(c.name)}</b><small>${D.html(c.id)}</small></div></div></td><td>${D.html(c.examType)}</td><td>${status(c)}</td><td>${c.booking ? D.formatDate(c.booking.date, {day:'2-digit', month:'short'}) : '—'}</td><td><a class="table-link" href="${link(c)}">${c.booking ? 'Ver / reagendar' : 'Agendar'} →</a></td></tr>`).join('') || '<tr><td colspan="5" class="table-empty">Nenhuma convocação encontrada.</td></tr>'}</tbody></table></div>`;
  }
  function toolbar(full = false) {
    return `<div class="panel-header"><div><h2>${full ? 'Todas as convocações' : 'Convocações recentes'}</h2><p>Acompanhamento demonstrativo do fluxo de atendimento</p></div><div class="panel-actions">${full ? '<button class="btn btn-primary btn-sm" data-action="new">＋ Nova convocação</button>' : '<button class="btn btn-outline btn-sm" data-action="all">Ver todas →</button>'}</div></div>`;
  }
  function overview() {
    const list = D.load().convocations;
    return `${stats()}<div class="alert-soft"><div class="alert-symbol">✦</div><div><strong>Bem-vinda à demonstração!</strong><p>Este painel reproduz um fluxo conceitual de convocações. As alterações são locais e não afetam sistemas, agendas ou pacientes reais.</p></div><a href="./index.html">Abrir portal ↗</a></div><section class="data-panel">${toolbar(false)}${table(list.slice(0,5))}</section>`;
  }
  function convocations() {
    let list = D.load().convocations;
    if (filter === 'pending') list = list.filter(c => !c.booking);
    if (filter === 'booked') list = list.filter(c => c.booking);
    if (search) list = list.filter(c => `${c.name} ${c.id} ${c.examType}`.toLowerCase().includes(search));
    return `<section class="data-panel">${toolbar(true)}<div class="filter-row"><label class="search-field"><span>⌕</span><input type="search" id="search-field" placeholder="Buscar colaborador ou código..." value="${D.html(search)}" aria-label="Buscar convocação"></label><label class="filter-select"><select id="filter-select" aria-label="Filtrar status"><option value="all" ${filter === 'all' ? 'selected' : ''}>Todos os status</option><option value="pending" ${filter === 'pending' ? 'selected' : ''}>Pendentes</option><option value="booked" ${filter === 'booked' ? 'selected' : ''}>Agendados</option></select></label></div>${table(list)}<div class="table-bottom">Mostrando ${list.length} registro(s) fictício(s).</div></section>`;
  }
  function integrations() {
    return `<div class="integration-grid"><section class="data-panel inset-panel"><div class="feature-icon">⇄</div><h2>Simulação REST + SOAP</h2><p class="feature-text">Exemplo de evento de convocação normalizado em JSON e transformado em um envelope SOAP ilustrativo, sem contato com um sistema externo.</p><div class="code-label">REQUISIÇÃO DE EXEMPLO</div><pre class="code-box">${D.html(JSON.stringify(SAMPLE, null, 2))}</pre><button class="btn btn-primary" data-action="preview">Testar API simulada →</button><div id="api-result" class="api-result" aria-live="polite"></div></section><div class="integration-side"><section class="data-panel small-feature"><span class="tech-label">n8n</span><h3>Orquestração visual</h3><p>Modelo de workflow importável disponível em <code>workflows/</code>, com webhook e chamada HTTP de demonstração.</p></section><section class="data-panel small-feature"><span class="tech-label">SUPABASE</span><h3>Estrutura de persistência</h3><p>Exemplo de esquema SQL em <code>supabase/</code>, com RLS habilitada por padrão. Não utilizado pelo painel público.</p></section><section class="data-panel small-feature"><span class="tech-label">HMAC / TOKENS</span><h3>Exemplo de autenticação</h3><p>Endpoint opcional para assinatura e validação de IDs opacos, sem informações pessoais no token.</p></section></div></div>`;
  }
  function about() {
    return `<section class="data-panel about-panel"><div class="feature-icon">⌘</div><h2>Automação de convocações e agendamentos ocupacionais</h2><p>Projeto experimental apresentado como demonstração independente e com dados inteiramente fictícios. O objetivo é evidenciar a lógica de um fluxo de integração e agendamento de exames ocupacionais.</p><div class="about-tags"><span>JavaScript</span><span>Node.js</span><span>REST / SOAP</span><span>Vercel</span><span>Supabase (modelo)</span><span>n8n (exemplo)</span></div><div class="about-divider"></div><h3>O que esta demonstração permite testar</h3><div class="about-grid"><div><b>01 / Convocações</b><p>Consulte registros fictícios e crie novos exemplos para testar a interface.</p></div><div><b>02 / Agendamento</b><p>Escolha clínica, data e horário de exemplo. O resultado fica no navegador.</p></div><div><b>03 / Integrações</b><p>Inspecione um contrato JSON e um envelope SOAP simulado.</p></div><div><b>04 / Estrutura técnica</b><p>Consulte o código de API, validações, tokens e SQL demonstrativo.</p></div></div><div class="notice"><span>ⓘ</span><p>O desenvolvimento experimental original foi encerrado após o sistema utilizado disponibilizar funcionalidade equivalente. Esta versão foi reimplementada para fins educacionais e de portfólio, sem código operacional ou dados de terceiros.</p></div></section>`;
  }
  function render() {
    const pages = { overview: ['Visão geral', 'Acompanhe as convocações e os agendamentos simulados neste navegador.'], convocations: ['Convocações', 'Gerencie os registros fictícios e acompanhe os agendamentos demonstrativos.'], integrations: ['Integrações', 'Explore exemplos de contratos, orquestração e comunicação entre sistemas.'], about: ['Sobre o projeto', 'Entenda o contexto, os objetivos e o escopo desta versão de portfólio.'] };
    document.querySelector('#tab-title').textContent = pages[tab][0];
    document.querySelector('#page-title').textContent = pages[tab][0];
    document.querySelector('#page-description').textContent = pages[tab][1];
    document.querySelectorAll('[data-tab]').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
    area.innerHTML = ({ overview, convocations, integrations, about })[tab]();
  }
  document.querySelectorAll('[data-tab]').forEach(btn => btn.addEventListener('click', () => { tab = btn.dataset.tab; render(); }));
  document.querySelector('#reset-button').addEventListener('click', () => {
    if (!confirm('Reiniciar os dados fictícios armazenados neste navegador?')) return;
    D.reset(); filter = 'all'; search = ''; render(); toast('Demonstração reiniciada.');
  });
  area.addEventListener('input', event => {
    if (event.target.id === 'search-field') {
      search = event.target.value.toLowerCase().trim();
      // Mantém o campo e o foco enquanto atualiza somente a tabela.
      const list = D.load().convocations.filter(c => (filter === 'all' || (filter === 'pending' ? !c.booking : !!c.booking)) && `${c.name} ${c.id} ${c.examType}`.toLowerCase().includes(search));
      const tableWrap = area.querySelector('.table-wrap');
      if (tableWrap) tableWrap.outerHTML = table(list);
      const total = area.querySelector('.table-bottom'); if (total) total.textContent = `Mostrando ${list.length} registro(s) fictício(s).`;
    }
  });
  area.addEventListener('change', event => { if (event.target.id === 'filter-select') { filter = event.target.value; render(); } });
  area.addEventListener('click', async event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'all') { tab = 'convocations'; render(); }
    if (action === 'new') dialog.showModal();
    if (action === 'preview') {
      const el = area.querySelector('#api-result');
      el.textContent = 'Chamando API de demonstração...';
      try {
        const result = await fetch('./api/integration-preview', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(SAMPLE) });
        if (!result.ok) throw new Error('API não disponível (execute npm start ou publique na Vercel).');
        const data = await result.json();
        el.innerHTML = `<span class="api-success">✓ Simulação executada — nenhuma chamada externa realizada</span><pre class="code-box code-output">${D.html(data.soapEnvelope)}</pre>`;
      } catch (error) { el.innerHTML = `<span class="api-error">${D.html(error.message)}. A interface continua funcionando sem backend.</span>`; }
    }
  });
  document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
  document.querySelector('#cancel-dialog').addEventListener('click', () => dialog.close());
  document.querySelector('#create-form').addEventListener('submit', event => {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    try { D.create({ name: fields.get('name'), examType: fields.get('examType'), unit: fields.get('unit') }); dialog.close(); event.currentTarget.reset(); tab = 'convocations'; filter = 'all'; search = ''; render(); toast('Convocação fictícia criada.'); }
    catch (error) { toast(error.message); }
  });
  render();
})();
