const PLACES = {
  catedral:   { name:"Catedral Basílica", short:"Catedral", x:500, y:135, relation:"au nord de la Plaza", street:"España" },
  maam:       { name:"MAAM", short:"MAAM", x:250, y:390, relation:"à l'ouest de la Plaza", street:"Mitre" },
  plaza:      { name:"Plaza 9 de Julio", short:"Plaza", x:500, y:405, relation:"au centre historique", street:"Plaza 9 de Julio" },
  teatro:     { name:"Teatro Provincial", short:"Teatro", x:760, y:390, relation:"à l'est de la Plaza", street:"Zuviría" },
  cabildo:    { name:"Cabildo Histórico", short:"Cabildo", x:500, y:650, relation:"au sud de la Plaza", street:"Caseros" },
  sanfran:    { name:"Basílica San Francisco", short:"San Francisco", x:855, y:565, relation:"à l'est du centre", street:"Caseros" },
  mercado:    { name:"Mercado San Miguel", short:"Mercado", x:190, y:650, relation:"au sud-ouest de la Plaza", street:"San Martín" },
  teleferico: { name:"Teleférico San Bernardo", short:"Teleférico", x:900, y:240, relation:"à l'est du centre", street:"San Martín" }
};

const TRANSPORT = {
  walk:{es:"🚶 A pie",fr:"à pied"},
  bus:{es:"🚌 En colectivo",fr:"en bus"},
  taxi:{es:"🚕 En taxi",fr:"en taxi"},
  bike:{es:"🚲 En bicicleta",fr:"à vélo"}
};

const VOCAB = {
  "tout droit":"todo derecho",
  "à gauche":"a la izquierda",
  "à droite":"a la derecha",
  "près de":"cerca de",
  "loin de":"lejos de",
  "tout près":"muy cerca",
  "assez près":"bastante cerca",
  "à côté de":"al lado de",
  "en face de":"enfrente de",
  "devant":"delante de",
  "derrière":"detrás de",
  "entre":"entre",
  "au nord de":"al norte de",
  "au sud de":"al sur de",
  "à l'est de":"al este de",
  "à l'ouest de":"al oeste de",
  "jusqu'à":"hasta",
  "depuis":"desde",
  "traversez":"cruce",
  "continuez":"continúe",
  "tournez":"doble / gire",
  "à environ":"aproximadamente",
  "à pied":"a pie",
  "en bus":"en colectivo",
  "en taxi":"en taxi",
  "à vélo":"en bicicleta",
  "au coin de":"en la esquina de",
  "le long de":"a lo largo de",
  "avant":"antes de",
  "après":"después de"
};

function mc({from,to,meters=200,transport="walk",proximity="près",question,translation,correct,wrong,hint,help=[],speak}){
  return {type:"mc",from,to,meters,transport,proximity,question,translation,options:[correct,...wrong],correct:0,hint,help,speak:speak||question};
}
function fill({from,to,meters=150,transport="walk",proximity="près",question,translation,prompt,choices,correct,hint,help=[],speak}){
  return {type:"fill",from,to,meters,transport,proximity,question,translation,prompt,options:choices,correct,hint,help,speak:speak||question};
}
function interpret({from,to,meters=150,transport="walk",proximity="près",question,translation,correct,wrong,hint,help=[],speak}){
  return {type:"interpret",from,to,meters,transport,proximity,question,translation,options:[correct,...wrong],correct:0,hint,help,speak:speak||question};
}

