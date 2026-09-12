window.GameMap = (() => {
  const coords = Object.fromEntries(Object.entries(PLACES).map(([k,p])=>[k,[p.x,p.y]]));

  function pct(x, axis){ return axis === "x" ? `${x/10}%` : `${x/7.6}%`; }

  function setMarker(marker, placeId){
    const [x,y] = coords[placeId];
    marker.style.left = pct(x,"x");
    marker.style.top = pct(y,"y");
  }

  // Red peatonal del sector trabajado en el juego.
  // Orden este-oeste verificado en el plano turístico oficial 2026:
  // Mitre → Zuviría → Buenos Aires → Córdoba → Lerma.
  // La Plaza está limitada por Mitre / España / Zuviría / Caseros.
  const N = {
    catedral:[385,150], maam:[205,340], plaza:[385,340], teatro:[555,340], cabildo:[385,525], sanfran:[870,390],
    esp_mitre:[270,220], esp_mid:[385,220], esp_zuviria:[500,220], esp_bsas:[660,220], esp_cordoba:[820,220], esp_lerma:[930,220],
    mit_maam:[270,340], mit_caseros:[270,455],
    zuv_teatro:[500,340], zuv_caseros:[500,455],
    cas_mid:[385,455], cas_bsas:[660,455], cas_cordoba:[820,455], cas_lerma:[930,455],
    p_n:[385,252], p_w:[300,340], p_e:[470,340], p_s:[385,428]
  };

  const NODE_META = {
    esp_mitre:{intersection:["España","Mitre"]}, esp_zuviria:{intersection:["España","Zuviría"]},
    esp_bsas:{intersection:["España","Buenos Aires"]}, esp_cordoba:{intersection:["España","Córdoba"]}, esp_lerma:{intersection:["España","Lerma"]},
    mit_caseros:{intersection:["Mitre","Caseros"]}, zuv_caseros:{intersection:["Zuviría","Caseros"]},
    cas_bsas:{intersection:["Caseros","Buenos Aires"]}, cas_cordoba:{intersection:["Caseros","Córdoba"]}, cas_lerma:{intersection:["Caseros","Lerma"]},
    esp_mid:{intersection:["España"]}, mit_maam:{intersection:["Mitre"]}, zuv_teatro:{intersection:["Zuviría"]}, cas_mid:{intersection:["Caseros"]}
  };

  const graph = {};
  function edge(a,b,label,type="street"){
    (graph[a] ||= []).push({to:b,label,type});
    (graph[b] ||= []).push({to:a,label,type});
  }

  edge("esp_mitre","esp_mid","España"); edge("esp_mid","esp_zuviria","España");
  edge("esp_zuviria","esp_bsas","España"); edge("esp_bsas","esp_cordoba","España"); edge("esp_cordoba","esp_lerma","España");
  edge("esp_mitre","mit_maam","Mitre"); edge("mit_maam","mit_caseros","Mitre");
  edge("esp_zuviria","zuv_teatro","Zuviría"); edge("zuv_teatro","zuv_caseros","Zuviría");
  edge("mit_caseros","cas_mid","Caseros"); edge("cas_mid","zuv_caseros","Caseros");
  edge("zuv_caseros","cas_bsas","Caseros"); edge("cas_bsas","cas_cordoba","Caseros"); edge("cas_cordoba","cas_lerma","Caseros");
  edge("esp_bsas","cas_bsas","Buenos Aires"); edge("esp_cordoba","cas_cordoba","Córdoba"); edge("esp_lerma","cas_lerma","Lerma");

  edge("catedral","esp_mid","Acceso Catedral","access"); edge("maam","mit_maam","Acceso MAAM","access");
  edge("teatro","zuv_teatro","Acceso Teatro","access"); edge("cabildo","cas_mid","Acceso Cabildo","access");
  edge("sanfran","cas_cordoba","Acceso San Francisco","access");

  edge("esp_mid","p_n","España","crossing"); edge("mit_maam","p_w","Mitre","crossing");
  edge("zuv_teatro","p_e","Zuviría","crossing"); edge("cas_mid","p_s","Caseros","crossing");
  edge("p_n","plaza","Plaza 9 de Julio","place"); edge("p_w","plaza","Plaza 9 de Julio","place");
  edge("p_e","plaza","Plaza 9 de Julio","place"); edge("p_s","plaza","Plaza 9 de Julio","place");

  const SPECIAL = {
    "catedral|cabildo":["catedral","esp_mid","p_n","plaza","p_s","cas_mid","cabildo"],
    "cabildo|catedral":["cabildo","cas_mid","p_s","plaza","p_n","esp_mid","catedral"],
    "catedral|maam":["catedral","esp_mid","esp_mitre","mit_maam","maam"],
    "maam|catedral":["maam","mit_maam","esp_mitre","esp_mid","catedral"],
    "catedral|teatro":["catedral","esp_mid","esp_zuviria","zuv_teatro","teatro"],
    "teatro|catedral":["teatro","zuv_teatro","esp_zuviria","esp_mid","catedral"],
    "plaza|sanfran":["plaza","p_s","cas_mid","zuv_caseros","cas_bsas","cas_cordoba","sanfran"],
    "sanfran|plaza":["sanfran","cas_cordoba","cas_bsas","zuv_caseros","cas_mid","p_s","plaza"],
    "teatro|sanfran":["teatro","zuv_teatro","zuv_caseros","cas_bsas","cas_cordoba","sanfran"],
    "sanfran|teatro":["sanfran","cas_cordoba","cas_bsas","zuv_caseros","zuv_teatro","teatro"],
    "maam|teatro":["maam","mit_maam","p_w","plaza","p_e","zuv_teatro","teatro"],
    "teatro|maam":["teatro","zuv_teatro","p_e","plaza","p_w","mit_maam","maam"],
    "maam|cabildo":["maam","mit_maam","mit_caseros","cas_mid","cabildo"],
    "cabildo|maam":["cabildo","cas_mid","mit_caseros","mit_maam","maam"],
    "catedral|sanfran":["catedral","esp_mid","esp_zuviria","zuv_teatro","zuv_caseros","cas_bsas","cas_cordoba","sanfran"],
    "sanfran|catedral":["sanfran","cas_cordoba","cas_bsas","zuv_caseros","zuv_teatro","esp_zuviria","esp_mid","catedral"]
  };

  function edgeBetween(a,b){ return (graph[a]||[]).find(e=>e.to===b) || null; }
  function dist(a,b){ const p=N[a],q=N[b]; return Math.hypot(q[0]-p[0],q[1]-p[1]); }

  function shortestPath(start,end){
    const special=SPECIAL[`${start}|${end}`];
    if(special) return {nodes:special,edges:special.slice(0,-1).map((n,i)=>edgeBetween(n,special[i+1])).filter(Boolean)};

    const keys=Object.keys(N), d=Object.fromEntries(keys.map(k=>[k,Infinity])), prev={}, used=new Set();
    d[start]=0;
    while(used.size<keys.length){
      let u=null,best=Infinity;
      for(const k of keys) if(!used.has(k)&&d[k]<best){best=d[k];u=k;}
      if(u===null||u===end) break;
      used.add(u);
      for(const e of (graph[u]||[])){
        const placePenalty=e.type==="place"&&start!=="plaza"&&end!=="plaza"?3.2:1;
        const nd=d[u]+dist(u,e.to)*placePenalty;
        if(nd<d[e.to]){d[e.to]=nd;prev[e.to]={node:u,edge:e};}
      }
    }
    const nodes=[end],edges=[]; let cur=end;
    while(cur!==start&&prev[cur]){edges.unshift(prev[cur].edge);cur=prev[cur].node;nodes.unshift(cur);}
    return {nodes,edges};
  }

  function otherStreetAt(nodeId,currentStreet){
    const list=NODE_META[nodeId]?.intersection||[];
    return list.find(x=>x!==currentStreet)||null;
  }

  function compactStreetSegments(nodes,edges){
    const segments=[];
    for(let i=0;i<edges.length;i++){
      const e=edges[i]; if(e.type==="access") continue;
      const from=nodes[i],to=nodes[i+1],last=segments[segments.length-1];
      if(last&&last.type===e.type&&last.label===e.label){last.to=to;last.edgeEnd=i;}
      else segments.push({type:e.type,label:e.label,from,to,edgeStart:i,edgeEnd:i});
    }
    return segments;
  }

  function buildSteps(fromId,toId,nodes,edges){
    const segs=compactStreetSegments(nodes,edges),steps=[];
    segs.forEach((seg,idx)=>{
      if(seg.type==="street"){
        const cross=otherStreetAt(seg.to,seg.label);
        const isLastStreet=!segs.slice(idx+1).some(s=>s.type==="street");
        if(cross) steps.push({type:"street",es:`Seguí por ${seg.label} hasta ${cross}`,fr:`Suivez la rue ${seg.label} jusqu'à ${cross}`});
        else if(isLastStreet) steps.push({type:"street",es:`Continuá por ${seg.label} hacia ${PLACES[toId].short}`,fr:`Continuez par ${seg.label} vers ${PLACES[toId].short}`});
        else steps.push({type:"street",es:`Seguí por ${seg.label}`,fr:`Suivez la rue ${seg.label}`});
      }else if(seg.type==="crossing") steps.push({type:"crossing",es:`Cruzá la calle ${seg.label}`,fr:`Traversez la rue ${seg.label}`});
      else if(seg.type==="place") steps.push({type:"place",es:"Atravesá la Plaza 9 de Julio",fr:"Traversez la Plaza 9 de Julio"});
    });
    const compact=[];
    for(const step of steps){const prev=compact[compact.length-1];if(prev&&prev.es===step.es)continue;compact.push(step);}
    compact.push({type:"arrival",es:`Llegá a ${PLACES[toId].short}`,fr:`Vous arrivez à ${PLACES[toId].short}`});
    return compact;
  }

  function buildRoute(fromId,toId){
    const path=shortestPath(fromId,toId);
    return {points:path.nodes.map(id=>N[id]),steps:buildSteps(fromId,toId,path.nodes,path.edges)};
  }

  function showRoute(line,fromId,toId){
    const route=buildRoute(fromId,toId);
    line.setAttribute("points",route.points.map(p=>p.join(",")).join(" "));
    line.classList.add("visible");
    return route;
  }
  function clearRoute(line){line.classList.remove("visible");line.setAttribute("points","");}

  async function animateSuitcase(marker,points,duration=1500){
    if(!points?.length)return;
    const last=points[points.length-1];
    if(!marker.animate){marker.style.left=pct(last[0],"x");marker.style.top=pct(last[1],"y");return;}
    const lengths=[0];let total=0;
    for(let i=1;i<points.length;i++){total+=Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]);lengths.push(total);}
    const frames=points.map(([x,y],i)=>({left:pct(x,"x"),top:pct(y,"y"),offset:total?lengths[i]/total:1}));
    const anim=marker.animate(frames,{duration:Math.max(duration,points.length*260),easing:"linear",fill:"forwards"});
    await anim.finished.catch(()=>{});
    marker.style.left=pct(last[0],"x");marker.style.top=pct(last[1],"y");
  }

  return {setMarker,showRoute,clearRoute,animateSuitcase,buildRoute};
})();