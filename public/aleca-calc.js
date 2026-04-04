// public/aleca-calc.js — Calculateur Origine ALECA + Référentiel documentaire
// Fichier statique — aucune compilation TypeScript

var REGLES = {
  textile:      {l:'Textile / Habillement',      type:'double',         seuil:null, nd:true,  n:'Double transformation requise (filature + tissage + confection). Deux étapes dans la zone PEM.'},
  automobile:   {l:'Automobile (ch.87)',           type:'valeur',         seuil:40,   nd:false, n:'Matières non originaires ≤ 40% du prix départ usine.'},
  aeronautique: {l:'Aéronautique (ch.88)',         type:'cth_ou_valeur',  seuil:40,   nd:false, n:'CTH OU matières non originaires ≤ 40%. Deux critères alternatifs.'},
  agro_brut:    {l:'Agro brut (ch.01–15)',         type:'eo',             seuil:null, nd:false, n:'Origine automatique si cultivé, récolté ou pêché au Maroc.'},
  agro_transforme:{l:'Agro transformé (ch.16–24)', type:'valeur',         seuil:45,   nd:false, n:'Matières non originaires ≤ 45% du prix départ usine.'},
  industrie:    {l:'Industrie générale (ch.25–96)',type:'cth_ou_valeur',  seuil:40,   nd:false, n:'Règle générale PEM — vérifier la RSP annexe II convention PEM.'}
};
var PD = ['UE','Turquie','Tunisie','Égypte','Jordanie','Suisse','Islande','Norvège','Albanie','Serbie','Géorgie','Ukraine','Moldavie','Macédoine du Nord','Monténégro','Kosovo','Israël'];
var AP = ['Maroc','UE','Algérie'].concat(PD.filter(function(p){ return p !== 'UE'; })).concat(['Chine','USA','Inde','Japon','Corée','Autre tiers']);

var prods = [], eid = null, cu = [], ms = [{d:'',o:'UE',v:''}], at = 0;

function uid(){ return 'p' + Date.now() + Math.floor(Math.random() * 999); }

function onSH(v) {
  if (v.length >= 2) {
    var c = parseInt(v.slice(0, 2)), s = 'industrie';
    if (c >= 50 && c <= 63) s = 'textile';
    else if (c === 87) s = 'automobile';
    else if (c === 88) s = 'aeronautique';
    else if (c >= 1 && c <= 15) s = 'agro_brut';
    else if (c >= 16 && c <= 24) s = 'agro_transforme';
    document.getElementById('cSec').value = s;
  }
  onSC();
}

function onSC() { rNote(); rCu(); calc(); }

function rNote() {
  var s = document.getElementById('cSec').value, r = REGLES[s];
  document.getElementById('cNote').innerHTML = r ? '<div class="ori-note">' + r.l + ' — ' + r.n + '</div>' : '';
}

function isO(o, s) {
  if (o === 'Maroc' || o === 'UE') return true;
  if (o === 'Algérie') return s !== 'textile';
  return cu.indexOf(o) > -1;
}

function calc() {
  rML();
  var s = document.getElementById('cSec').value, r = REGLES[s];
  var p = parseFloat(document.getElementById('cPrix').value) || 0;
  var dv = document.getElementById('cDev').value;
  var tot = 0;
  ms.forEach(function(m) { if (!isO(m.o || 'UE', s)) tot += parseFloat(m.v) || 0; });
  var pct = p > 0 ? (tot / p * 100) : 0;
  var el = document.getElementById('cRes');
  if (r.type === 'eo')     { el.innerHTML = '<div class="ori-vinf"><strong>Origine automatique</strong> — produit entièrement obtenu.</div>'; return; }
  if (r.type === 'double') { el.innerHTML = '<div class="ori-vwarn"><strong>Double transformation requise</strong> — vérification manuelle nécessaire.</div>'; return; }
  if (!p) { el.innerHTML = ''; return; }
  var col = pct <= r.seuil - 5 ? '#4CAF7C' : pct <= r.seuil ? '#E8B84B' : '#E85D5D';
  var cls = pct <= r.seuil - 5 ? 'ori-vok' : pct <= r.seuil ? 'ori-vwarn' : 'ori-verr';
  var lbl = pct <= r.seuil - 5 ? 'Origine préférentielle acquise' : pct <= r.seuil ? 'Zone limite — surveiller' : 'Origine non acquise';
  el.innerHTML =
    '<div class="' + cls + '"><strong>' + lbl + '</strong><div style="font-size:11px;margin-top:2px">' + pct.toFixed(1) + '% non orig. — seuil ' + r.seuil + '%</div></div>'
    + '<div class="ori-gauge"><div class="ori-gfill" style="width:' + Math.min(pct, 100) + '%;background:' + col + '"></div><div class="ori-gseuil" style="left:' + r.seuil + '%"></div></div>'
    + '<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--ink3)">'
    + '<span>Non orig: ' + tot.toLocaleString() + ' ' + dv + '</span>'
    + '<span style="font-weight:500;color:' + col + '">' + pct.toFixed(1) + '% / ' + r.seuil + '%</span></div>';
}