const LEVELS = [
{
  title:"Premiers pas",
  subtitle:"Derecha, izquierda y todo derecho",
  description:"Aprendé las expresiones más básicas para empezar a orientar a alguien.",
  tags:["tout droit","gauche / droite"],
  questions:[
    mc({from:"plaza",to:"catedral",meters:120,question:"Excusez-moi, où est la cathédrale ?",translation:"Disculpe, ¿dónde está la catedral?",correct:"Elle est tout près, au nord de la Plaza.",wrong:["Elle est très loin, derrière le marché.","Elle est à l'ouest du MAAM."],hint:"El destino está arriba de la Plaza.",help:["tout près","au nord de"]}),
    fill({from:"catedral",to:"maam",meters:180,question:"Comment aller au MAAM ?",translation:"¿Cómo voy al MAAM?",prompt:"Allez ___ .",choices:["à gauche","à droite","tout droit"],correct:0,hint:"El MAAM está hacia la izquierda.",help:["à gauche","à droite"]}),
    interpret({from:"maam",to:"plaza",meters:100,question:"La Plaza est de quel côté ?",translation:"¿De qué lado está la Plaza?",correct:"Elle est à droite.",wrong:["Elle est à gauche.","Elle est derrière le Cabildo."],hint:"Mirá la valijita en el MAAM y la estrella en la Plaza.",help:["à droite","à gauche"]}),
    mc({from:"plaza",to:"teatro",meters:170,question:"Le théâtre, s'il vous plaît ?",translation:"El teatro, por favor.",correct:"Allez à droite, il est à l'est de la Plaza.",wrong:["Allez à gauche jusqu'au MAAM.","Continuez vers le sud jusqu'au Cabildo."],hint:"El teatro está del lado derecho.",help:["à droite","à l'est de"]}),
    fill({from:"cabildo",to:"plaza",meters:120,question:"Comment revenir à la Plaza ?",translation:"¿Cómo vuelvo a la Plaza?",prompt:"Allez ___ .",choices:["vers le nord","vers le sud","à l'est"],correct:0,hint:"La Plaza está arriba del Cabildo.",help:["au nord de"]}),
    mc({from:"teatro",to:"sanfran",meters:360,question:"San Francisco est loin ?",translation:"¿San Francisco está lejos?",correct:"Non, c'est assez près.",wrong:["Oui, c'est à dix kilomètres.","Oui, c'est dans une autre ville."],hint:"El recorrido es corto.",help:["assez près","loin de"]}),
    interpret({from:"teleferico",to:"sanfran",meters:330,question:"Où est San Francisco ?",translation:"¿Dónde está San Francisco?",correct:"Plus au sud.",wrong:["Plus au nord.","À l'ouest du MAAM."],hint:"La estrella está debajo de la valijita.",help:["au sud de","au nord de"]}),
    mc({from:"plaza",to:"mercado",meters:620,question:"Le marché est loin d'ici ?",translation:"¿El mercado está lejos de acá?",correct:"Non, on peut y aller à pied.",wrong:["Oui, il faut prendre l'avion.","Il est à côté de la cathédrale."],hint:"Está a varias cuadras, pero se puede caminar.",help:["à pied","loin de"]}),
    fill({from:"mercado",to:"cabildo",meters:310,question:"Le Cabildo est où ?",translation:"¿Dónde está el Cabildo?",prompt:"Allez ___ .",choices:["à droite","à gauche","vers le nord"],correct:0,hint:"El Cabildo está a la derecha del Mercado.",help:["à droite","à gauche"]}),
    mc({from:"catedral",to:"plaza",meters:120,question:"La Plaza est près d'ici ?",translation:"¿La Plaza está cerca de acá?",correct:"Oui, elle est tout près.",wrong:["Non, elle est très loin.","Non, elle est derrière le téléphérique."],hint:"Es uno de los trayectos más cortos del mapa.",help:["tout près","près de"]})
  ]
},
{
  title:"Où est… ?",
  subtitle:"Ubicar lugares",
  description:"Cerca, lejos, al lado, delante, detrás y puntos cardinales.",
  tags:["à côté de","devant / derrière"],
  questions:[
    interpret({from:"plaza",to:"maam",meters:100,question:"Où est le MAAM ?",translation:"¿Dónde está el MAAM?",correct:"Il est à l'ouest de la Plaza.",wrong:["Il est à l'est de la Plaza.","Il est derrière le téléphérique."],hint:"El MAAM está a la izquierda de la Plaza.",help:["à l'ouest de","à l'est de"]}),
    mc({from:"cabildo",to:"plaza",meters:120,question:"La Plaza est où ?",translation:"¿Dónde está la Plaza?",correct:"Elle est devant le Cabildo, vers le nord.",wrong:["Elle est derrière le marché.","Elle est très loin du centre."],hint:"Desde el Cabildo mirás hacia arriba.",help:["devant","au nord de"]}),
    fill({from:"plaza",to:"catedral",meters:120,question:"La cathédrale est ___ de la Plaza.",translation:"La Catedral está ___ de la Plaza.",prompt:"La cathédrale est ___ de la Plaza.",choices:["au nord","au sud","à l'ouest"],correct:0,hint:"La Catedral está arriba de la Plaza.",help:["au nord de","au sud de"]}),
    mc({from:"plaza",to:"teatro",meters:170,question:"Où se trouve le théâtre ?",translation:"¿Dónde se encuentra el teatro?",correct:"À l'est de la Plaza.",wrong:["À l'ouest de la Plaza.","Au sud du marché."],hint:"Está del lado derecho del croquis.",help:["à l'est de","à l'ouest de"]}),
    mc({from:"maam",to:"plaza",meters:100,question:"La Plaza est loin du MAAM ?",translation:"¿La Plaza está lejos del MAAM?",correct:"Non, elle est juste à côté.",wrong:["Oui, elle est très loin.","Oui, il faut prendre un bus."],hint:"Están uno junto al otro.",help:["à côté de","près de"]}),
    interpret({from:"sanfran",to:"cabildo",meters:420,question:"Le Cabildo est de quel côté ?",translation:"¿De qué lado está el Cabildo?",correct:"À l'ouest de San Francisco.",wrong:["À l'est de San Francisco.","Au nord du téléphérique."],hint:"La estrella está a la izquierda.",help:["à l'ouest de","à l'est de"]}),
    fill({from:"mercado",to:"cabildo",meters:310,question:"Le Cabildo est ___ le Mercado et San Francisco.",translation:"El Cabildo está ___ el Mercado y San Francisco.",prompt:"Le Cabildo est ___ les deux lieux.",choices:["entre","derrière","loin de"],correct:0,hint:"Está ubicado en medio de ambos puntos.",help:["entre","derrière"]}),
    mc({from:"teatro",to:"plaza",meters:170,question:"La Plaza est où depuis le théâtre ?",translation:"¿Dónde está la Plaza desde el teatro?",correct:"À l'ouest, juste à côté.",wrong:["À l'est, très loin.","Au sud du marché."],hint:"Desde el teatro, la Plaza está a la izquierda.",help:["depuis","à l'ouest de","à côté de"]}),
    mc({from:"catedral",to:"cabildo",meters:380,question:"Le Cabildo est derrière la Plaza ?",translation:"¿El Cabildo está detrás de la Plaza?",correct:"Oui, il est au sud de la Plaza.",wrong:["Non, il est au nord de la cathédrale.","Non, il est à l'est du téléphérique."],hint:"Está debajo de la Plaza.",help:["derrière","au sud de"]}),
    fill({from:"plaza",to:"maam",meters:100,question:"Le MAAM est ___ de la Plaza.",translation:"El MAAM está ___ de la Plaza.",prompt:"Le MAAM est ___ de la Plaza.",choices:["à côté","loin","derrière"],correct:0,hint:"Están pegados en el croquis.",help:["à côté de","loin de"]})
  ]
},
{
  title:"Comment y aller ?",
  subtitle:"Calles, metros y transporte",
  description:"Combiná indicaciones, distancias aproximadas y medios de transporte.",
  tags:["à environ","à pied / en bus"],
  questions:[
    mc({from:"plaza",to:"mercado",meters:620,question:"Comment aller au Mercado San Miguel ?",translation:"¿Cómo voy al Mercado San Miguel?",correct:"Allez vers le sud-ouest, à environ 600 mètres.",wrong:["Allez au nord-est jusqu'à la cathédrale.","Continuez vers l'est jusqu'au téléphérique."],hint:"Está abajo y a la izquierda.",help:["à environ","au sud de","à l'ouest de"]}),
    mc({from:"plaza",to:"sanfran",meters:650,question:"Comment aller à San Francisco ?",translation:"¿Cómo voy a San Francisco?",correct:"Suivez Caseros vers l'est.",wrong:["Suivez España vers l'ouest.","Allez vers le nord jusqu'à la cathédrale."],hint:"San Francisco está hacia el este sobre el eje de Caseros.",help:["le long de","à l'est de"]}),
    fill({from:"maam",to:"teatro",meters:430,question:"Traversez la Plaza et allez ___ .",translation:"Cruce la Plaza y vaya ___ .",prompt:"Traversez la Plaza et allez ___ .",choices:["à droite","à gauche","vers le sud"],correct:0,hint:"El teatro está al otro lado de la Plaza, hacia la derecha.",help:["traversez","à droite"]}),
    mc({from:"catedral",to:"cabildo",meters:380,question:"Comment aller au Cabildo ?",translation:"¿Cómo voy al Cabildo?",correct:"Continuez vers le sud et traversez la Plaza.",wrong:["Allez vers le nord.","Tournez vers l'est jusqu'au téléphérique."],hint:"Hay que bajar atravesando el centro.",help:["continuez","traversez","au sud de"]}),
    mc({from:"plaza",to:"teleferico",meters:1100,transport:"bus",proximity:"loin",question:"Le téléphérique est loin ?",translation:"¿El Teleférico está lejos?",correct:"C'est plus loin. Vous pouvez prendre un bus.",wrong:["C'est à côté de la Plaza.","C'est derrière le MAAM."],hint:"Es uno de los trayectos más largos.",help:["loin de","en bus"]}),
    fill({from:"teatro",to:"sanfran",meters:360,question:"Continuez ___ San Francisco.",translation:"Continúe ___ San Francisco.",prompt:"Continuez ___ San Francisco.",choices:["jusqu'à","depuis","derrière"],correct:0,hint:"La palabra pedida significa «hasta».",help:["jusqu'à","depuis"]}),
    mc({from:"mercado",to:"plaza",meters:620,question:"Combien de mètres jusqu'à la Plaza ?",translation:"¿Cuántos metros hay hasta la Plaza?",correct:"À environ 600 mètres.",wrong:["À environ 6 kilomètres.","À environ 60 kilomètres."],hint:"Mirá la cápsula de distancia.",help:["à environ","jusqu'à"]}),
    mc({from:"teleferico",to:"plaza",meters:1100,transport:"taxi",proximity:"loin",question:"Je suis pressé. Comment aller à la Plaza ?",translation:"Estoy apurado. ¿Cómo voy a la Plaza?",correct:"Vous pouvez prendre un taxi jusqu'au centre.",wrong:["Prenez l'avion.","Marchez vers l'est jusqu'à San Francisco."],hint:"La persona está apurada y el trayecto es largo.",help:["en taxi","jusqu'à"]}),
    fill({from:"plaza",to:"cabildo",meters:160,question:"Bus ou à pied pour le Cabildo ?",translation:"¿Colectivo o a pie para el Cabildo?",prompt:"C'est tout près. Allez-y ___ .",choices:["à pied","en bus","en taxi"],correct:0,hint:"La distancia es muy corta.",help:["à pied","tout près"]}),
    mc({from:"sanfran",to:"teleferico",meters:700,transport:"bike",proximity:"moyen",question:"Je suis à vélo. Le téléphérique est loin ?",translation:"Estoy en bicicleta. ¿El Teleférico está lejos?",correct:"Non, c'est un trajet raisonnable à vélo.",wrong:["Oui, c'est à vingt kilomètres.","Il est à côté du MAAM."],hint:"El transporte indicado es bicicleta.",help:["à vélo","loin de"]})
  ]
},
{
  title:"Guide touristique",
  subtitle:"Mezclá todo",
  description:"Situaciones completas para usar direcciones como un pequeño guía turístico.",
  tags:["depuis / jusqu'à","itinéraire complet"],
  questions:[
    mc({from:"plaza",to:"sanfran",meters:650,question:"Depuis la Plaza, comment aller à San Francisco ?",translation:"Desde la Plaza, ¿cómo voy a San Francisco?",correct:"Suivez Caseros vers l'est jusqu'à San Francisco.",wrong:["Suivez España vers l'ouest jusqu'au MAAM.","Allez vers le sud jusqu'au Mercado."],hint:"San Francisco está hacia el este.",help:["depuis","jusqu'à","à l'est de"]}),
    fill({from:"sanfran",to:"plaza",meters:650,question:"Comment revenir au centre ?",translation:"¿Cómo vuelvo al centro?",prompt:"Continuez vers ___ jusqu'à la Plaza.",choices:["l'ouest","l'est","le sud"],correct:0,hint:"Desde San Francisco hay que volver hacia la izquierda.",help:["à l'ouest de","jusqu'à"]}),
    interpret({from:"maam",to:"catedral",meters:280,question:"Où finit ce trajet ?",translation:"¿Dónde termina este recorrido?",correct:"À la cathédrale, au nord-est du MAAM.",wrong:["Au Mercado, au sud-ouest.","Au téléphérique, à l'est."],hint:"La estrella está arriba y a la derecha.",help:["au nord de","à l'est de"]}),
    mc({from:"catedral",to:"cabildo",meters:380,question:"Expliquez le trajet jusqu'au Cabildo.",translation:"Explique el recorrido hasta el Cabildo.",correct:"Allez tout droit vers le sud, traversez la Plaza et continuez jusqu'au Cabildo.",wrong:["Tournez vers l'est jusqu'au téléphérique.","Allez vers le nord derrière la cathédrale."],hint:"El recorrido cruza la Plaza de arriba hacia abajo.",help:["tout droit","traversez","jusqu'à"]}),
    fill({from:"mercado",to:"cabildo",meters:310,question:"Le Cabildo est ___ le Mercado et San Francisco.",translation:"El Cabildo está ___ el Mercado y San Francisco.",prompt:"Le Cabildo est ___ les deux.",choices:["entre","derrière","avant"],correct:0,hint:"Está en el medio de los dos.",help:["entre","avant","derrière"]}),
    mc({from:"teleferico",to:"teatro",meters:720,question:"Nous sommes ici. Où est le théâtre ?",translation:"Estamos acá. ¿Dónde está el teatro?",correct:"Plus à l'ouest et un peu au sud.",wrong:["Plus à l'est.","Derrière le Mercado."],hint:"Mirá la posición relativa de valijita y estrella.",help:["à l'ouest de","au sud de"]}),
    mc({from:"plaza",to:"mercado",meters:620,question:"Le marché est près ou loin ?",translation:"¿El mercado está cerca o lejos?",correct:"Il est un peu plus loin, mais on peut y aller à pied.",wrong:["Il est juste à côté de la Plaza.","Il est à dix kilomètres."],hint:"No está pegado, pero sigue siendo caminable.",help:["loin de","à pied"]}),
    mc({from:"plaza",to:"teleferico",meters:1100,transport:"bus",proximity:"loin",question:"Quel transport conseillez-vous ?",translation:"¿Qué transporte recomienda?",correct:"Je conseille le bus.",wrong:["Je conseille l'avion.","Je conseille de ne pas bouger."],hint:"Es un trayecto más largo y la ficha muestra colectivo.",help:["en bus"]}),
    fill({from:"teatro",to:"plaza",meters:170,question:"La Plaza est ___ du théâtre.",translation:"La Plaza está ___ del teatro.",prompt:"La Plaza est ___ du théâtre.",choices:["à l'ouest","à l'est","au sud"],correct:0,hint:"La Plaza está a la izquierda del teatro.",help:["à l'ouest de","à l'est de"]}),
    mc({from:"cabildo",to:"catedral",meters:380,question:"Donnez une indication complète.",translation:"Dé una indicación completa.",correct:"Depuis le Cabildo, allez vers le nord, traversez la Plaza et continuez jusqu'à la cathédrale.",wrong:["Depuis le Cabildo, allez vers le sud jusqu'au Mercado.","Tournez vers l'est jusqu'au téléphérique."],hint:"Hay que ir hacia arriba cruzando la Plaza.",help:["depuis","au nord de","traversez","jusqu'à"]})
  ]
}];

