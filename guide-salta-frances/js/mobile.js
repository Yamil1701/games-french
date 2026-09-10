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
