(() => {
  const $ = id => document.getElementById(id);
  const mapPanel = document.querySelector('#gameScreen .map-panel');
  if (!mapPanel) return;

  const isMobile = () => window.matchMedia('(max-width: 720px)').matches;
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) viewport.content = 'width=device-width,initial-scale=1,viewport-fit=cover';

  // Inject mobile-only controls without changing the desktop structure.
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

  function scrollToMap(){
    mapPanel.scrollIntoView({behavior:'smooth', block:'start'});
  }

  function setExpanded(expanded){
    mapPanel.classList.toggle('expanded-map', expanded);
    document.body.classList.toggle('map-expanded', expanded);
    expandBtn.setAttribute('aria-pressed', String(expanded));
  }

  expandBtn.addEventListener('click', () => setExpanded(true));
  closeBtn.addEventListener('click', () => setExpanded(false));
  peekBtn.addEventListener('click', scrollToMap);
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mapPanel.classList.contains('expanded-map')) setExpanded(false);
  });
  window.addEventListener('resize', () => {
    if (!isMobile() && mapPanel.classList.contains('expanded-map')) setExpanded(false);
  });

  function activateStep(container, index){
    if (!container) return;
    const steps = [...container.querySelectorAll('.walk-step')];
    if (!steps.length) return;
    const safe = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, i) => step.classList.toggle('active', i === safe));
    if (isMobile()) steps[safe]?.scrollIntoView({behavior:'smooth', block:'nearest', inline:'center'});
  }

  // Wrap the existing route animation: on mobile the map comes into view and
  // each route card is highlighted as the suitcase progresses.
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
        const total = Math.max(duration, (points?.length || 1) * 280);
        timer = setInterval(() => {
          i = Math.min(i + 1, steps.length - 1);
          activateStep(stepContainer, i);
          if (i >= steps.length - 1 && timer) clearInterval(timer);
        }, Math.max(280, total / steps.length));
      }

      try {
        return await originalAnimate(marker, points, duration);
      } finally {
        if (timer) clearInterval(timer);
        activateStep(stepContainer, Math.max(0, steps.length - 1));
      }
    };
  }
})();

