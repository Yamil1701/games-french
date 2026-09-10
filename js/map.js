window.GameMap = (() => {
  const coords = Object.fromEntries(Object.entries(PLACES).map(([k,p])=>[k,[p.x,p.y]]));

  function pct(x, axis){
    return axis === "x" ? `${x/10}%` : `${x/7.6}%`;
  }

  function setMarker(marker, placeId){
    const [x,y] = coords[placeId];
    marker.style.left = pct(x,"x");
    marker.style.top = pct(y,"y");
  }

  // Red peatonal del croquis. Las coordenadas coinciden con las calles dibujadas.
  const N = {
    catedral:[500,135], maam:[250,390], plaza:[500,405], teatro:[760,390],
    cabildo:[500,650], sanfran:[855,565], mercado:[190,650], teleferico:[900,240],

    // España
    e_mitre:[336,219], e_centro:[500,219], e_zuviria:[666,219],
    // Mitre
    m_maam:[336,390], m_plaza:[336,405], m_caseros:[336,534],
    // Zuviría
    z_tele:[666,240], z_teatro:[666,390], z_plaza:[666,405], z_caseros:[666,534],
    // Caseros
    c_mercado:[190,534], c_centro:[500,534], c_sanfran:[855,534],

    // Entradas a Plaza
    p_n:[500,265], p_w:[380,405], p_e:[620,405], p_s:[500,485]
  };

  const graph = {};
  function edge(a,b,label,type="street"){
    (graph[a] ||= []).push({to:b,label,type});
    (graph[b] ||= []).push({to:a,label,type});
  }

  // Ejes de calles
  edge("e_mitre","e_centro","España","street");
  edge("e_centro","e_zuviria","España","street");

  edge("e_mitre","m_maam","Mitre","street");
  edge("m_maam","m_plaza","Mitre","street");
  edge("m_plaza","m_caseros","Mitre","street");

  edge("e_zuviria","z_tele","Zuviría","street");
  edge("z_tele","z_teatro","Zuviría","street");
  edge("z_teatro","z_plaza","Zuviría","street");
  edge("z_plaza","z_caseros","Zuviría","street");

  edge("c_mercado","m_caseros","Caseros","street");
  edge("m_caseros","c_centro","Caseros","street");
  edge("c_centro","z_caseros","Caseros","street");
  edge("z_caseros","c_sanfran","Caseros","street");

  // Accesos a los lugares
  edge("catedral","e_centro","Acceso Catedral","access");
  edge("maam","m_maam","Acceso MAAM","access");
  edge("teatro","z_teatro","Acceso Teatro","access");
  edge("cabildo","c_centro","Acceso Cabildo","access");
  edge("sanfran","c_sanfran","Acceso San Francisco","access");
  edge("mercado","c_mercado","Acceso Mercado","access");
  edge("teleferico","z_tele","Acceso Teleférico","access");

  // Cruces peatonales hacia la Plaza
  edge("e_centro","p_n","España","crossing");
  edge("m_plaza","p_w","Mitre","crossing");
  edge("z_plaza","p_e","Zuviría","crossing");
  edge("c_centro","p_s","Caseros","crossing");

  // Caminos internos de Plaza 9 de Julio
  edge("p_n","plaza","Plaza 9 de Julio","place");
  edge("p_w","plaza","Plaza 9 de Julio","place");
  edge("p_e","plaza","Plaza 9 de Julio","place");
  edge("p_s","plaza","Plaza 9 de Julio","place");

  function dist(a,b){
    const p=N[a],q=N[b];
    return Math.hypot(q[0]-p[0],q[1]-p[1]);
  }

  function shortestPath(start,end){
    const keys=Object.keys(N);
    const d=Object.fromEntries(keys.map(k=>[k,Infinity]));
    const prev={};
    const used=new Set();
    d[start]=0;

    while(used.size<keys.length){
      let u=null,best=Infinity;
      for(const k of keys){
        if(!used.has(k) && d[k]<best){best=d[k];u=k;}
      }
      if(u===null || u===end) break;
      used.add(u);

      for(const e of (graph[u]||[])){
        // Muy leve preferencia por atravesar plaza / cruces para que se vean didácticamente.
        const weight=dist(u,e.to) * (e.type==="place" ? .92 : 1);
        const nd=d[u]+weight;
        if(nd<d[e.to]){
          d[e.to]=nd;
          prev[e.to]={node:u,edge:e};
        }
      }
    }

    const nodes=[end], edges=[];
    let cur=end;
    while(cur!==start && prev[cur]){
      edges.unshift(prev[cur].edge);
      cur=prev[cur].node;
      nodes.unshift(cur);
    }
    return {nodes,edges};
  }

  function buildRoute(fromId,toId){
    const path=shortestPath(fromId,toId);
    const points=path.nodes.map(id=>N[id]);

    // Agrupar instrucciones consecutivas del mismo tipo/calle.
    const raw=[];
    for(const e of path.edges){
      if(e.type==="access") continue;
      const last=raw[raw.length-1];
      if(last && last.label===e.label && last.type===e.type) continue;
      raw.push({label:e.label,type:e.type});
    }

    const steps=[];
    for(const r of raw){
      if(r.type==="street"){
        steps.push({
          type:"street",
          es:`Caminá por ${r.label}`,
          fr:`Suivez la rue ${r.label}`
        });
      }else if(r.type==="crossing"){
        steps.push({
          type:"crossing",
          es:`Cruzá la calle ${r.label}`,
          fr:`Traversez la rue ${r.label}`
        });
      }else if(r.type==="place"){
        steps.push({
          type:"place",
          es:"Atravesá la Plaza 9 de Julio",
          fr:"Traversez la Plaza 9 de Julio"
        });
      }
    }

    // Eliminar duplicados vecinos y cerrar con el destino.
    const compact=[];
    for(const s of steps){
      const prev=compact[compact.length-1];
      if(prev && prev.es===s.es) continue;
      compact.push(s);
    }
    compact.push({
      type:"arrival",
      es:`Llegá a ${PLACES[toId].short}`,
      fr:`Continuez jusqu'à ${PLACES[toId].short}`
    });

    return {points,steps:compact};
  }

  function showRoute(line, fromId, toId){
    const route=buildRoute(fromId,toId);
    line.setAttribute("points", route.points.map(p=>p.join(",")).join(" "));
    line.classList.add("visible");
    return route;
  }

  function clearRoute(line){
    line.classList.remove("visible");
    line.setAttribute("points","");
  }

  async function animateSuitcase(marker, points, duration=1500){
    if(!points?.length) return;
    if(!marker.animate){
      const last=points[points.length-1];
      marker.style.left=pct(last[0],"x");
      marker.style.top=pct(last[1],"y");
      return;
    }

    // Ritmo ponderado por distancia: la valija se mueve claramente por cada tramo.
    const lengths=[0];
    let total=0;
    for(let i=1;i<points.length;i++){
      total+=Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]);
      lengths.push(total);
    }

    const frames=points.map(([x,y],i)=>({
      left:pct(x,"x"),
      top:pct(y,"y"),
      offset:total ? lengths[i]/total : 1
    }));

    const anim=marker.animate(frames,{
      duration:Math.max(duration, points.length*280),
      easing:"linear",
      fill:"forwards"
    });
    await anim.finished.catch(()=>{});
    const last=points[points.length-1];
    marker.style.left=pct(last[0],"x");
    marker.style.top=pct(last[1],"y");
  }

  return {setMarker,showRoute,clearRoute,animateSuitcase,buildRoute};
})();
