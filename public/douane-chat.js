// public/douane-chat.js — Douane.ia chat engine v9
// Fichier statique — aucune compilation TypeScript

const LANGS={
  fr:{
    h1:"L'intelligence douanière<br><strong>à portée de question</strong>",
    sub:"Posez vos questions sur la réglementation douanière marocaine — données réglementaires ADII, tarifs, procédures, régimes économiques.",
    ph:"Posez votre question douanière...",
    welcome:"Bonjour — je suis <strong>Douane.ia</strong>, votre assistant en réglementation douanière marocaine.<br>Je m'appuie sur les données réglementaires officielles de l'ADII pour vous fournir des réponses précises et sourcées.<br>Inscrivez-vous pour accéder à <strong>7 jours d'essai complet</strong>."
  },
  ar:{
    h1:"الذكاء الجمركي<br><strong>في متناول سؤالك</strong>",
    sub:"اطرح أسئلتك حول التنظيم الجمركي المغربي — البيانات التنظيمية، التعريفات، الإجراءات.",
    ph:"اطرح سؤالك الجمركي...",
    welcome:"مرحباً — أنا <strong>Douane.ia</strong>، مساعدك في التنظيم الجمركي المغربي.<br>أستند إلى البيانات التنظيمية الرسمية للإدارة العامة للجمارك.<br>سجّل للاستفادة من <strong>7 أيام تجريبية مجانية</strong>."
  },
  en:{
    h1:"Moroccan customs intelligence<br><strong>at your fingertips</strong>",
    sub:"Ask questions about Moroccan customs regulations — ADII regulatory data, tariffs, procedures, economic regimes.",
    ph:"Ask your customs question...",
    welcome:"Hello — I am <strong>Douane.ia</strong>, your Moroccan customs regulation assistant.<br>I draw from official ADII regulatory data to provide precise, sourced answers.<br>Sign up to access your <strong>7-day free trial</strong>."
  }
};

// ── Détection menu (≥ 3 items **N.**) ────────────────────────────────────────
function isMenuResponse(t){
  var m = t.match(/\*\*\d{1,2}\.\*\*/g);
  return m && m.length >= 3;
}

// ── Parsing du menu numéroté ──────────────────────────────────────────────────
function parseMenu(t){
  var introEnd = t.indexOf('**1.**');
  var intro = introEnd > -1 ? t.slice(0, introEnd).trim() : '';
  var items = [];
  var itemRe = /\*\*(\d{1,2})\.\*\*\s*([^*]+?)(?=\s*\*\*\d{1,2}\.\*\*|\s*→|$)/g;
  var m;
  while((m = itemRe.exec(t)) !== null){
    items.push({num: m[1], label: m[2].trim()});
  }
  var footerM = t.match(/(→.+)$/);
  var footer = footerM ? footerM[1].trim() : '';
  return {intro: intro, items: items, footer: footer};
}

// ── Rendu menu en cartes cliquables ──────────────────────────────────────────
function renderMenuCards(t){
  var p = parseMenu(t);
  var html = '';
  if(p.intro) html += '<div class="menu-intro">' + escHtml(p.intro) + '</div>';
  html += '<div class="menu-cards">';
  for(var i = 0; i < p.items.length; i++){
    var item = p.items[i];
    html += '<button class="menu-card" onclick="sendChoice(' + item.num + ')">'
      + '<span class="menu-num">' + item.num + '.</span>'
      + '<span class="menu-label">' + escHtml(item.label) + '</span>'
      + '</button>';
  }
  html += '</div>';
  if(p.footer) html += '<div class="menu-footer">' + escHtml(p.footer) + '</div>';
  return html;
}

// ── Conversion markdown → HTML ────────────────────────────────────────────────
function mdToHtml(t){
  var s = t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  s = '<p>' + s + '</p>';
  s = s.replace(/\n\n/g, '</p><p>');
  s = s.replace(/\n/g, '<br>');
  s = s.replace(/<p><\/p>/g, '');
  return s;
}