function rML() {
  var s = document.getElementById('cSec').value;
  document.getElementById('cMats').innerHTML = ms.map(function(m, i) {
    var orig = isO(m.o || 'UE', s);
    var opts = AP.map(function(p) { return '<option' + (p === m.o ? ' selected' : '') + '>' + p + '</option>'; }).join('');
    return '<div class="ori-mrow">'
      + '<input class="ori-input" style="flex:2;min-width:0;padding:3px 6px" value="' + (m.d || '') + '" placeholder="Matière" oninput="ms[' + i + '].d=this.value">'
      + '<select class="ori-select" style="flex:1.5;min-width:0;padding:3px 6px" onchange="ms[' + i + '].o=this.value;calc()">' + opts + '</select>'
      + '<input type="number" class="ori-input" style="flex:1;min-width:0;padding:3px 6px" value="' + (m.v || '') + '" placeholder="Val." oninput="ms[' + i + '].v=this.value;calc()">'
      + '<span class="' + (orig ? 'ori-bok' : 'ori-berr') + '" style="min-width:42px;justify-content:center">' + (orig ? 'Orig.' : 'Non or.') + '</span>'
      + '<button class="ori-btn ori-btn-sm" style="padding:2px 5px;min-width:20px" onclick="ms.splice(' + i + ',1);if(!ms.length)ms=[{d:\'\',o:\'UE\',v:\'\'}];calc()">&#x2715;</button>'
      + '</div>';
  }).join('');
}

function addM() { ms.push({d:'', o:'UE', v:''}); rML(); }

function rCu() {
  document.getElementById('cCumul').innerHTML = PD.map(function(p) {
    return '<button class="ori-cbtn' + (cu.indexOf(p) > -1 ? ' on' : '') + '" onclick="tC(\'' + p + '\')">' + (p === 'Macédoine du Nord' ? 'Mac. Nord' : p) + '</button>';
  }).join('');
}

function tC(p) {
  var i = cu.indexOf(p);
  if (i > -1) cu.splice(i, 1); else cu.push(p);
  rCu(); calc();
}

function csave() {
  var desc = document.getElementById('cDesc').value.trim();
  if (!desc) { alert('Renseignez la description'); return; }
  var s = document.getElementById('cSec').value, r = REGLES[s];
  var px = parseFloat(document.getElementById('cPrix').value) || 0;
  var tot = 0;
  ms.forEach(function(m) { if (!isO(m.o, s)) tot += parseFloat(m.v) || 0; });
  var pct = px > 0 ? (tot / px * 100) : 0;
  var v = r.type === 'eo' ? 'eo' : r.type === 'double' ? 'double' : pct <= r.seuil - 5 ? 'ok' : pct <= r.seuil ? 'warn' : 'err';
  var prod = {id: eid || uid(), sh: document.getElementById('cSh').value, desc: desc, s: s, px: px, dv: document.getElementById('cDev').value, ms: JSON.parse(JSON.stringify(ms)), cu: cu.slice(), pct: parseFloat(pct.toFixed(2)), v: v};
  var idx = prods.findIndex(function(x) { return x.id === prod.id; });
  if (idx > -1) prods[idx] = prod; else prods.push(prod);
  eid = prod.id; rP(); alert('Enregistré\u00a0: ' + desc);
}

