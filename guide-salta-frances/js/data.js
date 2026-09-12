// Guide Salta — mapa central verificado.
// Fuentes de referencia usadas para el croquis:
// - Mapa oficial Salta Ciudad (actualización abril 2024).
// - Turismo Ciudad de Salta: Plaza 9 de Julio entre Mitre, España, Zuviría y Caseros.
// - Direcciones oficiales: Catedral España 558; MAAM Mitre 77; Teatro Zuviría 70;
//   Cabildo Caseros 549; Basílica San Francisco Córdoba 33 y Caseros.
// El croquis es didáctico y no está a escala.

const PLACES = {
  catedral: {
    name:"Catedral Basílica", short:"Catedral", x:385, y:150,
    relation:"sur la rue España, en face de la Plaza", street:"España", address:"España 558"
  },
  maam: {
    name:"MAAM", short:"MAAM", x:205, y:340,
    relation:"sur la rue Mitre, à côté de la Plaza", street:"Mitre", address:"Mitre 77"
  },
  plaza: {
    name:"Plaza 9 de Julio", short:"Plaza", x:385, y:340,
    relation:"entre Mitre, España, Zuviría et Caseros", street:"Plaza 9 de Julio", address:"Centro histórico"
  },
  teatro: {
    name:"Teatro Provincial", short:"Teatro", x:555, y:340,
    relation:"sur la rue Zuviría, à côté de la Plaza", street:"Zuviría", address:"Zuviría 70"
  },
  cabildo: {
    name:"Cabildo Histórico", short:"Cabildo", x:385, y:525,
    relation:"sur la rue Caseros, en face de la Plaza", street:"Caseros", address:"Caseros 549"
  },
  sanfran: {
    name:"Basílica San Francisco", short:"San Francisco", x:870, y:390,
    relation:"à l'angle de Córdoba et Caseros", street:"Córdoba / Caseros", address:"Córdoba 33 y Caseros"
  }
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
  "traversez":"cruce / atraviese",
  "continuez":"continúe",
  "tournez":"doble / gire",
  "prenez la rue":"tome la calle",
  "suivez la rue":"siga por la calle",
  "au coin de":"en la esquina de",
  "à environ":"aproximadamente",
  "à pied":"a pie",
  "en bus":"en colectivo",
  "en taxi":"en taxi",
  "à vélo":"en bicicleta",
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
  subtitle:"Seguir calles y cruzar",
  description:"Empezá a orientar usando calles concretas, esquinas y la Plaza como referencia.",
  tags:["suivez la rue","traversez"],
  questions:[
    mc({from:"catedral",to:"maam",meters:180,question:"Excusez-moi, comment aller au MAAM ?",translation:"Disculpe, ¿cómo voy al MAAM?",correct:"Suivez la rue España jusqu'à Mitre, puis prenez la rue Mitre vers la Plaza.",wrong:["Suivez la rue España jusqu'à Zuviría, puis prenez la rue Zuviría vers la Plaza.","Suivez la rue España jusqu'à Córdoba, puis prenez la rue Córdoba vers Caseros."],hint:"Desde la Catedral, el MAAM está sobre Mitre.",help:["suivez la rue","jusqu'à","prenez la rue"]}),
    mc({from:"catedral",to:"cabildo",meters:190,question:"Comment aller au Cabildo ?",translation:"¿Cómo voy al Cabildo?",correct:"Traversez la rue España, traversez la Plaza 9 de Julio et continuez jusqu'à Caseros.",wrong:["Traversez la rue España, longez la Plaza par Mitre et continuez jusqu'à Zuviría.","Traversez la rue España, prenez la rue Zuviría et continuez jusqu'à Córdoba."],hint:"El Cabildo está enfrente de la Plaza, sobre Caseros.",help:["traversez","jusqu'à","en face de"]}),
    mc({from:"plaza",to:"maam",meters:90,question:"Où est le MAAM depuis la Plaza ?",translation:"¿Dónde está el MAAM desde la Plaza?",correct:"Sortez de la Plaza par Mitre. Le MAAM est sur la rue Mitre.",wrong:["Sortez de la Plaza par Zuviría. Le MAAM est sur la rue Zuviría.","Sortez de la Plaza par Caseros. Le MAAM est sur la rue Caseros."],hint:"El MAAM tiene dirección Mitre 77.",help:["à côté de","près de"]}),
    mc({from:"plaza",to:"teatro",meters:90,question:"Où est le Teatro Provincial ?",translation:"¿Dónde está el Teatro Provincial?",correct:"Sortez de la Plaza par Zuviría. Le théâtre est sur la rue Zuviría.",wrong:["Sortez de la Plaza par Mitre. Le théâtre est sur la rue Mitre.","Sortez de la Plaza par Caseros. Le théâtre est sur la rue Caseros."],hint:"El Teatro Provincial está en Zuviría 70.",help:["à côté de","près de"]}),
    mc({from:"cabildo",to:"catedral",meters:190,question:"Comment aller à la cathédrale ?",translation:"¿Cómo voy a la Catedral?",correct:"Traversez Caseros, traversez la Plaza et continuez jusqu'à la rue España.",wrong:["Traversez Caseros, suivez la rue Mitre et continuez jusqu'à la rue Córdoba.","Traversez Caseros, suivez la rue Zuviría et continuez jusqu'à la rue Lerma."],hint:"Catedral y Cabildo están en lados opuestos de la Plaza.",help:["traversez","en face de"]}),
    mc({from:"plaza",to:"sanfran",meters:420,question:"Comment aller à San Francisco ?",translation:"¿Cómo voy a San Francisco?",correct:"Prenez la rue Caseros vers Córdoba et continuez jusqu'à l'angle de Córdoba.",wrong:["Prenez la rue España vers Córdoba et continuez jusqu'à l'angle de Córdoba.","Prenez la rue Caseros vers Mitre et continuez jusqu'à l'angle de Mitre."],hint:"San Francisco está en Córdoba 33 y Caseros.",help:["prenez la rue","au coin de","jusqu'à"]}),
    mc({from:"teatro",to:"sanfran",meters:360,question:"Depuis le théâtre, comment aller à San Francisco ?",translation:"Desde el teatro, ¿cómo voy a San Francisco?",correct:"Suivez Zuviría jusqu'à Caseros, puis prenez Caseros jusqu'à Córdoba.",wrong:["Suivez Zuviría jusqu'à España, puis prenez España jusqu'à Córdoba.","Suivez Zuviría jusqu'à Caseros, puis prenez Caseros jusqu'à Mitre."],hint:"Primero llegá a Caseros y después seguí hasta Córdoba.",help:["depuis","jusqu'à","prenez la rue"]}),
    mc({from:"maam",to:"cabildo",meters:210,question:"Depuis le MAAM, comment aller au Cabildo ?",translation:"Desde el MAAM, ¿cómo voy al Cabildo?",correct:"Suivez Mitre jusqu'à Caseros, puis prenez Caseros vers le Cabildo.",wrong:["Suivez Mitre jusqu'à España, puis prenez España vers le Cabildo.","Suivez Mitre jusqu'à Caseros, puis prenez Caseros vers San Francisco."],hint:"El Cabildo está sobre Caseros.",help:["depuis","jusqu'à","suivez la rue"]}),
    mc({from:"sanfran",to:"plaza",meters:420,question:"Comment revenir à la Plaza 9 de Julio ?",translation:"¿Cómo vuelvo a la Plaza 9 de Julio?",correct:"Suivez Caseros depuis Córdoba jusqu'à Zuviría. La Plaza commence à Zuviría.",wrong:["Suivez España depuis Córdoba jusqu'à Zuviría. La Plaza commence à Zuviría.","Suivez Caseros depuis Córdoba jusqu'à Lerma. La Plaza commence à Lerma."],hint:"La Plaza termina sobre Zuviría en su lado este.",help:["depuis","jusqu'à"]}),
    mc({from:"catedral",to:"teatro",meters:210,question:"Comment aller au Teatro Provincial ?",translation:"¿Cómo voy al Teatro Provincial?",correct:"Suivez España jusqu'à Zuviría, puis prenez Zuviría vers la Plaza.",wrong:["Suivez España jusqu'à Mitre, puis prenez Mitre vers la Plaza.","Suivez España jusqu'à Córdoba, puis prenez Córdoba vers Caseros."],hint:"El Teatro está en Zuviría 70.",help:["jusqu'à","prenez la rue"]})
  ]
},
{
  title:"Où est… ?",subtitle:"Ubicar con calles reales",description:"Reconocé en qué calle está cada lugar y qué calles rodean la Plaza 9 de Julio.",tags:["en face de","au coin de"],questions:[
    mc({from:"plaza",to:"catedral",meters:90,question:"Sur quelle rue se trouve la cathédrale ?",translation:"¿En qué calle está la Catedral?",correct:"La cathédrale se trouve sur la rue España, en face de la Plaza.",wrong:["La cathédrale se trouve sur la rue Caseros, en face de la Plaza.","La cathédrale se trouve sur la rue Zuviría, à côté du théâtre."],hint:"Dirección: España 558.",help:["en face de"]}),
    mc({from:"plaza",to:"maam",meters:90,question:"Sur quelle rue se trouve le MAAM ?",translation:"¿En qué calle está el MAAM?",correct:"Le MAAM se trouve sur la rue Mitre, à côté de la Plaza.",wrong:["Le MAAM se trouve sur la rue Zuviría, à côté de la Plaza.","Le MAAM se trouve sur la rue Caseros, en face de la Plaza."],hint:"Dirección: Mitre 77.",help:["à côté de"]}),
    mc({from:"plaza",to:"teatro",meters:90,question:"Sur quelle rue se trouve le théâtre ?",translation:"¿En qué calle está el teatro?",correct:"Le théâtre se trouve sur la rue Zuviría, à côté de la Plaza.",wrong:["Le théâtre se trouve sur la rue Mitre, à côté de la Plaza.","Le théâtre se trouve sur la rue Caseros, en face de la Plaza."],hint:"Dirección: Zuviría 70.",help:["à côté de"]}),
    mc({from:"plaza",to:"cabildo",meters:90,question:"Sur quelle rue se trouve le Cabildo ?",translation:"¿En qué calle está el Cabildo?",correct:"Le Cabildo se trouve sur la rue Caseros, en face de la Plaza.",wrong:["Le Cabildo se trouve sur la rue España, en face de la Plaza.","Le Cabildo se trouve sur la rue Mitre, à côté de la Plaza."],hint:"Dirección: Caseros 549.",help:["en face de"]}),
    mc({from:"plaza",to:"sanfran",meters:420,question:"Où se trouve San Francisco ?",translation:"¿Dónde está San Francisco?",correct:"San Francisco se trouve à l'angle de Córdoba et Caseros.",wrong:["San Francisco se trouve à l'angle de Mitre et España.","San Francisco se trouve à l'angle de Zuviría et España."],hint:"Dirección oficial: Córdoba 33 y Caseros.",help:["au coin de"]}),
    fill({from:"plaza",to:"plaza",meters:0,question:"La Plaza 9 de Julio est entre quelles rues ?",translation:"¿Entre qué calles está la Plaza 9 de Julio?",prompt:"La Plaza est entre Mitre, España, Zuviría et ___ .",choices:["Caseros","Córdoba","Lerma"],correct:0,hint:"El lado sur de la Plaza es Caseros.",help:["entre"]}),
    interpret({from:"maam",to:"teatro",meters:190,question:"Le MAAM et le théâtre sont de quel côté de la Plaza ?",translation:"¿En qué lados de la Plaza están el MAAM y el teatro?",correct:"Le MAAM est côté Mitre et le théâtre côté Zuviría.",wrong:["Le MAAM est côté Zuviría et le théâtre côté Mitre.","Le MAAM est côté Caseros et le théâtre côté España."],hint:"MAAM: Mitre 77. Teatro: Zuviría 70.",help:["à côté de"]}),
    interpret({from:"catedral",to:"cabildo",meters:190,question:"Quels bâtiments sont face à face ?",translation:"¿Qué edificios están enfrentados?",correct:"La cathédrale et le Cabildo, avec la Plaza entre les deux.",wrong:["Le MAAM et San Francisco, avec la Plaza entre les deux.","Le théâtre et San Francisco, avec la Plaza entre les deux."],hint:"Uno está sobre España y el otro sobre Caseros.",help:["en face de","entre"]}),
    mc({from:"teatro",to:"plaza",meters:90,question:"Quelle rue borde la Plaza du côté du théâtre ?",translation:"¿Qué calle bordea la Plaza del lado del teatro?",correct:"La rue Zuviría borde la Plaza du côté du théâtre.",wrong:["La rue Mitre borde la Plaza du côté du théâtre.","La rue Córdoba borde la Plaza du côté du théâtre."],hint:"El Teatro está en Zuviría.",help:["à côté de"]}),
    mc({from:"maam",to:"plaza",meters:90,question:"Quelle rue borde la Plaza du côté du MAAM ?",translation:"¿Qué calle bordea la Plaza del lado del MAAM?",correct:"La rue Mitre borde la Plaza du côté du MAAM.",wrong:["La rue Zuviría borde la Plaza du côté du MAAM.","La rue Caseros borde la Plaza du côté du MAAM."],hint:"El MAAM está en Mitre 77.",help:["à côté de"]})
  ]
},
{
  title:"Comment y aller ?",subtitle:"Recorridos por calles",description:"Elegí recorridos completos: qué calle seguir, dónde cambiar y qué referencia usar.",tags:["jusqu'à","prenez la rue"],questions:[
    mc({from:"catedral",to:"maam",meters:180,question:"Vous êtes devant la cathédrale. Quel itinéraire est correct ?",translation:"Está frente a la Catedral. ¿Qué recorrido es correcto?",correct:"Suivez España jusqu'à Mitre, puis prenez Mitre vers la Plaza jusqu'au MAAM.",wrong:["Suivez España jusqu'à Zuviría, puis prenez Zuviría vers la Plaza jusqu'au MAAM.","Suivez España jusqu'à Córdoba, puis prenez Córdoba vers Caseros jusqu'au MAAM."],hint:"El MAAM queda sobre Mitre.",help:["jusqu'à","prenez la rue"]}),
    mc({from:"catedral",to:"cabildo",meters:190,question:"Quel itinéraire traverse vraiment la Plaza ?",translation:"¿Qué recorrido realmente atraviesa la Plaza?",correct:"Traversez España, traversez la Plaza du nord au sud et sortez sur Caseros.",wrong:["Traversez España, longez la Plaza par Mitre et sortez sur España.","Traversez Caseros, longez la Plaza par Zuviría et sortez sur Córdoba."],hint:"De Catedral a Cabildo se cruza de España a Caseros.",help:["traversez"]}),
    mc({from:"plaza",to:"sanfran",meters:420,question:"Quelle rue faut-il suivre vers San Francisco ?",translation:"¿Qué calle hay que seguir hacia San Francisco?",correct:"Suivez Caseros vers Córdoba; San Francisco est à l'angle de Córdoba.",wrong:["Suivez España vers Córdoba; San Francisco est à l'angle de Córdoba.","Suivez Caseros vers Mitre; San Francisco est à l'angle de Mitre."],hint:"San Francisco está en Caseros y Córdoba.",help:["au coin de","suivez la rue"]}),
    mc({from:"teatro",to:"maam",meters:190,question:"Comment passer du théâtre au MAAM ?",translation:"¿Cómo paso del teatro al MAAM?",correct:"Traversez Zuviría, traversez la Plaza et sortez par Mitre vers le MAAM.",wrong:["Traversez Zuviría, longez Caseros et sortez par Córdoba vers le MAAM.","Traversez Mitre, traversez la Plaza et sortez par Zuviría vers le MAAM."],hint:"Están en lados opuestos de la Plaza.",help:["traversez"]}),
    mc({from:"maam",to:"catedral",meters:180,question:"Comment aller du MAAM à la cathédrale ?",translation:"¿Cómo voy del MAAM a la Catedral?",correct:"Remontez Mitre jusqu'à España, puis suivez España jusqu'à la cathédrale.",wrong:["Remontez Zuviría jusqu'à España, puis suivez España jusqu'à la cathédrale.","Remontez Mitre jusqu'à Caseros, puis suivez Caseros jusqu'à la cathédrale."],hint:"Primero Mitre, después España.",help:["jusqu'à","suivez la rue"]}),
    mc({from:"cabildo",to:"sanfran",meters:400,question:"Comment aller du Cabildo à San Francisco ?",translation:"¿Cómo voy del Cabildo a San Francisco?",correct:"Suivez Caseros vers Córdoba et continuez jusqu'à l'angle de Córdoba.",wrong:["Suivez España vers Córdoba et continuez jusqu'à l'angle de Córdoba.","Suivez Caseros vers Mitre et continuez jusqu'à l'angle de Mitre."],hint:"Los dos están vinculados por Caseros.",help:["jusqu'à","au coin de"]}),
    fill({from:"teatro",to:"sanfran",meters:360,question:"Complétez l'itinéraire.",translation:"Complete el recorrido.",prompt:"Suivez Zuviría jusqu'à Caseros, puis prenez ___ jusqu'à Córdoba.",choices:["Caseros","España","Mitre"],correct:0,hint:"San Francisco está sobre Caseros.",help:["jusqu'à","prenez la rue"]}),
    fill({from:"catedral",to:"maam",meters:180,question:"Complétez l'itinéraire.",translation:"Complete el recorrido.",prompt:"Suivez España jusqu'à ___, puis prenez cette rue vers la Plaza.",choices:["Mitre","Zuviría","Córdoba"],correct:0,hint:"El MAAM está en Mitre 77.",help:["jusqu'à"]}),
    fill({from:"catedral",to:"cabildo",meters:190,question:"Complétez l'itinéraire.",translation:"Complete el recorrido.",prompt:"Traversez España, traversez la Plaza et sortez sur ___ .",choices:["Caseros","Mitre","Zuviría"],correct:0,hint:"El Cabildo está en Caseros 549.",help:["traversez"]}),
    mc({from:"sanfran",to:"teatro",meters:360,question:"Quel trajet ramène au Teatro Provincial ?",translation:"¿Qué recorrido vuelve al Teatro Provincial?",correct:"Suivez Caseros jusqu'à Zuviría, puis prenez Zuviría vers le théâtre.",wrong:["Suivez España jusqu'à Zuviría, puis prenez Zuviría vers le théâtre.","Suivez Caseros jusqu'à Mitre, puis prenez Mitre vers le théâtre."],hint:"Teatro Provincial: Zuviría 70.",help:["jusqu'à","prenez la rue"]})
  ]
},
{
  title:"Guide touristique",subtitle:"Indicaciones completas",description:"Combiná calles, cruces, esquinas y referencias del centro histórico.",tags:["itinéraire complet","repères"],questions:[
    mc({from:"catedral",to:"sanfran",meters:500,question:"Un touriste veut aller de la cathédrale à San Francisco. Que dites-vous ?",translation:"Un turista quiere ir de la Catedral a San Francisco. ¿Qué le dice?",correct:"Suivez España jusqu'à Zuviría, descendez jusqu'à Caseros et continuez par Caseros jusqu'à Córdoba.",wrong:["Suivez España jusqu'à Mitre, descendez jusqu'à Caseros et continuez par Caseros jusqu'à Mitre.","Suivez Caseros jusqu'à Zuviría, remontez jusqu'à España et continuez par España jusqu'à Córdoba."],hint:"El destino final es la esquina Córdoba-Caseros.",help:["jusqu'à","continuez"]}),
    mc({from:"sanfran",to:"catedral",meters:500,question:"Comment revenir de San Francisco à la cathédrale ?",translation:"¿Cómo vuelvo de San Francisco a la Catedral?",correct:"Suivez Caseros jusqu'à Zuviría, remontez jusqu'à España et suivez España vers la cathédrale.",wrong:["Suivez España jusqu'à Zuviría, descendez jusqu'à Caseros et suivez Caseros vers la cathédrale.","Suivez Caseros jusqu'à Mitre, descendez jusqu'à Alvarado et suivez Alvarado vers la cathédrale."],hint:"Volvés por Caseros hasta Zuviría y después a España.",help:["jusqu'à","suivez la rue"]}),
    mc({from:"maam",to:"teatro",meters:190,question:"Donnez une indication simple du MAAM au théâtre.",translation:"Dé una indicación simple del MAAM al teatro.",correct:"Traversez Mitre, traversez la Plaza et sortez par Zuviría; le théâtre est juste là.",wrong:["Traversez Zuviría, traversez la Plaza et sortez par Mitre; le théâtre est juste là.","Traversez Caseros, traversez la Plaza et sortez par España; le théâtre est juste là."],hint:"MAAM y Teatro están enfrentados a través de la Plaza.",help:["traversez","en face de"]}),
    mc({from:"cabildo",to:"maam",meters:210,question:"Quel trajet utilisez-vous pour aller au MAAM ?",translation:"¿Qué recorrido usa para ir al MAAM?",correct:"Suivez Caseros jusqu'à Mitre, puis remontez Mitre jusqu'au MAAM.",wrong:["Suivez Caseros jusqu'à Zuviría, puis remontez Zuviría jusqu'au MAAM.","Suivez España jusqu'à Mitre, puis remontez Mitre jusqu'au MAAM."],hint:"MAAM: Mitre 77.",help:["jusqu'à"]}),
    interpret({from:"catedral",to:"cabildo",meters:190,question:"Que fait la valise dans ce trajet ?",translation:"¿Qué hace la valijita en este recorrido?",correct:"Elle traverse España, puis la Plaza, puis Caseros.",wrong:["Elle suit España jusqu'à Córdoba, puis traverse Caseros.","Elle suit Mitre jusqu'à Caseros, puis traverse Zuviría."],hint:"La ruta corta atraviesa la Plaza de norte a sur.",help:["traversez"]}),
    interpret({from:"plaza",to:"sanfran",meters:420,question:"Quel repère annonce l'arrivée à San Francisco ?",translation:"¿Qué referencia anuncia la llegada a San Francisco?",correct:"L'angle de la rue Caseros et de la rue Córdoba.",wrong:["L'angle de la rue España et de la rue Mitre.","L'angle de la rue España et de la rue Zuviría."],hint:"Dirección: Córdoba 33 y Caseros.",help:["au coin de"]}),
    fill({from:"plaza",to:"sanfran",meters:420,question:"Complétez l'indication.",translation:"Complete la indicación.",prompt:"Suivez la rue Caseros jusqu'à la rue ___ .",choices:["Córdoba","Mitre","España"],correct:0,hint:"La Basílica está en Córdoba 33.",help:["jusqu'à"]}),
    fill({from:"maam",to:"catedral",meters:180,question:"Complétez l'indication.",translation:"Complete la indicación.",prompt:"Suivez Mitre jusqu'à ___, puis prenez cette rue vers la cathédrale.",choices:["España","Caseros","Córdoba"],correct:0,hint:"La Catedral está en España 558.",help:["jusqu'à"]}),
    mc({from:"teatro",to:"cabildo",meters:200,question:"Comment aller du théâtre au Cabildo sans donner une direction vague ?",translation:"¿Cómo ir del teatro al Cabildo sin dar una dirección vaga?",correct:"Suivez Zuviría jusqu'à Caseros, puis suivez Caseros jusqu'au Cabildo.",wrong:["Suivez Mitre jusqu'à España, puis suivez España jusqu'au Cabildo.","Suivez Córdoba jusqu'à Caseros, puis suivez Caseros jusqu'au Cabildo."],hint:"Nombrá Zuviría y Caseros.",help:["suivez la rue","jusqu'à"]}),
    mc({from:"catedral",to:"maam",meters:180,question:"Quelle réponse donne le meilleur repère urbain ?",translation:"¿Qué respuesta da la mejor referencia urbana?",correct:"Allez par España jusqu'à Mitre, puis prenez Mitre: le MAAM est à côté de la Plaza.",wrong:["Allez par España jusqu'à Zuviría, puis prenez Zuviría: le MAAM est à côté de la Plaza.","Allez par Caseros jusqu'à Mitre, puis prenez Mitre: le MAAM est à côté de la Plaza."],hint:"La calle correcta para el MAAM es Mitre.",help:["à côté de","jusqu'à"]})
  ]
}];