// ── Escape HTML ───────────────────────────────────────────────────────────────
function escHtml(s){
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Sélection d'un domaine via carte ─────────────────────────────────────────
function sendChoice(n){
  var inp = document.getElementById('chat-input');
  if(inp) inp.value = String(n);
  sendMsg();
}

// ── Bascule mode chat / classique ────────────────────────────────────────────
function setMode(m){
  var chatView    = document.getElementById('chat-view');
  var classicView = document.getElementById('classic-view');
  var btnChat     = document.getElementById('btn-chat');
  var btnClassic  = document.getElementById('btn-classic');
  if(chatView)    chatView.style.display    = m === 'chat'    ? 'block' : 'none';
  if(classicView) classicView.style.display = m === 'classic' ? 'block' : 'none';
  if(btnChat)     btnChat.classList.toggle('active',    m === 'chat');
  if(btnClassic)  btnClassic.classList.toggle('active', m === 'classic');
}

// ── Bascule langue ────────────────────────────────────────────────────────────
function setLang(l, btn){
  document.querySelectorAll('.lang-b').forEach(function(b){ b.classList.remove('on'); });
  if(btn) btn.classList.add('on');
  var d = LANGS[l] || LANGS['fr'];
  var h1El  = document.getElementById('h1-txt');
  var subEl = document.getElementById('sub-txt');
  var inpEl = document.getElementById('chat-input');
  var welEl = document.getElementById('welcome-msg');
  if(h1El)  h1El.innerHTML    = d.h1;
  if(subEl) subEl.textContent = d.sub;
  if(inpEl) inpEl.placeholder = d.ph;
  if(welEl) welEl.innerHTML   = d.welcome;
  document.documentElement.lang = l;
  document.documentElement.dir  = l === 'ar' ? 'rtl' : 'ltr';
}

// ── Quota ─────────────────────────────────────────────────────────────────────
var quota = 2;

function updateQuota(){
  var dots = [
    document.getElementById('d1'),
    document.getElementById('d2'),
    document.getElementById('d3')
  ];
  dots.forEach(function(d, i){ if(d) d.classList.toggle('used', i < (3 - quota)); });
  var el = document.getElementById('quota-txt');
  if(el) el.textContent = quota > 0
    ? quota + ' question' + (quota > 1 ? 's' : '') + ' restante' + (quota > 1 ? 's' : '')
    : 'Limite atteinte';
  if(quota <= 0) setTimeout(function(){ openModal('register'); }, 1500);
}

// ── Envoi message ─────────────────────────────────────────────────────────────
function sendMsg(){
  var inp = document.getElementById('chat-input');
  if(!inp) return;
  var msg = inp.value.trim();
  if(!msg) return;
  if(quota <= 0){ openModal('register'); return; }
  addMsg(msg, 'usr');
  inp.value = '';
  // Réinitialise la hauteur du textarea après envoi
  inp.style.height = 'auto';
  quota--;
  updateQuota();
  showTyping();
  fetch('/api/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({message: msg, channel: 'web', sessionId: getSid()})
  })
  .then(function(r){ return r.json(); })
  .then(function(d){ removeTyping(); addMsg(d.response || 'Erreur.', 'ai', d.sources); })
  .catch(function(){ removeTyping(); addMsg('Erreur de connexion. Veuillez réessayer.', 'ai'); });
}

// ── Affichage message ─────────────────────────────────────────────────────────
function addMsg(text, role, sources){
  var box = document.getElementById('messages');
  if(!box) return;
  var wrap = document.createElement('div'); wrap.className = 'msg';
  var av   = document.createElement('div');
  av.className  = 'msg-av ' + (role === 'ai' ? 'ai' : 'usr');
  av.textContent = role === 'ai' ? 'DI' : 'Vous';
  var right = document.createElement('div');
  var bub   = document.createElement('div'); bub.className = 'msg-bub ' + role;

  if(role === 'ai'){
    bub.innerHTML = isMenuResponse(text) ? renderMenuCards(text) : mdToHtml(text);
  } else {
    bub.textContent = text;
  }

  right.appendChild(bub);

  if(sources && sources.length){
    var s = document.createElement('div'); s.className = 'msg-src';
    s.innerHTML = 'Source : ' + sources.map(function(x){
      return '<span title="' + escHtml(x.objet) + '">Circ. N°' + x.numero + ' (' + x.date + ')</span>';
    }).join(' · ');
    right.appendChild(s);
  }

  wrap.appendChild(av);
  wrap.appendChild(right);
  box.appendChild(wrap);
  box.scrollTop = box.scrollHeight;
}

// ── Indicateur de frappe ──────────────────────────────────────────────────────
function showTyping(){
  var box = document.getElementById('messages');
  if(!box) return;
  var t = document.createElement('div'); t.className = 'msg'; t.id = 'typing';
  t.innerHTML = '<div class="msg-av ai">DI</div><div class="typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
  box.appendChild(t);
  box.scrollTop = box.scrollHeight;
}
function removeTyping(){ var t = document.getElementById('typing'); if(t) t.remove(); }

// ── Session ID ────────────────────────────────────────────────────────────────
function getSid(){
  var s = sessionStorage.getItem('dia');
  if(!s){ s = Math.random().toString(36).slice(2); sessionStorage.setItem('dia', s); }
  return s;
}

// ── Modales ───────────────────────────────────────────────────────────────────
function openModal(n){
  var el = document.getElementById('overlay-' + n);
  if(el) el.classList.add('open');
}
function closeModal(n){
  var el = document.getElementById('overlay-' + n);
  if(el) el.classList.remove('open');
}
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape'){ closeModal('register'); closeModal('login'); }
});