function creset() {
  ['cSh','cDesc','cPrix'].forEach(function(id) { document.getElementById(id).value = ''; });
  document.getElementById('cSec').value = 'industrie';
  ms = [{d:'', o:'UE', v:''}]; cu = []; eid = null;
  rNote(); rML(); rCu(); document.getElementById('cRes').innerHTML = '';
}

function rP() {
  var bv = {ok:'ori-bok', warn:'ori-bwarn', err:'ori-berr', eo:'ori-bgold', double:'ori-bgr'};
  var lv = {ok:'Conforme', warn:'Limite', err:'Non conf.', eo:'Auto', double:'DT'};
  var ok = prods.filter(function(p) { return p.v === 'ok' || p.v === 'eo'; }).length;
  var w  = prods.filter(function(p) { return p.v === 'warn' || p.v === 'double'; }).length;
  var e  = prods.filter(function(p) { return p.v === 'err'; }).length;
  document.getElementById('pStats').innerHTML = prods.length
    ? '<span class="ori-bok">' + ok + ' conf.</span>'
      + (w ? '<span class="ori-bwarn" style="margin-left:4px">' + w + ' lim.</span>' : '')
      + (e ? '<span class="ori-berr" style="margin-left:4px">' + e + ' non conf.</span>' : '')
    : '';
  var el = document.getElementById('pList');
  if (!prods.length) { el.innerHTML = '<div class="ori-stat" style="text-align:center;padding:1rem">Calculez et enregistrez depuis l\u2019onglet Calcul</div>'; return; }
  el.innerHTML = prods.map(function(p) {
    return '<div class="ori-prow' + (eid === p.id ? ' sel' : '') + '" onclick="loadP(\'' + p.id + '\')">'
      + '<div style="flex:1"><div style="font-weight:500;font-size:13px">' + p.desc + '</div>'
      + '<div style="font-size:11px;color:var(--ink3)">SH ' + (p.sh || '—') + ' · ' + (REGLES[p.s] && REGLES[p.s].l || p.s) + '</div></div>'
      + (p.pct != null && p.v !== 'eo' && p.v !== 'double' ? '<span style="font-size:11px;color:var(--ink3)">' + p.pct.toFixed(1) + '%</span>' : '')
      + '<span class="' + (bv[p.v] || 'ori-bgr') + '">' + (lv[p.v] || p.v) + '</span>'
      + '<button class="ori-btn ori-btn-sm" style="padding:2px 5px" onclick="delP(\'' + p.id + '\',event)">&#x2715;</button>'
      + '</div>';
  }).join('');
}

function loadP(id) {
  var p = prods.find(function(x) { return x.id === id; });
  if (!p) return;
  eid = p.id;
  document.getElementById('cSh').value = p.sh || '';
  document.getElementById('cDesc').value = p.desc;
  document.getElementById('cPrix').value = p.px;
  document.getElementById('cSec').value = p.s;
  ms = JSON.parse(JSON.stringify(p.ms)); cu = p.cu.slice();
  onSC(); sw(0);
}

function delP(id, e) {
  e.stopPropagation();
  prods = prods.filter(function(p) { return p.id !== id; });
  if (eid === id) creset();
  rP();
}