const FREE_ROUTES = {
  "catedral-maam":"Depuis la cathédrale, suivez la rue España jusqu'à Mitre, puis prenez la rue Mitre vers la Plaza. Le MAAM est sur Mitre.",
  "maam-catedral":"Depuis le MAAM, remontez la rue Mitre jusqu'à España, puis suivez España jusqu'à la cathédrale.",
  "catedral-cabildo":"Depuis la cathédrale, traversez la rue España, traversez la Plaza 9 de Julio et continuez jusqu'à Caseros. Le Cabildo est en face.",
  "cabildo-catedral":"Depuis le Cabildo, traversez Caseros, traversez la Plaza 9 de Julio et continuez jusqu'à España. La cathédrale est en face.",
  "plaza-maam":"Sortez de la Plaza par Mitre. Le MAAM est sur la rue Mitre.",
  "plaza-teatro":"Sortez de la Plaza par Zuviría. Le Teatro Provincial est sur la rue Zuviría.",
  "maam-teatro":"Depuis le MAAM, traversez Mitre, traversez la Plaza et sortez par Zuviría. Le théâtre est de l'autre côté.",
  "teatro-maam":"Depuis le théâtre, traversez Zuviría, traversez la Plaza et sortez par Mitre. Le MAAM est de l'autre côté.",
  "plaza-sanfran":"Depuis la Plaza, prenez la rue Caseros vers Córdoba et continuez jusqu'à l'angle de Córdoba. San Francisco est là.",
  "sanfran-plaza":"Depuis San Francisco, suivez la rue Caseros depuis Córdoba jusqu'à Zuviría. La Plaza commence à Zuviría.",
  "teatro-sanfran":"Depuis le théâtre, suivez Zuviría jusqu'à Caseros, puis prenez Caseros jusqu'à Córdoba.",
  "sanfran-teatro":"Depuis San Francisco, suivez Caseros jusqu'à Zuviría, puis prenez Zuviría vers le théâtre.",
  "maam-cabildo":"Depuis le MAAM, suivez Mitre jusqu'à Caseros, puis prenez Caseros vers le Cabildo.",
  "cabildo-maam":"Depuis le Cabildo, suivez Caseros jusqu'à Mitre, puis remontez Mitre jusqu'au MAAM."
};