// ── Date du jour + calendrier hégirien (algorithme corrigé) ───────────────────
function toHijri(date){
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();

  // Jour julien
  var jd;
  if(y > 1582 || (y === 1582 && m > 10) || (y === 1582 && m === 10 && d > 14)){
    jd = Math.floor(1461 * (y + 4800 + Math.floor((m - 14) / 12)) / 4)
       + Math.floor(367  * (m - 2 - 12 * Math.floor((m - 14) / 12)) / 12)
       - Math.floor(3    * Math.floor((y + 4900 + Math.floor((m - 14) / 12)) / 100) / 4)
       + d - 32075;
  } else {
    jd = 367 * y
       - Math.floor(7 * (y + Math.floor((m + 9) / 12)) / 4)
       + Math.floor(275 * m / 9)
       + d + 1721013;
  }

  // Conversion vers calendrier islamique
  var z = jd - 1948438.5;
  var a = Math.floor(z / 10631);
  z = z - 10631 * a;
  var b = Math.floor((z - 1.078) / 354.367);
  z = z - Math.floor(354.367 * b + 1.078);
  var c = Math.floor((z + 28.5001) / 29.5);
  if(c === 13) c = 12;
  var hMonth = c;
  var hDay   = Math.ceil(z - Math.floor(29.5001 * c - 28.5));
  var hYear  = 30 * a + b + 1;

  // Garde-fou sur l'index du mois
  var hM = ['Moharram','Safar','Rabi I','Rabi II','Joumada I','Joumada II',
            'Rajab','Chaabane','Ramadan','Chawwal','Dhou al-Qi\'da','Dhou al-Hijja'];
  var monthName = (hMonth >= 1 && hMonth <= 12) ? hM[hMonth - 1] : '—';

  return hDay + ' ' + monthName + ' ' + hYear + ' H';
}

function initDate(){
  var now      = new Date();
  var days     = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  var months   = ['janvier','février','mars','avril','mai','juin','juillet','août',
                  'septembre','octobre','novembre','décembre'];

  var dayEl    = document.getElementById('db-day');
  var dateEl   = document.getElementById('db-date-full');
  var hijriEl  = document.getElementById('db-hijri');   // null si absent du DOM

  if(dayEl)   dayEl.textContent  = days[now.getDay()];
  if(dateEl)  dateEl.textContent = now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
  if(hijriEl) hijriEl.textContent = toHijri(now);       // only if element exists
}

// ── Dernières circulaires Supabase ────────────────────────────────────────────
async function loadLatestCirculaires(){
  var el = document.getElementById('circulaires-list');
  if(!el) return;
  try {
    var SUPA_URL = 'https://vfgjihkshhmnwjwbnrfz.supabase.co';
    var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmZ2ppaGtzaGhtbndqd2JucmZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTY2NzAsImV4cCI6MjA4OTc3MjY3MH0.5Fttwav2CqiVG8jOFeUuTYyPsFZiewr9uujCb4pXVVM';
    var res  = await fetch(
      SUPA_URL + '/rest/v1/circulaires?select=numero,date,objet&order=date.desc&limit=3',
      { headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY } }
    );
    var data = await res.json();
    if(!Array.isArray(data) || !data.length){
      el.innerHTML = '<div style="padding:.75rem 1rem;font-size:11px;color:var(--ink3)">Aucune circulaire.</div>';
      return;
    }
    el.innerHTML = data.map(function(c){
      var d   = c.date ? new Date(c.date) : null;
      var ds  = d ? d.toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'}) : '';
      var obj = c.objet ? c.objet.slice(0, 60) + (c.objet.length > 60 ? '…' : '') : '';
      return '<div class="citem" onclick="openFaq(\'Que dit la circulaire ' + c.numero + ' ?\')">'
        + '<div class="c-num">N° ' + c.numero + '</div>'
        + '<div class="c-obj">' + escHtml(obj) + '</div>'
        + '<div class="c-date">' + ds + '</div></div>';
    }).join('');
  } catch(e){
    el.innerHTML = '<div style="padding:.75rem 1rem;font-size:11px;color:var(--ink3)">Erreur de chargement.</div>';
  }
}

// ── Panneau FAQ ───────────────────────────────────────────────────────────────
function openFaqPanel(){
  var p = document.getElementById('faq-panel');
  if(!p) return;
  p.classList.toggle('open');
  if(p.classList.contains('open')) p.scrollIntoView({behavior:'smooth', block:'nearest'});
}
function closeFaqPanel(){
  var p = document.getElementById('faq-panel');
  if(p) p.classList.remove('open');
}
function openFaq(question){
  closeFaqPanel();
  var inp = document.getElementById('chat-input');
  if(!inp) return;
  inp.value = question;
  inp.scrollIntoView({behavior:'smooth', block:'center'});
  inp.focus();
  setTimeout(function(){ sendMsg(); }, 300);
}

// ── Init ──────────────────────────────────────────────────────────────────────
loadLatestCirculaires();
initDate();
