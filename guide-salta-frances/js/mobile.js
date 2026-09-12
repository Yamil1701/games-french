(() => {
  const $ = id => document.getElementById(id);
  const mapPanel = document.querySelector('#gameScreen .map-panel');
  if (!mapPanel) return;

  const isMobile = () => window.matchMedia('(max-width: 720px)').matches;
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) viewport.content = 'width=device-width,initial-scale=1,viewport-fit=cover';

  const toolbarRight = mapPanel.querySelector('.map-toolbar-right');
  const expandBtn = document.createElement('button');
  expandBtn.className = 'soft-btn mobile-map-toggle';
  expandBtn.type = 'button';
  expandBtn.innerHTML = '⛶ Ampliar';
  expandBtn.setAttribute('aria-pressed', 'false');
  toolbarRight?.insertBefore(expandBtn, toolbarRight.querySelector('#resetMapBtn'));

  const closeBtn = document.createElement('button');
  closeBtn.className = 'map-close-fab';
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Cerrar mapa ampliado');
  closeBtn.textContent = '×';
  mapPanel.appendChild(closeBtn);

  const peekBtn = document.createElement('button');
  peekBtn.className = 'mobile-map-peek';
  peekBtn.type = 'button';
  peekBtn.textContent = '🗺️ Ver mapa arriba';
  document.querySelector('#gameScreen .progress-row')?.after(peekBtn);

  function scrollToMap(){ mapPanel.scrollIntoView({behavior:'smooth', block:'start'}); }
  function setExpanded(expanded){
    mapPanel.classList.toggle('expanded-map', expanded);
    document.body.classList.toggle('map-expanded', expanded);
    expandBtn.setAttribute('aria-pressed', String(expanded));
  }

  expandBtn.addEventListener('click', () => setExpanded(true));
  closeBtn.addEventListener('click', () => setExpanded(false));
  peekBtn.addEventListener('click', scrollToMap);
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && mapPanel.classList.contains('expanded-map')) setExpanded(false); });
  window.addEventListener('resize', () => { if (!isMobile() && mapPanel.classList.contains('expanded-map')) setExpanded(false); });

  function activateStep(container, index){
    if (!container) return;
    const steps = [...container.querySelectorAll('.walk-step')];
    if (!steps.length) return;
    const safe = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, i) => step.classList.toggle('active', i === safe));
    if (isMobile()) steps[safe]?.scrollIntoView({behavior:'smooth', block:'nearest', inline:'center'});
  }

  if (window.GameMap?.animateSuitcase) {
    const originalAnimate = window.GameMap.animateSuitcase.bind(window.GameMap);
    window.GameMap.animateSuitcase = async (marker, points, duration = 1500) => {
      const isFree = marker?.id === 'freeSuitcase';
      const stepContainer = isFree ? $('freeWalkSteps') : $('walkStepsList');
      const steps = stepContainer ? [...stepContainer.querySelectorAll('.walk-step')] : [];

      if (isMobile() && !isFree) {
        scrollToMap();
        await new Promise(resolve => setTimeout(resolve, 220));
      }

      let timer = null;
      if (steps.length > 1) {
        let i = 0;
        activateStep(stepContainer, 0);
        const total = Math.max(duration, (points?.length || 1) * 260);
        timer = setInterval(() => {
          i = Math.min(i + 1, steps.length - 1);
          activateStep(stepContainer, i);
          if (i >= steps.length - 1 && timer) clearInterval(timer);
        }, Math.max(260, total / steps.length));
      }

      try { return await originalAnimate(marker, points, duration); }
      finally {
        if (timer) clearInterval(timer);
        activateStep(stepContainer, Math.max(0, steps.length - 1));
      }
    };
  }
})();