const FREE_ROUTES = {
  "plaza-sanfran":"Depuis la Plaza, suivez la rue Caseros vers l'est et continuez jusqu'à San Francisco.",
  "plaza-catedral":"Depuis la Plaza, allez vers le nord. La cathédrale est tout près, devant vous.",
  "plaza-maam":"Depuis la Plaza, allez vers l'ouest. Le MAAM est juste à côté.",
  "plaza-cabildo":"Depuis la Plaza, allez vers le sud jusqu'au Cabildo.",
  "maam-teatro":"Depuis le MAAM, traversez la Plaza vers l'est. Le théâtre est de l'autre côté.",
  "catedral-cabildo":"Depuis la cathédrale, allez tout droit vers le sud, traversez la Plaza et continuez jusqu'au Cabildo.",
  "mercado-plaza":"Depuis le Mercado, allez vers le nord-est jusqu'à la Plaza 9 de Julio.",
  "sanfran-plaza":"Depuis San Francisco, suivez Caseros vers l'ouest jusqu'à la Plaza.",
  "teleferico-plaza":"Depuis le téléphérique, allez vers l'ouest jusqu'au centre historique.",
  "cabildo-catedral":"Depuis le Cabildo, allez vers le nord, traversez la Plaza et continuez jusqu'à la cathédrale."
};
