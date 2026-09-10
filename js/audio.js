window.AudioFR = (() => {
  let frenchVoices = [];
  let selectedVoice = null;

  function refreshVoices(){
    if(!("speechSynthesis" in window)) return [];
    const all = speechSynthesis.getVoices();
    frenchVoices = all.filter(v => /^fr(?:-|_)/i.test(v.lang || ""));
    if(!selectedVoice || !frenchVoices.some(v => v.name === selectedVoice.name)){
      selectedVoice =
        frenchVoices.find(v => /^fr-FR/i.test(v.lang) && /Microsoft|Google|Thomas|Denise|Henri|Hortense|Remy/i.test(v.name)) ||
        frenchVoices.find(v => /^fr-FR/i.test(v.lang)) ||
        frenchVoices[0] || null;
    }
    return frenchVoices;
  }

  function populate(select, status){
    const voices = refreshVoices();
    select.innerHTML = "";
    if(!("speechSynthesis" in window)){
      status.textContent = "Este navegador no ofrece síntesis de voz.";
      const opt = document.createElement("option");
      opt.textContent = "Sin soporte de voz";
      select.appendChild(opt);
      select.disabled = true;
      return;
    }
    if(!voices.length){
      status.innerHTML = "<b>No se detectó ninguna voz francesa instalada.</b> Para evitar una pronunciación incorrecta, la app no reproducirá el texto con otra voz.";
      const opt = document.createElement("option");
      opt.textContent = "No hay voces francesas";
      select.appendChild(opt);
      select.disabled = true;
      return;
    }
    select.disabled = false;
    voices.forEach((v,i)=>{
      const opt = document.createElement("option");
      opt.value = v.name;
      opt.textContent = `${v.name} — ${v.lang}`;
      if(selectedVoice && v.name === selectedVoice.name) opt.selected = true;
      select.appendChild(opt);
    });
    status.innerHTML = `<b>${voices.length} voz/ces francesa/s detectada/s.</b> La reproducción queda bloqueada a voces con locale francés.`;
  }

  function choose(name){
    refreshVoices();
    selectedVoice = frenchVoices.find(v => v.name === name) || frenchVoices[0] || null;
  }

  function speak(text, rate=.82){
    refreshVoices();
    if(!selectedVoice){
      return {ok:false, reason:"NO_FRENCH_VOICE"};
    }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = selectedVoice.lang || "fr-FR";
    u.voice = selectedVoice;
    u.rate = rate;
    u.pitch = 1;
    u.volume = 1;
    speechSynthesis.speak(u);
    return {ok:true};
  }

  if("speechSynthesis" in window){
    refreshVoices();
    speechSynthesis.addEventListener?.("voiceschanged", refreshVoices);
    window.speechSynthesis.onvoiceschanged = refreshVoices;
    setTimeout(refreshVoices, 250);
    setTimeout(refreshVoices, 1000);
  }

  return {refreshVoices,populate,choose,speak};
})();