/* Expressions utiles: referencia visual sin modificar preguntas ni respuestas. */
(() => {
  if (typeof LEVELS === 'undefined') return;

  const extraVocab = {
    "la gare":"la estación de tren",
    "tournez à droite":"doble a la derecha",
    "tournez à gauche":"doble a la izquierda",
    "continuez tout droit":"continúe todo derecho",
    "où est… ?":"¿dónde está…?",
    "excusez-moi":"disculpe",
    "ce n'est pas loin":"no está lejos",
    "je vous en prie":"de nada / con gusto",
    "autour de":"alrededor de",
    "au-dessus de":"encima de",
    "au-dessous de":"debajo de",
    "dedans":"dentro",
    "au nord":"al norte",
    "au sud":"al sur",
    "à l'est":"al este",
    "à l'ouest":"al oeste",
    "à 2 rues d'ici":"a dos calles de aquí"
  };
  if (typeof VOCAB !== 'undefined') Object.assign(VOCAB, extraVocab);

  const groups = [
    {title:"Indications", entries:[
      ["🚉","La gare","estación de tren"],["↱","Tournez à droite","doble a la derecha"],["↰","Tournez à gauche","doble a la izquierda"],
      ["↑","Continuez tout droit","continúe todo derecho"],["📍","En face de","enfrente de"],["?","Où est… ?","¿dónde está…?"],
      ["🙏","Excusez-moi","disculpe"],["🙂","Ce n'est pas loin","no está lejos"],["✓","Je vous en prie","de nada / con gusto"]
    ]},
    {title:"Prépositions", entries:[
      ["📌","Près de","cerca de"],["↔","Loin de","lejos de"],["⟳","Autour de","alrededor de"],["↑","Au-dessus de","encima de"],
      ["↓","Au-dessous de","debajo de"],["□","Dedans","dentro"],["📍","En face de","enfrente de"],["◀","Derrière","detrás de"],
      ["●●","À côté de","al lado de"],["→","À droite","a la derecha"],["←","À gauche","a la izquierda"]
    ]},
    {title:"Bonus", entries:[
      ["▲","Au nord","al norte"],["▼","Au sud","al sur"],["→","À l'est","al este"],["←","À l'ouest","al oeste"],
      ["📏","À environ 5 mètres","a unos 5 metros"],["🗺️","À 2 rues d'ici","a dos calles de aquí"],
      ["🚶","À pied","a pie"],["🚌","En bus","en colectivo"],["🚲","À vélo","en bicicleta"]
    ]}
  ];

  const style = document.createElement('style');
  style.textContent = `
    .reference-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:14px}
    .reference-column{background:#f8f4ec;border:1px solid #e7dccb;border-radius:15px;padding:10px}
    .reference-column h3{margin:0 0 8px;color:var(--navy);font-size:14px}
    .reference-list{display:grid;gap:6px}
    .reference-item{width:100%;display:grid;grid-template-columns:34px 1fr auto;align-items:center;gap:8px;border:1px solid #e6ded1;background:#fff;border-radius:10px;padding:8px;text-align:left;color:var(--ink)}
    .reference-item:hover{border-color:#b8a7df;background:#fcfaff}
    .reference-icon{width:30px;height:30px;display:grid;place-items:center;border-radius:9px;background:#eef3fb;color:#185aa7;font-weight:900;font-size:17px}
    .reference-copy b{display:block;font-size:12px;color:var(--navy);line-height:1.15}.reference-copy small{display:block;color:var(--muted);font-size:10px;margin-top:2px}
    .reference-audio{font-size:12px;color:#6d4fc4}
    .answer-btn{min-height:68px;display:flex;align-items:center}
    @media(max-width:760px){.reference-grid{grid-template-columns:1fr;gap:9px}.reference-column{padding:9px}.reference-list{grid-template-columns:1fr 1fr}.reference-item{grid-template-columns:30px 1fr;padding:7px}.reference-audio{display:none}.answer-btn{min-height:74px}}
    @media(max-width:460px){.reference-list{grid-template-columns:1fr}.reference-item{min-height:52px}}
  `;
  document.head.appendChild(style);

  const modal = document.createElement('dialog');
  modal.className = 'modal wide-modal';
  modal.id = 'referenceModal';
  modal.innerHTML = `
    <div class="modal-card">
      <button class="modal-close" type="button" aria-label="Cerrar">×</button>
      <span class="mini-label">POUR DONNER DES INDICATIONS</span>
      <h2>Expressions utiles</h2>
      <p class="muted">Tocá una tarjeta para escucharla en francés.</p>
      <div class="reference-grid">
        ${groups.map(g=>`<section class="reference-column"><h3>${g.title}</h3><div class="reference-list">${g.entries.map(([icon,fr,es])=>`
          <button class="reference-item" type="button" data-speak="${fr.replace(/"/g,'&quot;')}">
            <span class="reference-icon">${icon}</span><span class="reference-copy"><b>${fr}</b><small>${es}</small></span><span class="reference-audio">🔊</span>
          </button>`).join('')}</div></section>`).join('')}
      </div>
    </div>`;
  document.body.appendChild(modal);

  modal.querySelector('.modal-close').addEventListener('click',()=>modal.close());
  modal.addEventListener('click',e=>{ if(e.target===modal) modal.close(); });
  modal.querySelectorAll('[data-speak]').forEach(btn=>btn.addEventListener('click',()=>{
    if (!window.AudioFR) return;
    const result = AudioFR.speak(btn.dataset.speak,.78);
    if (!result?.ok) document.getElementById('audioSettingsBtn')?.click();
  }));

  const openReference = () => modal.showModal();

  const headerActions = document.querySelector('.top-actions');
  if (headerActions && !document.getElementById('referenceBtn')) {
    const btn = document.createElement('button');
    btn.id='referenceBtn'; btn.className='icon-btn'; btn.type='button'; btn.title='Expressions utiles'; btn.textContent='📘';
    btn.addEventListener('click',openReference);
    headerActions.prepend(btn);
  }

  const quizActions = document.querySelector('#gameScreen .quiz-actions');
  if (quizActions && !document.getElementById('referenceQuizBtn')) {
    const btn = document.createElement('button');
    btn.id='referenceQuizBtn'; btn.className='soft-btn'; btn.type='button'; btn.textContent='📘 Expressions';
    btn.addEventListener('click',openReference);
    quizActions.insertBefore(btn, quizActions.firstChild);
  }
})();