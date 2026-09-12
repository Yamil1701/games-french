// Street-focused mode: prioritize real street names and meaningful urban references.
(() => {
  // Corrected schematic positions for the historic centre.
  Object.assign(PLACES.catedral, {x:400, y:165, street:"España", relation:"sur la rue España, face à la Plaza"});
  Object.assign(PLACES.maam, {x:285, y:365, street:"Mitre", relation:"sur la rue Mitre, à côté de la Plaza"});
  Object.assign(PLACES.plaza, {x:400, y:365, street:"Plaza 9 de Julio", relation:"entre España, Caseros, Mitre et Zuviría"});
  Object.assign(PLACES.teatro, {x:525, y:365, street:"Zuviría", relation:"du côté de la rue Zuviría"});
  Object.assign(PLACES.cabildo, {x:400, y:545, street:"Caseros", relation:"sur la rue Caseros, face à la Plaza"});
  Object.assign(PLACES.sanfran, {x:810, y:465, street:"Caseros, entre Córdoba et Lerma", relation:"sur Caseros, entre Córdoba et Lerma"});
  Object.assign(PLACES.mercado, {x:165, y:650, street:"San Martín", relation:"au sud-ouest du centre"});
  Object.assign(PLACES.teleferico, {x:920, y:650, street:"San Martín", relation:"à l'est du centre"});

  // Make the learning goal explicit.
  LEVELS[0].subtitle = "Calles y primeras indicaciones";
  LEVELS[0].description = "Empezá a orientar usando calles concretas del centro, cruces y referencias visibles.";
  LEVELS[2].description = "Indicá recorridos por calles, cruces, distancias y medios de transporte.";
  LEVELS[3].description = "Combiná calles, cruces y lugares para dar indicaciones completas como guía.";

  function rewrite(levelIndex, questionIndex, patch){
    const q = LEVELS[levelIndex].questions[questionIndex];
    Object.assign(q, patch);
    if (patch.correctText || patch.wrongTexts) {
      q.type = patch.type || "mc";
      q.options = [patch.correctText, ...(patch.wrongTexts || [])];
      q.correct = 0;
      delete q.prompt;
    }
  }

  // Level 1: directional language always anchored to a street/place.
  rewrite(0,0,{
    correctText:"Traversez la rue España : la cathédrale est juste en face de la Plaza.",
    wrongTexts:[
      "Suivez la rue Caseros jusqu'au Mercado.",
      "Prenez la rue Córdoba jusqu'au téléphérique."
    ],
    hint:"La Catedral está sobre España, frente a la Plaza.",
    help:["traversez","en face de"]
  });

  rewrite(0,1,{
    type:"mc",
    question:"Comment aller au MAAM depuis la cathédrale ?",
    translation:"¿Cómo voy al MAAM desde la Catedral?",
    correctText:"Vous êtes rue España. Allez jusqu'à la rue Mitre, puis tournez à droite. Le MAAM est à côté de la Plaza.",
    wrongTexts:[
      "Suivez la rue Caseros jusqu'à Córdoba.",
      "Traversez la Plaza jusqu'à la rue Zuviría."
    ],
    hint:"Usá España y Mitre como referencias: primero llegás a Mitre y recién ahí doblás.",
    help:["jusqu'à","tournez","à côté de"]
  });

  rewrite(0,2,{
    correctText:"Traversez la rue Mitre et entrez dans la Plaza 9 de Julio.",
    wrongTexts:[
      "Suivez Caseros jusqu'à Córdoba.",
      "Continuez sur España jusqu'à Lerma."
    ],
    hint:"El MAAM está sobre Mitre, al lado de la Plaza.",
    help:["traversez"]
  });

  rewrite(0,3,{
    correctText:"Traversez la Plaza jusqu'à la rue Zuviría : le théâtre est de ce côté.",
    wrongTexts:[
      "Suivez Caseros jusqu'à Córdoba.",
      "Continuez sur España jusqu'à Mitre."
    ],
    hint:"El Teatro está del lado de Zuviría.",
    help:["traversez","jusqu'à"]
  });

  rewrite(0,4,{
    type:"mc",
    correctText:"Traversez la rue Caseros et entrez dans la Plaza 9 de Julio.",
    wrongTexts:[
      "Suivez Caseros jusqu'à Córdoba.",
      "Prenez España jusqu'à Lerma."
    ],
    hint:"El Cabildo está sobre Caseros, frente a la Plaza.",
    help:["traversez"]
  });

  rewrite(0,8,{
    type:"mc",
    correctText:"Suivez San Martín, puis prenez Mitre jusqu'à Caseros. Continuez jusqu'au Cabildo.",
    wrongTexts:[
      "Suivez Córdoba jusqu'à España.",
      "Traversez la Plaza jusqu'à Zuviría."
    ],
    hint:"La indicación tiene que nombrar las calles por las que se avanza.",
    help:["continuez","jusqu'à"]
  });

  rewrite(0,9,{
    correctText:"Traversez la rue España et entrez dans la Plaza : elle est juste en face.",
    wrongTexts:[
      "Suivez Caseros jusqu'à Córdoba.",
      "Continuez sur Mitre jusqu'au Mercado."
    ],
    hint:"Desde la Catedral, la Plaza está cruzando España.",
    help:["traversez","en face de"]
  });

  // Level 3: route instructions become explicitly street-based.
  rewrite(2,0,{
    correctText:"Sortez de la Plaza par Caseros, puis suivez Mitre vers le sud jusqu'au secteur du Mercado.",
    wrongTexts:[
      "Suivez España jusqu'à Córdoba.",
      "Traversez la Plaza jusqu'à Zuviría et continuez vers la cathédrale."
    ],
    hint:"Nombrá la salida por Caseros y después la calle por la que continúa el recorrido.",
    help:["jusqu'à","continuez"]
  });

  rewrite(2,1,{
    correctText:"Sortez de la Plaza par Caseros. Suivez Caseros, passez Zuviría et continuez jusqu'à Córdoba. San Francisco se trouve entre Córdoba et Lerma.",
    wrongTexts:[
      "Suivez España jusqu'à Mitre.",
      "Prenez Mitre vers le nord jusqu'à la cathédrale."
    ],
    hint:"San Francisco está sobre Caseros, una cuadra más al este del casco céntrico, entre Córdoba y Lerma.",
    help:["continuez","jusqu'à"]
  });

  rewrite(2,2,{
    type:"mc",
    question:"Comment aller du MAAM au théâtre ?",
    translation:"¿Cómo voy del MAAM al Teatro?",
    correctText:"Depuis la rue Mitre, traversez la Plaza 9 de Julio jusqu'à la rue Zuviría. Le théâtre est de ce côté.",
    wrongTexts:[
      "Suivez Caseros jusqu'à Córdoba.",
      "Prenez España jusqu'à Lerma."
    ],
    hint:"Los dos puntos están a lados opuestos de la Plaza: Mitre y Zuviría.",
    help:["depuis","traversez","jusqu'à"]
  });

  rewrite(2,3,{
    correctText:"Depuis la cathédrale, traversez la rue España, puis traversez la Plaza 9 de Julio jusqu'à la rue Caseros. Le Cabildo est juste en face.",
    wrongTexts:[
      "Suivez España jusqu'à Córdoba.",
      "Prenez Mitre jusqu'à San Martín."
    ],
    hint:"Este recorrido tiene una referencia clave: atravesar la Plaza desde España hasta Caseros.",
    help:["depuis","traversez","jusqu'à","en face de"]
  });

  rewrite(2,5,{
    type:"mc",
    correctText:"Suivez Zuviría jusqu'à Caseros, puis prenez Caseros en direction de Córdoba. Continuez jusqu'à San Francisco.",
    wrongTexts:[
      "Suivez España jusqu'à Mitre.",
      "Traversez la Plaza jusqu'au MAAM."
    ],
    hint:"Primero bajás por Zuviría hasta Caseros y después seguís Caseros hacia Córdoba.",
    help:["jusqu'à","continuez"]
  });

  rewrite(2,8,{
    correctText:"Traversez la Plaza jusqu'à la rue Caseros : le Cabildo est juste en face.",
    wrongTexts:[
      "Suivez España jusqu'à Córdoba.",
      "Prenez Mitre jusqu'à San Martín."
    ],
    hint:"Para ir de Plaza a Cabildo no hace falta decir derecha/izquierda: alcanza con Caseros y la Plaza.",
    help:["traversez","en face de"]
  });

  // Level 4: full guide-style street instructions.
  rewrite(3,0,{
    correctText:"Depuis la Plaza, sortez par la rue Caseros et suivez-la jusqu'à Córdoba. La basilique San Francisco se trouve sur Caseros, entre Córdoba et Lerma.",
    wrongTexts:[
      "Depuis la Plaza, suivez España jusqu'à Mitre.",
      "Traversez la Plaza vers la cathédrale et continuez sur España."
    ],
    hint:"El objetivo es indicar el trayecto por Caseros y ubicar San Francisco entre Córdoba y Lerma.",
    help:["depuis","jusqu'à"]
  });

  rewrite(3,1,{
    type:"mc",
    correctText:"Suivez la rue Caseros vers le centre. Passez Córdoba et Zuviría, puis continuez jusqu'à la Plaza 9 de Julio.",
    wrongTexts:[
      "Suivez Lerma jusqu'à España.",
      "Prenez Mitre vers le sud jusqu'au Mercado."
    ],
    hint:"Desde San Francisco se vuelve por Caseros hacia el casco céntrico.",
    help:["continuez","jusqu'à"]
  });

  rewrite(3,2,{
    correctText:"Depuis le MAAM, suivez la rue Mitre jusqu'à España, puis prenez España jusqu'à la cathédrale.",
    wrongTexts:[
      "Suivez Caseros jusqu'à Córdoba.",
      "Prenez Zuviría jusqu'à San Martín."
    ],
    hint:"El MAAM está en Mitre; la Catedral está sobre España.",
    help:["depuis","jusqu'à"]
  });

  rewrite(3,3,{
    correctText:"Depuis la cathédrale, traversez España, traversez la Plaza 9 de Julio et continuez jusqu'à Caseros. Le Cabildo est juste en face.",
    wrongTexts:[
      "Suivez España jusqu'à Lerma.",
      "Prenez Córdoba jusqu'à San Martín."
    ],
    hint:"La Plaza debe formar parte de la indicación.",
    help:["depuis","traversez","continuez","en face de"]
  });

  rewrite(3,5,{
    correctText:"Depuis le téléphérique, suivez San Martín jusqu'à Córdoba, puis remontez Córdoba vers Caseros et continuez vers le centre.",
    wrongTexts:[
      "Suivez España jusqu'à Mitre.",
      "Traversez directement la Plaza jusqu'au MAAM."
    ],
    hint:"Usá las calles como referencias, no solamente los puntos cardinales.",
    help:["depuis","jusqu'à","continuez"]
  });

  rewrite(3,8,{
    type:"mc",
    correctText:"Traversez la rue Zuviría et entrez dans la Plaza 9 de Julio.",
    wrongTexts:[
      "Suivez Caseros jusqu'à Lerma.",
      "Prenez Mitre jusqu'à San Martín."
    ],
    hint:"El Teatro está del lado de Zuviría y la Plaza está justo del otro lado.",
    help:["traversez"]
  });

  rewrite(3,9,{
    correctText:"Depuis le Cabildo, traversez Caseros, traversez la Plaza 9 de Julio, puis traversez España. La cathédrale est juste en face.",
    wrongTexts:[
      "Suivez Caseros jusqu'à Córdoba.",
      "Prenez Mitre jusqu'au Mercado."
    ],
    hint:"El recorrido cruza Caseros, la Plaza y España.",
    help:["depuis","traversez","en face de"]
  });

  // Free practice phrases also prioritize streets.
  Object.assign(FREE_ROUTES,{
    "catedral-cabildo":"Depuis la cathédrale, traversez la rue España, traversez la Plaza 9 de Julio et continuez jusqu'à la rue Caseros. Le Cabildo est juste en face.",
    "catedral-maam":"Vous êtes rue España. Allez jusqu'à la rue Mitre, puis tournez à droite. Le MAAM est à côté de la Plaza.",
    "plaza-sanfran":"Depuis la Plaza, sortez par Caseros. Suivez la rue Caseros jusqu'à Córdoba. San Francisco se trouve entre Córdoba et Lerma.",
    "sanfran-plaza":"Depuis San Francisco, suivez Caseros vers le centre. Passez Córdoba et Zuviría, puis continuez jusqu'à la Plaza.",
    "maam-teatro":"Depuis le MAAM, traversez la Plaza 9 de Julio de la rue Mitre jusqu'à la rue Zuviría.",
    "cabildo-catedral":"Depuis le Cabildo, traversez Caseros, traversez la Plaza 9 de Julio, puis traversez España. La cathédrale est juste en face.",
    "plaza-catedral":"Traversez la rue España : la cathédrale est juste en face de la Plaza.",
    "plaza-maam":"Traversez la rue Mitre : le MAAM se trouve juste à côté de la Plaza."
  });

  const P = {
    catedral:[400,165], maam:[285,365], plaza:[400,365], teatro:[525,365],
    cabildo:[400,545], sanfran:[810,465], mercado:[165,650], teleferico:[920,650]
  };

  function pct(v, axis){ return axis === "x" ? `${v/10}%` : `${v/7.6}%`; }
  function setMarker(marker,id){
    const [x,y]=P[id];
    marker.style.left=pct(x,"x"); marker.style.top=pct(y,"y");
  }

  const nodes = {
    catedral:{p:P.catedral}, maam:{p:P.maam}, plaza:{p:P.plaza}, teatro:{p:P.teatro},
    cabildo:{p:P.cabildo}, sanfran:{p:P.sanfran}, mercado:{p:P.mercado}, teleferico:{p:P.teleferico},

    e_mitre:{p:[300,220],cross:"Mitre"}, e_cat:{p:[400,220]}, e_zuviria:{p:[500,220],cross:"Zuviría"},
    e_cordoba:{p:[720,220],cross:"Córdoba"}, e_lerma:{p:[900,220],cross:"Lerma"},

    m_maam:{p:[300,365]}, z_teatro:{p:[500,365]},

    c_mitre:{p:[300,500],cross:"Mitre"}, c_cab:{p:[400,500]}, c_zuviria:{p:[500,500],cross:"Zuviría"},
    c_cordoba:{p:[720,500],cross:"Córdoba"}, c_sf:{p:[810,500]}, c_lerma:{p:[900,500],cross:"Lerma"},

    sm_mitre:{p:[300,650],cross:"Mitre"}, sm_zuviria:{p:[500,650],cross:"Zuviría"},
    sm_cordoba:{p:[720,650],cross:"Córdoba"}, sm_lerma:{p:[900,650],cross:"Lerma"},

    p_n:{p:[400,245]}, p_s:{p:[400,480]}, p_w:{p:[320,365]}, p_e:{p:[480,365]}
  };

  const graph={};
  function edge(a,b,street,type="street"){
    (graph[a] ||= []).push({to:b,street,type});
    (graph[b] ||= []).push({to:a,street,type});
  }

  // España
  edge("e_mitre","e_cat","España");
  edge("e_cat","e_zuviria","España");
  edge("e_zuviria","e_cordoba","España");
  edge("e_cordoba","e_lerma","España");
  // Caseros
  edge("c_mitre","c_cab","Caseros");
  edge("c_cab","c_zuviria","Caseros");
  edge("c_zuviria","c_cordoba","Caseros");
  edge("c_cordoba","c_sf","Caseros");
  edge("c_sf","c_lerma","Caseros");
  // San Martín
  edge("sm_mitre","sm_zuviria","San Martín");
  edge("sm_zuviria","sm_cordoba","San Martín");
  edge("sm_cordoba","sm_lerma","San Martín");
  // verticals
  edge("e_mitre","m_maam","Mitre"); edge("m_maam","c_mitre","Mitre"); edge("c_mitre","sm_mitre","Mitre");
  edge("e_zuviria","z_teatro","Zuviría"); edge("z_teatro","c_zuviria","Zuviría"); edge("c_zuviria","sm_zuviria","Zuviría");
  edge("e_cordoba","c_cordoba","Córdoba"); edge("c_cordoba","sm_cordoba","Córdoba");
  edge("e_lerma","c_lerma","Lerma"); edge("c_lerma","sm_lerma","Lerma");

  // POI access
  edge("catedral","e_cat","España","access");
  edge("maam","m_maam","Mitre","access");
  edge("teatro","z_teatro","Zuviría","access");
  edge("cabildo","c_cab","Caseros","access");
  edge("sanfran","c_sf","Caseros","access");
  edge("mercado","sm_mitre","San Martín","access");
  edge("teleferico","sm_lerma","San Martín","access");

  // Plaza crossings
  edge("e_cat","p_n","España","crossing");
  edge("c_cab","p_s","Caseros","crossing");
  edge("m_maam","p_w","Mitre","crossing");
  edge("z_teatro","p_e","Zuviría","crossing");
  edge("p_n","plaza","Plaza 9 de Julio","place");
  edge("p_s","plaza","Plaza 9 de Julio","place");
  edge("p_w","plaza","Plaza 9 de Julio","place");
  edge("p_e","plaza","Plaza 9 de Julio","place");

  const forced = {
    "catedral-cabildo":["catedral","e_cat","p_n","plaza","p_s","c_cab","cabildo"],
    "cabildo-catedral":["cabildo","c_cab","p_s","plaza","p_n","e_cat","catedral"],
    "catedral-maam":["catedral","e_cat","e_mitre","m_maam","maam"],
    "maam-catedral":["maam","m_maam","e_mitre","e_cat","catedral"],
    "plaza-sanfran":["plaza","p_s","c_cab","c_zuviria","c_cordoba","c_sf","sanfran"],
    "sanfran-plaza":["sanfran","c_sf","c_cordoba","c_zuviria","c_cab","p_s","plaza"],
    "maam-teatro":["maam","m_maam","p_w","plaza","p_e","z_teatro","teatro"],
    "teatro-maam":["teatro","z_teatro","p_e","plaza","p_w","m_maam","maam"]
  };

  function d(a,b){
    const A=nodes[a].p,B=nodes[b].p;
    return Math.hypot(B[0]-A[0],B[1]-A[1]);
  }

  function shortest(start,end){
    const keys=Object.keys(nodes), dist=Object.fromEntries(keys.map(k=>[k,Infinity])), prev={}, used=new Set();
    dist[start]=0;
    while(used.size<keys.length){
      let u=null,best=Infinity;
      for(const k of keys) if(!used.has(k) && dist[k]<best){ best=dist[k]; u=k; }
      if(!u || u===end) break;
      used.add(u);
      for(const e of graph[u]||[]){
        const w=d(u,e.to)*(e.type==="place"?.88:1);
        if(dist[u]+w<dist[e.to]){
          dist[e.to]=dist[u]+w;
          prev[e.to]={node:u,edge:e};
        }
      }
    }
    const path=[end]; let cur=end;
    while(cur!==start && prev[cur]){ cur=prev[cur].node; path.unshift(cur); }
    return path;
  }

  function findEdge(a,b){
    return (graph[a]||[]).find(e=>e.to===b) || {street:"",type:"access"};
  }

  function stepsFor(path,toId){
    const steps=[];
    let i=0;
    while(i<path.length-1){
      const e=findEdge(path[i],path[i+1]);
      if(e.type==="access"){ i++; continue; }

      if(e.type==="crossing"){
        steps.push({type:"crossing",es:`Cruzá la calle ${e.street}`,fr:`Traversez la rue ${e.street}`});
        i++; continue;
      }
      if(e.type==="place"){
        steps.push({type:"place",es:"Atravesá la Plaza 9 de Julio",fr:"Traversez la Plaza 9 de Julio"});
        i++; continue;
      }

      const street=e.street;
      let j=i;
      while(j<path.length-1){
        const next=findEdge(path[j],path[j+1]);
        if(next.type!=="street" || next.street!==street) break;
        j++;
      }
      const endNode=path[j];
      const cross=nodes[endNode]?.cross;
      if(cross && cross!==street){
        steps.push({type:"street",es:`Caminá por ${street} hasta ${cross}`,fr:`Suivez la rue ${street} jusqu'à la rue ${cross}`});
      } else {
        steps.push({type:"street",es:`Caminá por ${street}`,fr:`Suivez la rue ${street}`});
      }
      i=j;
    }
    steps.push({type:"arrival",es:`Llegá a ${PLACES[toId].short}`,fr:`Continuez jusqu'à ${PLACES[toId].short}`});
    return steps.filter((s,idx,arr)=>idx===0 || s.es!==arr[idx-1].es);
  }

  function buildRoute(from,to){
    const key=`${from}-${to}`;
    const path=forced[key] || shortest(from,to);
    return {points:path.map(id=>nodes[id].p), steps:stepsFor(path,to)};
  }

  function showRoute(line,from,to){
    const route=buildRoute(from,to);
    line.setAttribute("points",route.points.map(p=>p.join(",")).join(" "));
    line.classList.add("visible");
    return route;
  }
  function clearRoute(line){ line.classList.remove("visible"); line.setAttribute("points",""); }

  async function animateSuitcase(marker,points,duration=1500){
    if(!points?.length) return;
    if(!marker.animate){
      const last=points.at(-1); marker.style.left=pct(last[0],"x"); marker.style.top=pct(last[1],"y"); return;
    }
    const lens=[0]; let total=0;
    for(let i=1;i<points.length;i++){ total+=Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]); lens.push(total); }
    const frames=points.map(([x,y],i)=>({left:pct(x,"x"),top:pct(y,"y"),offset:total?lens[i]/total:1}));
    const anim=marker.animate(frames,{duration:Math.max(duration,points.length*280),easing:"linear",fill:"forwards"});
    await anim.finished.catch(()=>{});
    const last=points.at(-1); marker.style.left=pct(last[0],"x"); marker.style.top=pct(last[1],"y");
  }

  window.GameMap={setMarker,showRoute,clearRoute,animateSuitcase,buildRoute};
})();
