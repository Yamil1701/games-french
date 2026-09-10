(() => {
  const $ = id => document.getElementById(id);

  const homeScreen = $("homeScreen");
  const gameScreen = $("gameScreen");
  const freeWalkScreen = $("freeWalkScreen");
  const levelGrid = $("levelGrid");

  let currentLevel = 0;
  let currentIndex = 0;
  let score = 0;
  let answered = false;
  let wrongAttempts = 0;

  // ---------- HOME ----------
  LEVELS.forEach((level,i)=>{
    const btn = document.createElement("button");
    btn.className = "level-card";
    btn.innerHTML = `
      <span class="level-number">${i+1}</span>
      <h3>${level.title}</h3>
      <p>${level.description}</p>
      <div class="level-meta">
        <span>10 situations</span>
        ${level.tags.map(t=>`<span>${t}</span>`).join("")}
      </div>
    `;
    btn.onclick = ()=>startLevel(i);
    levelGrid.appendChild(btn);
  });

  function showScreen(screen){
    [homeScreen,gameScreen,freeWalkScreen].forEach(el=>el.classList.add("hidden"));
    screen.classList.remove("hidden");
  }

  function startLevel(i){
    currentLevel=i;
    currentIndex=0;
    score=0;
    answered=false;
    showScreen(gameScreen);
    renderQuestion();
  }

  $("backHomeBtn").onclick=()=>showScreen(homeScreen);

  // ---------- QUESTION ----------
  function currentQ(){ return LEVELS[currentLevel].questions[currentIndex]; }

  function proximityLabel(p,meters){
    if(p==="loin" || meters>=900) return "🔴 loin";
    if(p==="moyen" || meters>=450) return "🟡 pas très loin";
    return "🟢 près";
  }

  function renderQuestion(){
    const q=currentQ();
    answered=false;
    wrongAttempts=0;

    $("levelBadge").textContent=`Niveau ${currentLevel+1} · ${LEVELS[currentLevel].title}`;
    $("progressText").textContent=`${currentIndex+1} / 10`;
    $("progressFill").style.width=`${currentIndex*10}%`;
    $("questionText").textContent=q.question;
    $("translationText").textContent=q.translation;
    $("translationText").classList.add("hidden");
    $("translationToggle").textContent="🇪🇸 Ver traducción";

    $("routeChip").textContent=`📍 ${PLACES[q.from].short} → ${PLACES[q.to].short}`;
    $("distanceChip").textContent=q.meters>=1000?`≈ ${(q.meters/1000).toFixed(1).replace(".",",")} km`:`≈ ${q.meters} m`;
    $("transportChip").textContent=TRANSPORT[q.transport].es;
    $("proximityChip").textContent=proximityLabel(q.proximity,q.meters);
    $("scoreText").textContent=`⭐ ${score}`;

    $("feedback").className="feedback";
    $("feedback").textContent="Mirá dónde está la valijita y dónde está el destino.";
    $("nextBtn").disabled=true;

    GameMap.clearRoute($("routeLine"));
    GameMap.setMarker($("suitcaseMarker"),q.from);
    GameMap.setMarker($("destinationMarker"),q.to);
    $("walkSteps").classList.add("hidden");
    $("walkStepsList").innerHTML="";

    renderAnswers(q);
    buildHelp(q);
  }

  function shuffle(arr){
    return arr.map((x,i)=>({x,r:Math.random(),i})).sort((a,b)=>a.r-b.r);
  }

  function renderWalkSteps(steps,target){
    target.innerHTML=steps.map((step,i)=>{
      const cls=step.type==="crossing" ? " crossing" : step.type==="place" ? " place-cross" : "";
      const icon=step.type==="crossing" ? "↔" : step.type==="place" ? "🌳" : step.type==="arrival" ? "★" : "→";
      return `
        <div class="walk-step${cls}">
          <span class="walk-step-num">${icon}</span>
          <span><b>${step.es}</b><small>${step.fr}</small></span>
        </div>
      `;
    }).join("");
  }

  function renderAnswers(q){
    const box=$("answers");
    box.innerHTML="";
    box.className=q.type==="fill"?"answers word-answer":"answers";

    shuffle(q.options).forEach(item=>{
      const btn=document.createElement("button");
      btn.className="answer-btn";
      btn.textContent=item.x;
      btn.onclick=()=>selectAnswer(item.i,btn);
      box.appendChild(btn);
    });

    if(q.type==="fill"){
      const prompt=document.createElement("div");
      prompt.className="feedback";
      prompt.style.marginTop="0";
      prompt.style.marginBottom="8px";
      prompt.innerHTML=`<b>${q.prompt}</b>`;
      box.prepend(prompt);
    }
  }

  async function selectAnswer(originalIndex,btn){
    if(answered) return;
    const q=currentQ();

    if(originalIndex===q.correct){
      answered=true;
      btn.classList.add("correct");
      document.querySelectorAll(".answer-btn").forEach(b=>b.disabled=true);

      const gain=wrongAttempts===0?10:wrongAttempts===1?7:5;
      score+=gain;
      $("scoreText").textContent=`⭐ ${score}`;
      $("feedback").className="feedback good";
      $("feedback").innerHTML=`✅ <b>Très bien ! +${gain}</b> Ahora mirá el recorrido.`;
      $("nextBtn").disabled=false;

      const route=GameMap.showRoute($("routeLine"),q.from,q.to);
      renderWalkSteps(route.steps,$("walkStepsList"));
      $("walkSteps").classList.remove("hidden");
      await GameMap.animateSuitcase($("suitcaseMarker"),route.points,1500);
    }else{
      wrongAttempts++;
      btn.classList.add("wrong");
      btn.disabled=true;
      $("feedback").className="feedback bad";
      $("feedback").innerHTML="❌ Esa no es. Podés probar otra respuesta.";
    }
  }

  $("nextBtn").onclick=()=>{
    currentIndex++;
    if(currentIndex>=10){
      finishLevel();
    }else{
      renderQuestion();
    }
  };

  $("hintBtn").onclick=()=>{
    $("feedback").className="feedback";
    $("feedback").innerHTML=`💡 <b>Pista:</b> ${currentQ().hint}`;
  };

  $("translationToggle").onclick=()=>{
    const el=$("translationText");
    const hidden=el.classList.toggle("hidden");
    $("translationToggle").textContent=hidden?"🇪🇸 Ver traducción":"Ocultar traducción";
  };

  function buildHelp(q){
    const terms=[...new Set(q.help)];
    $("helpContent").innerHTML=terms.map(term=>{
      const meaning=VOCAB[term] || "";
      return `<div class="help-item"><b>${term}</b>${meaning}</div>`;
    }).join("") || `<div class="help-item">Observá la posición relativa de la valijita y el destino.</div>`;
  }

  $("helpBtn").onclick=()=>$("helpModal").showModal();

  // ---------- AUDIO ----------
  function openAudioSettings(){
    AudioFR.populate($("voiceSelect"),$("audioStatus"));
    $("audioModal").showModal();
  }
  $("audioSettingsBtn").onclick=openAudioSettings;
  $("voiceSelect").onchange=e=>AudioFR.choose(e.target.value);

  function speakOrSettings(text,rate=.82){
    const result=AudioFR.speak(text,rate);
    if(!result.ok) openAudioSettings();
  }

  $("listenBtn").onclick=()=>speakOrSettings(currentQ().speak,.82);

  // ---------- RESULTS ----------
  function finishLevel(){
    $("progressFill").style.width="100%";
    const max=100;
    const pct=score/max;
    $("resultTitle").textContent=LEVELS[currentLevel].title;
    $("resultScore").textContent=`${score} / ${max}`;
    $("resultStars").textContent=pct>=.85?"⭐⭐⭐":pct>=.6?"⭐⭐":"⭐";
    $("resultCopy").textContent=pct>=.85
      ?"Muy buen dominio de este nivel."
      : pct>=.6
      ?"Buen avance. Repetir algunas situaciones puede ayudarte a fijar el vocabulario."
      :"Conviene repetir el nivel usando las pistas y la ayuda contextual.";
    $("resultModal").showModal();
  }

  $("repeatBtn").onclick=(e)=>{
    e.preventDefault();
    $("resultModal").close();
    startLevel(currentLevel);
  };

  $("nextLevelBtn").onclick=(e)=>{
    e.preventDefault();
    $("resultModal").close();
    if(currentLevel<LEVELS.length-1) startLevel(currentLevel+1);
    else showScreen(homeScreen);
  };

  // ---------- EXPLORE MODAL ----------
  Object.entries(PLACES).forEach(([id,p])=>{
    const b=document.createElement("button");
    b.type="button";
    b.className="explore-place";
    b.textContent=p.name;
    b.onclick=()=>{
      $("placeDetail").innerHTML=`
        <b>${p.name}</b>
        ${p.name} est <strong>${p.relation}</strong>.<br>
        <span class="muted">Repère: rue ${p.street}</span>
      `;
    };
    $("explorePlaces").appendChild(b);
  });
  $("exploreBtn").onclick=()=>$("exploreModal").showModal();

  $("resetMapBtn").onclick=()=>{
    const q=currentQ();
    GameMap.setMarker($("suitcaseMarker"),q.from);
    GameMap.setMarker($("destinationMarker"),q.to);
    GameMap.clearRoute($("routeLine"));
    $("walkSteps").classList.add("hidden");
    $("walkStepsList").innerHTML="";
  };

  // ---------- FREE WALK ----------
  const freeFrom=$("freeFrom"), freeTo=$("freeTo");
  Object.entries(PLACES).forEach(([id,p])=>{
    const a=document.createElement("option");
    a.value=id;a.textContent=p.name;freeFrom.appendChild(a);
    const b=a.cloneNode(true);freeTo.appendChild(b);
  });
  freeFrom.value="plaza";freeTo.value="sanfran";

  $("freeWalkBtn").onclick=()=>{
    showScreen(freeWalkScreen);
    updateFreeMarkers();
    GameMap.clearRoute($("freeRouteLine"));
    $("freeResult").classList.add("hidden");
    $("freeWalkSteps").innerHTML="";
  };
  $("freeBackBtn").onclick=()=>showScreen(homeScreen);

  function updateFreeMarkers(){
    GameMap.setMarker($("freeSuitcase"),freeFrom.value);
    GameMap.setMarker($("freeDestination"),freeTo.value);
  }
  freeFrom.onchange=updateFreeMarkers;
  freeTo.onchange=updateFreeMarkers;

  function genericFreePhrase(from,to){
    const a=PLACES[from],b=PLACES[to];
    const dx=b.x-a.x, dy=b.y-a.y;
    let parts=[`Depuis ${a.short}`];
    if(Math.abs(dx)>80) parts.push(dx>0?"allez vers l'est":"allez vers l'ouest");
    if(Math.abs(dy)>80) parts.push(dy>0?"puis vers le sud":"puis vers le nord");
    parts.push(`jusqu'à ${b.short}.`);
    return parts.join(", ");
  }

  $("buildRouteBtn").onclick=async()=>{
    const from=freeFrom.value,to=freeTo.value;
    if(from===to){
      $("freeResult").classList.remove("hidden");
      $("freePhrase").textContent="Choisissez deux lieux différents.";
      return;
    }
    updateFreeMarkers();
    const key=`${from}-${to}`;
    const phrase=FREE_ROUTES[key] || genericFreePhrase(from,to);
    $("freePhrase").textContent=phrase;
    $("freeResult").classList.remove("hidden");
    const route=GameMap.showRoute($("freeRouteLine"),from,to);
    renderWalkSteps(route.steps,$("freeWalkSteps"));
    await GameMap.animateSuitcase($("freeSuitcase"),route.points,1550);
  };

  $("freeListenBtn").onclick=()=>speakOrSettings($("freePhrase").textContent,.82);
  $("freeSlowBtn").onclick=()=>speakOrSettings($("freePhrase").textContent,.62);

  // Carga inicial de voces sin bloquear UI
  setTimeout(()=>AudioFR.refreshVoices(),400);
})();