function rWI() {
  var el = document.getElementById('wiCont');
  if (!prods.length) { el.innerHTML = '<div class="ori-stat" style="text-align:center;padding:1.5rem">Enregistrez un produit pour acc\u00e9der au simulateur</div>'; return; }
  var p = prods.find(function(x) { return x.id === eid; }) || prods[prods.length - 1];
  var r = REGLES[p.s];
  var bv = {ok:'ori-bok', warn:'ori-bwarn', err:'ori-berr', eo:'ori-bgold', double:'ori-bgr'};
  var lv = {ok:'Conforme', warn:'Limite', err:'Non conf.', eo:'Auto', double:'DT'};
  el.innerHTML =
    '<div style="font-size:13px;font-weight:500;margin-bottom:.5rem">' + p.desc + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:.625rem">'
    + '<div style="background:#FFF9EE;border:1.5px solid #C9A84C40;padding:.625rem .75rem;border-radius:3px">'
    + '<div class="ori-stat">Situation actuelle</div>'
    + (r.seuil ? '<div style="font-size:20px;font-weight:500">' + p.pct.toFixed(1) + '%</div>' : '')
    + '<span class="' + (bv[p.v] || 'ori-bgr') + '">' + (lv[p.v] || p.v) + '</span></div>'
    + '<div id="wiAfter" style="background:#FFF9EE;border:1.5px solid #C9A84C40;padding:.625rem .75rem;border-radius:3px">'
    + '<div class="ori-stat">Apr\u00e8s simulation</div><div style="font-size:12px;margin-top:.25rem">Modifiez une mati\u00e8re \u2192</div></div></div>'
    + p.ms.map(function(m, i) {
      return '<div class="ori-mrow">'
        + '<div style="flex:2;min-width:0;font-size:12px">' + (m.d || 'Mati\u00e8re ' + (i + 1)) + '</div>'
        + '<span class="' + (isO(m.o, p.s) ? 'ori-bok' : 'ori-berr') + '" style="font-size:10px">' + m.o + '</span>'
        + '<select class="ori-select" style="flex:1.5;min-width:0;font-size:11px;padding:2px 5px" onchange="simWI(\'' + p.id + '\',' + i + ',this.value)">'
        + '<option value="">\u2014 simuler \u2014</option>'
        + PD.map(function(pp) { return '<option>' + pp + '</option>'; }).join('')
        + '</select>'
        + '<div id="wiI' + i + '" style="min-width:42px;font-size:11px;text-align:right">\u2014</div></div>';
    }).join('');
}

function simWI(pid, idx, nO) {
  if (!nO) return;
  var p = prods.find(function(x) { return x.id === pid; }); if (!p) return;
  var r = REGLES[p.s]; if (!r.seuil) return;
  var tB = 0, tA = 0;
  p.ms.forEach(function(m) { if (!isO(m.o, p.s)) tB += parseFloat(m.v) || 0; });
  var pA = JSON.parse(JSON.stringify(p)); pA.ms[idx].o = nO;
  pA.ms.forEach(function(m) { if (!isO(m.o, pA.s)) tA += parseFloat(m.v) || 0; });
  var pcB = p.px > 0 ? (tB / p.px * 100) : 0;
  var pcA = pA.px > 0 ? (tA / pA.px * 100) : 0;
  var gain = pcB - pcA;
  document.getElementById('wiI' + idx).innerHTML = '<span style="color:' + (gain > 0 ? '#2a7a4a' : '#a83030') + '">' + (gain > 0 ? '\u2212' : '+') + Math.abs(gain).toFixed(1) + '%</span>';
  var vA = pcA <= r.seuil - 5 ? 'ok' : pcA <= r.seuil ? 'warn' : 'err';
  var bv = {ok:'ori-bok', warn:'ori-bwarn', err:'ori-berr'};
  var lv = {ok:'Conforme', warn:'Limite', err:'Non conf.'};
  document.getElementById('wiAfter').innerHTML =
    '<div class="ori-stat">Apr\u00e8s simulation</div>'
    + '<div style="font-size:20px;font-weight:500">' + pcA.toFixed(1) + '%</div>'
    + '<span class="' + bv[vA] + '">' + lv[vA] + '</span>'
    + (vA === 'ok' && p.v !== 'ok' ? '<div style="font-size:10px;color:#2a7a4a;margin-top:3px">Origine acquise</div>' : '');
}

function sw(n) {
  at = n;
  document.querySelectorAll('.ori-tab').forEach(function(t, i) { t.classList.toggle('active', i === n); });
  document.querySelectorAll('.ori-pane').forEach(function(p, i) { p.classList.toggle('active', i === n); });
  if (n === 1) rP();
  if (n === 2) rWI();
}