/* Pedagogical reference cards + less predictable answer sets. */
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

  const patch = (level, index, changes) => {
    const q = LEVELS[level]?.questions?.[index];
    if (q) Object.assign(q, changes);
  };
  const options = (level, index, list) => patch(level, index, {options:list, correct:0});

  // Nivel 1: introducir calles y referencias concretas desde el comienzo.
  options(0,0,[
    "Depuis la Plaza, traversez la rue España. La cathédrale est juste en face.",
    "Depuis la Plaza, traversez la rue Caseros. La cathédrale est juste en face.",
    "Depuis la Plaza, suivez la rue Mitre jusqu'à Caseros. La cathédrale est à côté."
  ]);
  patch(0,1,{
    question:"Vous êtes devant la cathédrale. Comment aller au MAAM ?",
    translation:"Está frente a la Catedral. ¿Cómo va al MAAM?",
    prompt:"Suivez la rue España jusqu'à la rue Mitre, puis tournez ___ .",
    options:["à droite","à gauche","tout droit"],
    correct:0,
    hint:"La indicación debe nombrar España y Mitre antes del giro.",
    help:["jusqu'à","tournez","à droite","à gauche"]
  });
  options(0,3,[
    "Depuis la Plaza, allez jusqu'à la rue Zuviría. Le théâtre est de ce côté.",
    "Depuis la Plaza, allez jusqu'à la rue Mitre. Le théâtre est de ce côté.",
    "Depuis la Plaza, suivez Caseros jusqu'à Córdoba. Le théâtre est de ce côté."
  ]);
  options(0,7,[
    "Depuis la Plaza, suivez la rue Mitre vers le sud et continuez jusqu'au Mercado San Miguel.",
    "Depuis la Plaza, suivez la rue Zuviría vers le sud et continuez jusqu'au Mercado San Miguel.",
    "Depuis la Plaza, prenez la rue Caseros vers l'est et continuez jusqu'au Mercado San Miguel."
  ]);
  options(0,9,[
    "Traversez la rue España et continuez jusqu'à la Plaza 9 de Julio.",
    "Traversez la rue Caseros et continuez jusqu'à la Plaza 9 de Julio.",
    "Suivez la rue Zuviría et continuez jusqu'à la Plaza 9 de Julio."
  ]);

  // Nivel 2: conservar preposiciones, pero con distractores de longitud equivalente.
  options(1,1,[
    "La Plaza est en face du Cabildo, de l'autre côté de la rue Caseros.",
    "La Plaza est derrière le Cabildo, de l'autre côté de la rue Caseros.",
    "La Plaza est à côté du Mercado, de l'autre côté de la rue Caseros."
  ]);
  options(1,3,[
    "Le théâtre est à l'est de la Plaza, du côté de la rue Zuviría.",
    "Le théâtre est à l'ouest de la Plaza, du côté de la rue Mitre.",
    "Le théâtre est au sud de la Plaza, du côté de la rue Caseros."
  ]);
  options(1,4,[
    "Non, la Plaza est juste à côté du MAAM, près de la rue Mitre.",
    "Non, la Plaza est juste à côté du MAAM, près de la rue Córdoba.",
    "Oui, la Plaza est assez loin du MAAM, près de la rue Lerma."
  ]);
  options(1,7,[
    "Depuis le théâtre, la Plaza est à l'ouest, vers le centre historique.",
    "Depuis le théâtre, la Plaza est à l'est, vers San Francisco.",
    "Depuis le théâtre, la Plaza est au sud, vers le Mercado San Miguel."
  ]);
  options(1,8,[
    "Oui. Le Cabildo est au sud de la Plaza, sur la rue Caseros.",
    "Oui. Le Cabildo est au nord de la Plaza, sur la rue España.",
    "Oui. Le Cabildo est à l'est de la Plaza, sur la rue Zuviría."
  ]);

  // Nivel 3: las respuestas compiten por calles y cruces, no por longitud.
  options(2,0,[
    "Depuis la Plaza, suivez la rue Mitre vers le sud et continuez jusqu'au Mercado San Miguel.",
    "Depuis la Plaza, suivez la rue Zuviría vers le sud et continuez jusqu'au Mercado San Miguel.",
    "Depuis la Plaza, prenez la rue Caseros vers l'est et continuez jusqu'au Mercado San Miguel."
  ]);
  options(2,1,[
    "Depuis la Plaza, suivez la rue Caseros vers l'est, passez Córdoba et continuez jusqu'à San Francisco.",
    "Depuis la Plaza, suivez la rue España vers l'est, passez Córdoba et continuez jusqu'à San Francisco.",
    "Depuis la Plaza, suivez la rue Caseros vers l'ouest, passez Mitre et continuez jusqu'à San Francisco."
  ]);
  options(2,3,[
    "Traversez la rue España, traversez la Plaza 9 de Julio et continuez jusqu'à la rue Caseros.",
    "Traversez la rue España, suivez la rue Mitre vers le nord et continuez jusqu'à la rue Caseros.",
    "Traversez la rue Caseros, traversez la Plaza 9 de Julio et continuez jusqu'à la rue España."
  ]);
  options(2,4,[
    "Le téléphérique est plus loin. Prenez le bus et descendez près de l'entrée.",
    "Le téléphérique est plus loin. Prenez le bus et descendez près du Mercado.",
    "Le téléphérique est plus loin. Prenez le bus et descendez près du Cabildo."
  ]);
  options(2,7,[
    "Prenez un taxi jusqu'au centre et descendez près de la Plaza 9 de Julio.",
    "Prenez un taxi jusqu'au Mercado et continuez ensuite vers le sud.",
    "Prenez un taxi jusqu'à San Francisco et continuez ensuite vers l'est."
  ]);
  options(2,9,[
    "À vélo, suivez l'itinéraire vers le téléphérique; ce n'est pas très loin.",
    "À vélo, suivez Caseros vers l'ouest; le téléphérique est près du Cabildo.",
    "À vélo, suivez Mitre vers le sud; le téléphérique est près du Mercado."
  ]);

  // Nivel 4: indicaciones completas con alternativas igualmente plausibles.
  options(3,0,[
    "Depuis la Plaza, suivez Caseros vers l'est, passez Córdoba et continuez jusqu'à San Francisco.",
    "Depuis la Plaza, suivez España vers l'est, passez Córdoba et continuez jusqu'à San Francisco.",
    "Depuis la Plaza, suivez Caseros vers l'ouest, passez Mitre et continuez jusqu'à San Francisco."
  ]);
  options(3,3,[
    "Depuis la cathédrale, traversez la rue España, traversez la Plaza puis continuez jusqu'à Caseros.",
    "Depuis la cathédrale, traversez la rue Caseros, traversez la Plaza puis continuez jusqu'à España.",
    "Depuis la cathédrale, suivez la rue Zuviría, passez la Plaza puis continuez jusqu'à Córdoba."
  ]);
  options(3,5,[
    "Depuis le téléphérique, revenez vers Zuviría et continuez jusqu'au théâtre.",
    "Depuis le téléphérique, revenez vers Córdoba et continuez jusqu'au théâtre.",
    "Depuis le téléphérique, revenez vers Mitre et continuez jusqu'au théâtre."
  ]);
  options(3,6,[
    "Le marché est un peu plus loin, mais on peut suivre Mitre à pied jusqu'au Mercado.",
    "Le marché est tout près; traversez España et continuez à pied jusqu'au Mercado.",
    "Le marché est un peu plus loin; suivez Zuviría à pied jusqu'au Mercado."
  ]);
  options(3,7,[
    "Je conseille le bus: le trajet est plus long et direct depuis le centre.",
    "Je conseille d'aller à pied: le trajet est très court depuis la Plaza.",
    "Je conseille le vélo: le téléphérique est juste à côté du Cabildo."
  ]);
  options(3,9,[
    "Depuis le Cabildo, traversez Caseros, traversez la Plaza puis traversez España vers la cathédrale.",
    "Depuis le Cabildo, traversez España, traversez la Plaza puis traversez Caseros vers la cathédrale.",
    "Depuis le Cabildo, suivez Zuviría, traversez la Plaza puis continuez vers Córdoba jusqu'à la cathédrale."
  ]);

  if (typeof FREE_ROUTES !== 'undefined') {
    Object.assign(FREE_ROUTES, {
      "catedral-cabildo":"Depuis la cathédrale, traversez la rue España, traversez la Plaza 9 de Julio et continuez jusqu'à la rue Caseros. Le Cabildo est en face.",
      "catedral-maam":"Depuis la cathédrale, suivez la rue España jusqu'à la rue Mitre, puis tournez à droite. Le MAAM est à côté de la Plaza.",
      "cabildo-catedral":"Depuis le Cabildo, traversez la rue Caseros, traversez la Plaza 9 de Julio puis traversez la rue España. La cathédrale est en face.",
      "plaza-sanfran":"Depuis la Plaza, suivez la rue Caseros vers l'est, passez la rue Córdoba et continuez jusqu'à San Francisco.",
      "sanfran-plaza":"Depuis San Francisco, suivez la rue Caseros vers l'ouest jusqu'à la Plaza 9 de Julio."
    });
  }

  const groups = [
    {
      title:"Indications",
      entries:[
        ["🚉","La gare","estación de tren"],
        ["↱","Tournez à droite","doble a la derecha"],
        ["↰","Tournez à gauche","doble a la izquierda"],
        ["↑","Continuez tout droit","continúe todo derecho"],
        ["📍","En face de","enfrente de"],
        ["?","Où est… ?","¿dónde está…?"],
        ["🙏","Excusez-moi","disculpe"],
        ["🙂","Ce n'est pas loin","no está lejos"],
        ["✓","Je vous en prie","de nada / con gusto"]
      ]
    },
    {
      title:"Prépositions",
      entries:[
        ["📌","Près de","cerca de"],
        ["↔","Loin de","lejos de"],
        ["⟳","Autour de","alrededor de"],
        ["↑","Au-dessus de","encima de"],
        ["↓","Au-dessous de","debajo de"],
        ["□","Dedans","dentro"],
        ["📍","En face de","enfrente de"],
        ["◀","Derrière","detrás de"],
        ["●●","À côté de","al lado de"],
        ["→","À droite","a la derecha"],
        ["←","À gauche","a la izquierda"]
      ]
    },
    {
      title:"Bonus",
      entries:[
        ["▲","Au nord","al norte"],
        ["▼","Au sud","al sur"],
        ["→","À l'est","al este"],
        ["←","À l'ouest","al oeste"],
        ["📏","À environ 5 mètres","a unos 5 metros"],
        ["🗺️","À 2 rues d'ici","a dos calles de aquí"],
        ["🚶","À pied","a pie"],
        ["🚌","En bus","en colectivo"],
        ["🚲","À vélo","en bicicleta"]
      ]
    }
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
    @media(max-width:760px){
      .reference-grid{grid-template-columns:1fr;gap:9px}
      .reference-column{padding:9px}
      .reference-list{grid-template-columns:1fr 1fr}
      .reference-item{grid-template-columns:30px 1fr;padding:7px}.reference-audio{display:none}
      .answer-btn{min-height:74px}
    }
    @media(max-width:460px){.reference-list{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  if (!document.getElementById('referenceModal')) {
    const dialog = document.createElement('dialog');
    dialog.className = 'modal wide-modal';
    dialog.id = 'referenceModal';
    dialog.innerHTML = `
      <form method="dialog" class="modal-card">
        <button class="modal-close" value="close" aria-label="Cerrar">×</button>
        <span class="mini-label">EXPRESSIONS UTILES</span>
        <h2>Pour donner des indications</h2>
        <p class="muted">Tocá una tarjeta para escucharla en francés.</p>
        <div class="reference-grid">
          ${groups.map(group => `
            <section class="reference-column">
              <h3>${group.title}</h3>
              <div class="reference-list">
                ${group.entries.map(([icon,fr,es]) => `
                  <button type="button" class="reference-item" data-speak="${fr.replaceAll('"','&quot;')}">
                    <span class="reference-icon">${icon}</span>
                    <span class="reference-copy"><b>${fr}</b><small>${es}</small></span>
                    <span class="reference-audio">🔊</span>
                  </button>`).join('')}
              </div>
            </section>`).join('')}
        </div>
      </form>`;
    document.body.appendChild(dialog);

    dialog.querySelectorAll('[data-speak]').forEach(btn => {
      btn.addEventListener('click', () => {
        const result = window.AudioFR?.speak?.(btn.dataset.speak, .78);
        if (result && !result.ok) document.getElementById('audioModal')?.showModal();
      });
    });

    const refBtn = document.createElement('button');
    refBtn.className = 'icon-btn';
    refBtn.type = 'button';
    refBtn.title = 'Expressions utiles';
    refBtn.setAttribute('aria-label','Abrir expresiones útiles');
    refBtn.textContent = '📘';
    refBtn.addEventListener('click', () => dialog.showModal());
    document.querySelector('.top-actions')?.prepend(refBtn);

    const helpQuick = document.createElement('button');
    helpQuick.className = 'soft-btn';
    helpQuick.type = 'button';
    helpQuick.textContent = '📘 Expressions';
    helpQuick.addEventListener('click', () => dialog.showModal());
    const hint = document.getElementById('hintBtn');
    hint?.parentElement?.insertBefore(helpQuick, hint);
  }
})();