// ── Référentiel ALECA ────────────────────────────────────────────────────────
var SECTIONS = [
  {g:'Intro',    t:"Introduction — Règles d'origine ALECA",
   c:"Les règles d'origine de l'ALECA déterminent quels biens sont considérés comme originaires du Maroc ou de l'Union européenne, afin de bénéficier du traitement tarifaire préférentiel.\n\nUn produit est dit originaire s'il est entièrement obtenu dans un des pays signataires, ou s'il a subi une transformation suffisante selon les critères fixés par l'accord.\n\nCes règles visent à éviter le transbordement (réexportation via un pays tiers) et à garantir que les avantages de l'accord profitent effectivement aux économies contractantes."},
  {g:'Intro',    t:"Critères d'origine utilisés",
   c:"Pour les produits relevant de l'ALECA, on applique classiquement l'un des critères suivants :\n\n- Entièrement obtenus : matières premières et produits agricoles/industriels entièrement produits dans un des pays.\n- Changement de position tarifaire (CTH) : le produit fini doit appartenir à une position tarifaire différente de celle de la matière première importée.\n- Valeur ajoutée locale : une certaine part minimale de la valeur de la marchandise doit être acquise dans un pays de l'ALECA.\n\nA l'exportation, l'exportateur fournit un certificat EUR.1 ou une autodéclaration prouvant que le produit respecte les règles."},
  {g:'Intro',    t:"Exemple simple (industriel)",
   c:"Si une entreprise marocaine assemble des pièces semi-finales importées de l'UE pour fabriquer un appareil électronique :\n\n- Le produit sera considéré comme originaire du Maroc si le changement de position tarifaire prévu par l'ALECA est respecté et/ou si la valeur ajoutée marocaine dépasse le seuil exigé.\n- Dans ce cas, le produit bénéficie des droits de douane réduits ou nuls à l'entrée dans l'UE."},
  {g:'Analyse',  t:"I. Clarification conceptuelle préliminaire",
   c:"I. CLARIFICATION CONCEPTUELLE PRÉLIMINAIRE - A NE PAS CONFONDRE\n\nPoint critique : Le terme ALECA recouvre deux réalités juridiques distinctes.\n\nL'ALECA au sens strict désigne l'Accord de Libre-Echange Complet et Approfondi (DCFTA), encore en négociation. Il vise à l'intégration du droit communautaire dans les pays riverains de l'Union.\n\nL'Accord d'Association Maroc-UE (AA) est l'accord actuellement EN VIGUEUR, signé en 1996, entré en vigueur le 1er mars 2000. C'est dans ce cadre que s'appliquent aujourd'hui les règles d'origine opérationnelles."},
  {g:'Analyse',  t:"II. Architecture générale de l'Accord d'Association",
   c:"II. ARCHITECTURE GÉNÉRALE DE L'ACCORD D'ASSOCIATION\n\nL'accord vise à :\n- Etablir une zone de libre-échange industrielle (ZLE)\n- Approfondir la libéralisation du commerce agricole et de la pêche\n- Libéraliser les échanges de services\n- Renforcer l'intégration commerciale via le protocole Pan-Euromed\n\nLes règles d'origine sont consignées dans le Protocole n°4 de l'Accord d'Association."},
  {g:'Analyse',  t:"III. Critères d'acquisition de l'origine préférentielle",
   c:"III. LES CRITÈRES D'ACQUISITION DE L'ORIGINE PRÉFÉRENTIELLE\n\nA. Produits entièrement obtenus\nSont automatiquement originaires les produits issus du règne végétal, animal ou minéral sans incorporation de matières extérieures. Les produits halieutiques pêchés dans les eaux territoriales du Maroc ou de la Communauté sont originaires quel que soit le pavillon du navire.\n\nB. La transformation suffisante\n- CTH : le produit fini relève d'une position SH différente de toutes les matières non originaires\n- Valeur ajoutée : matières non originaires <= 40% à 70% du prix départ usine\n- RSP : règles spécifiques par produit (annexe du Protocole 4)\n- Tolérance : jusqu'à 10% du prix départ usine\n\nC. Principe de territorialité\nLes conditions de l'origine doivent être remplies sans interruption au Maroc ou dans la Communauté.\n\nD. Règle du transport direct\nLe régime préférentiel s'applique uniquement aux produits transportés directement entre les territoires du Maroc et la Communauté."},
  {g:'Analyse',  t:"IV. Système de cumul d'origine",
   c:"IV. LE SYSTÈME DE CUMUL D'ORIGINE - COEUR STRATÉGIQUE\n\nA. Cumul bilatéral\nEntre le Maroc et l'UE uniquement. Les matières UE incorporées dans un produit fabriqué au Maroc sont considérées comme marocaines, et inversement.\n\nB. Cumul diagonal\nLes matières originaires d'un pays PEM peuvent être transformées dans un deuxième pays et y acquérir l'origine préférentielle.\n\nExemple : tissu produit en Turquie + confection au Maroc + export vers l'UE => le tissu turc est compté comme marocain.\n\nLimite critique : l'Algérie n'est PAS éligible au cumul diagonal avec le Maroc (pas d'accord bilatéral).\n\nC. Cumul intégral (ou total)\nLe plus souple. En vigueur entre l'UE, l'Algérie, le Maroc et la Tunisie. EXCLU pour les textiles (ch.50-63)."},
  {g:'Analyse',  t:"V. La Convention PEM — évolution 2025",
   c:"V. LA CONVENTION PEM - ÉVOLUTION MAJEURE EN COURS\n\nConvention de 2013\nLes protocoles d'origine de la zone PEM sont régis par la convention régionale publiée au JOUE L54 du 26 février 2013. Le Maroc est partie contractante.\n\nModernisation de la convention PEM - rupture réglementaire de 2025\n- Entrée en vigueur : 1er janvier 2025\n- Période transitoire expirée : 31 décembre 2025\n- Le Maroc applique les règles transitoires avec l'UE depuis le 2 octobre 2025 (note UE-MA 2703/25)\n\nChangement crucial : suppression de la règle no duty drawback pour tous les secteurs SAUF les textiles (ch.50-63).\n\nGain direct : automobile, aéronautique, industrie => possibilité de rembourser les droits sur intrants non originaires même si le produit fini est exporté en préférentiel.\n\nMatrice de cumul mise à jour au 30 décembre 2024 (communication n° C/2024/7561)."},
  {g:'Analyse',  t:"VI–VII. Négociations ALECA & Sahara occidental",
   c:"VI. L'ALECA STRICTO SENSU - ÉTAT DES NÉGOCIATIONS\n\n- 2013 : lancement des négociations ZLEAC\n- Avril 2014 : dernier cycle, puis suspension à la demande du Maroc\n- 2019 : déclaration conjointe du 14ème Conseil d'Association UE-Maroc, accord pour relancer\n\nDéfis structurels : nouvelles mesures réglementaires européennes, extraterritorialité judiciaire, nouvelles priorités économiques du Maroc.\n\nVII. DÉVELOPPEMENT RÉCENT - LE SAHARA OCCIDENTAL ET LE PROTOCOLE N°4\n\nLa décision n° 2/2025 du 15ème Conseil d'association UE-Maroc (janvier 2026) sécurise les exportations agricoles du Sahara marocain :\n- Introduction d'un Titre III au Protocole n°4\n- Pérennisation des préférences tarifaires pour les produits des provinces du Sud\n- Obligation de traçabilité géographique renforcée\n- Publication officielle au JOUE : 28 janvier 2026"},
  {g:'Analyse',  t:"VIII. Preuve de l'origine — documents",
   c:"VIII. PREUVE DE L'ORIGINE - DOCUMENTS ET PROCÉDURES\n\n1. Certificat EUR.1\n- Emis par l'ADII à la demande de l'exportateur\n- Document de référence classique\n- Délivré par voie électronique depuis le 1er janvier 2025\n\n2. Déclaration d'origine (sur facture)\n- Utilisable par les exportateurs agréés\n- La déclaration relative au cumul doit être rédigée en anglais\n- Signature manuscrite requise, sauf pour les exportateurs agréés\n\n3. Certificat EUR-MED\n- OBLIGATOIRE lorsque le cumul diagonal est appliqué\n- Mention obligatoire : CUMULATION APPLIED WITH [pays] en case 7"},
  {g:'Analyse',  t:"IX. No duty drawback & recommandations",
   c:"IX. LA RÈGLE DU NO DUTY DRAWBACK - POINT DE VIGILANCE\n\nL'interdiction de ristourne des droits (no duty drawback) de la convention 2013 interdisait le double avantage.\n\nAvec la modernisation PEM 2025 :\n- Règle SUPPRIMÉE pour l'automobile, l'aéronautique, l'industrie\n- Règle MAINTENUE uniquement pour les textiles (ch.50-63)\n\nImpact : gain de trésorerie direct à intégrer dans le calcul du coût de revient logistique.\n\nX. ANALYSE CRITIQUE ET RECOMMANDATIONS STRATÉGIQUES\n\nCe que l'ALECA changera réellement :\n- Extension du champ sectoriel : services, investissement, marchés publics\n- Harmonisation réglementaire profonde : réduction des barrières techniques\n- Convergence normative : normes techniques communes (pharma, agro, auto)\n\nPoint de faiblesse : la matrice de cumul diagonal à géométrie variable crée une asymétrie défavorable au Maroc vis-à-vis de la Tunisie et de la Turquie."},
  {g:'Sectoriel', t:"Alerte réglementaire — PEM 2025",
   c:"ALERTE RÉGLEMENTAIRE CRITIQUE - A LIRE EN PREMIER\n\nDepuis le 2 octobre 2025 (note UE-MA 2703/25), le Maroc applique avec l'UE les règles modernisées par anticipation (règles transitoires), utilisables bilatéralement jusqu'au 31 décembre 2027.\n\nDeux corpus de règles coexistent en ce moment.\n\nVotre premier réflexe avant toute exportation : vérifier lequel des deux régimes vous avez activé - et être cohérent tout au long de la chaîne documentaire.\n\nAction immédiate : si vos déclarations fournisseurs et vos EUR.1 ont été émis avant le 2 octobre 2025 selon les anciennes règles, ils restent valables 4 mois seulement. Renouveler si nécessaire."},
  {g:'Sectoriel', t:"Secteur 1 — Textile & habillement (ch.50-63)",
   c:"SECTEUR 1 - TEXTILE & HABILLEMENT (SH chapitres 50 à 63)\n\nRègle fondamentale : la double transformation\nUn vêtement doit être fabriqué à partir de fils (et non de tissus importés) :\n- Etape 1 : Filature (fibre => fil) - n'importe quel pays PEM via cumul diagonal\n- Etape 2 : Tissage ou tricotage (fil => tissu)\n- Etape 3 : Confection (tissu => vêtement fini) - doit être réalisée au Maroc\n\nDeux de ces étapes doivent être réalisées dans la zone PEM, confection finale marocaine.\n\nDepuis octobre 2025 : cumul total diagonal autorisé pour tous les produits SAUF textiles (ch.50-63). Règle de double transformation maintenue intacte.\nTolérance : 10% du poids des matières textiles.\n\nExemple : tissu importé de Turquie (EUR.1 Turquie) + confection au Maroc en chemises => origine marocaine. Preuve d'origine : CUMULATION APPLIED WITH TURKEY en case 7 du EUR.1.\n\nFils ou tissus d'Algérie : PAS éligibles au cumul diagonal avec le Maroc."},
  {g:'Sectoriel', t:"Secteur 2 — Automobile & équipements (ch.87)",
   c:"SECTEUR 2 - AUTOMOBILE & ÉQUIPEMENTS (SH chapitre 87)\n\nRègle principale : matières non originaires <= 40% du prix départ usine.\n\nCumul diagonal - cas concret :\n- Câblage Maroc => originaire\n- Sièges Espagne => originaires UE\n- Tableau de bord Turquie => originaire via cumul diagonal\n- Composants Chine/Corée/Japon => NON originaires (comptés dans les 40%)\n\nPoint critique équipementiers Tier 1 & Tier 2 :\nLa règle CTH impose que le produit fini relève d'une position SH différente de toutes les matières non originaires. Un simple assemblage dans la même sous-position SH NE confère PAS l'origine.\n\nOpportunité PEM 2025 : suppression du no drawback => remboursement des droits sur intrants asiatiques possible même si le produit fini est exporté en préférentiel. Gain de trésorerie direct."},
  {g:'Sectoriel', t:"Secteur 3 — Aéronautique (ch.88)",
   c:"SECTEUR 3 - AÉRONAUTIQUE (SH chapitre 88)\n\nRègles pour le chapitre 88 (SH 88.01 à 88.05) - deux critères alternatifs :\n- Matières non originaires <= 40% du prix départ usine, OU\n- CTH : toutes les matières non originaires classées dans une position SH différente du produit\n\nL'aéronautique marocaine opère principalement en régime de perfectionnement actif. Depuis la suppression du no drawback (2025), il devient possible de cumuler les deux avantages sous certaines conditions.\n\nPoint de vigilance documentaire :\nContrôles post-dédouanement particulièrement rigoureux. Traçabilité complète de chaque composant à conserver pendant 3 ans minimum."},
  {g:'Sectoriel', t:"Secteur 4 — Agriculture & agroalimentaire (ch.01-24)",
   c:"SECTEUR 4 - AGRICULTURE & AGROALIMENTAIRE (SH chapitres 1 à 24)\n\nProduits entièrement obtenus (ch.01-15) :\nAgrumes, tomates, fraises, huile d'olive, poisson => origine automatique sans condition.\n\nProduits transformés (ch.16-24) :\n- Tous les produits des ch.1 à 24 utilisés sont entièrement obtenus, OU\n- Valeur ajoutée au Maroc dépassant un seuil défini\n- Tolérance : 15% du poids du produit\n\nDécision 2/2025 (publiée 28 janvier 2026) :\nSécurise les règles d'origine pour les produits du Sahara marocain. Cadre opérationnel pour les exportateurs des provinces du Sud, avec obligation de traçabilité géographique renforcée.\n\nContingents tarifaires :\nSurveiller l'état de consommation des contingents en temps réel via TARIC (tomates, courgettes, fraises, clémentines)."},
  {g:'Sectoriel', t:"Analyse critique et recommandations finales",
   c:"ANALYSE CRITIQUE - CE QUE VOUS DEVEZ CHALLENGER\n\nQuestion directe : avez-vous cartographié votre chaîne d'approvisionnement pays par pays pour chaque intrant ? 80% des entreprises ne l'ont pas fait - c'est exactement là que les redressements douaniers surviennent lors des vérifications a posteriori.\n\nRecommandations immédiates :\n\n1. Documentation : mettre à jour toutes les déclarations fournisseurs selon les règles PEM modernisées. Les anciennes déclarations sont valides 4 mois seulement.\n\n2. Cartographie : tableau de bord pays d'origine x valeur pour chaque composant.\n\n3. No drawback : chiffrer le gain de trésorerie lié à la suppression (hors textile).\n\n4. Algérie : vérifier qu'aucun intrant algérien n'est comptabilisé en cumul diagonal.\n\n5. Sahara occidental : mettre à jour l'étiquetage pays d'origine conformément à la décision 2/2025."}
];

var activeG = {Intro:true, Analyse:true, Sectoriel:true};

function buildDocUI() { rebuildSel(); showAlecaS(0); }

function rebuildSel() {
  var sel = document.getElementById('aSel');
  var prev = parseInt(sel.value) || 0;
  var filtered = SECTIONS.map(function(s, i) { return {s:s, i:i}; }).filter(function(x) { return activeG[x.s.g]; });
  sel.innerHTML = filtered.map(function(x) {
    return '<option value="' + x.i + '">' + x.s.g + ' — ' + x.s.t + '</option>';
  }).join('');
  var still = filtered.find(function(x) { return x.i === prev; });
  if (still) sel.value = prev;
  showAlecaS(parseInt(sel.value) || 0);
}

function fgTag(g, btn) {
  activeG[g] = !activeG[g];
  btn.classList.toggle('on', activeG[g]);
  rebuildSel();
}

function showAlecaS(idx) {
  var s = SECTIONS[idx];
  if (!s) return;
  document.getElementById('aTxt').textContent = s.c;
}

// Init au chargement
rNote(); rML(); rCu(); buildDocUI();
