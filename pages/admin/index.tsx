import Head from 'next/head';
import { useEffect } from 'react';

const css = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#0A0A0A;--ink2:#3A3530;--ink3:#8A8078;
  --gold:#C9A84C;--gold2:#E8C97A;--gold3:#F5E4B0;--gold4:#FBF5E6;
  --white:#FDFCF8;--border:#E8DFC8;--border2:#D4C8A8;
  --up:#4CAF7C;--dn:#E85D5D;
}
body{font-family:'DM Sans',sans-serif;background:var(--white);color:var(--ink);min-height:100vh;overflow-x:hidden}
a{text-decoration:none;color:inherit}
button{cursor:pointer;font-family:'DM Sans',sans-serif;border:none;background:none}
.ticker-wrap{background:var(--ink);overflow:hidden;height:34px;display:flex;align-items:center}
.ticker-track{display:flex;animation:ticker 50s linear infinite;white-space:nowrap}
.ticker-track:hover{animation-play-state:paused}
.t-item{display:flex;align-items:center;gap:10px;padding:0 28px;border-right:1px solid rgba(201,168,76,.15)}
.t-label{font-size:10px;letter-spacing:.14em;color:var(--ink3)}
.t-val{font-size:11px;font-weight:500;color:var(--gold2)}
.t-chg{font-size:10px}.up{color:var(--up)}.dn{color:var(--dn)}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
header{background:var(--white);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:200}
.hdr{max-width:1280px;margin:0 auto;padding:0 2rem;display:flex;align-items:center;height:60px;gap:1.5rem}
.logo{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;letter-spacing:-.02em}
.logo em{color:var(--gold);font-style:normal}
.logo sup{font-size:10px;font-weight:300;color:var(--ink3);letter-spacing:.06em;vertical-align:super}
.mode-toggle{display:flex;align-items:stretch;border:1px solid var(--border2);overflow:hidden;margin-left:1rem}
.mode-btn{padding:0 16px;font-size:11px;letter-spacing:.09em;color:var(--ink3);transition:all .18s;height:34px;display:flex;align-items:center;gap:6px}
.mode-btn.active{background:var(--ink);color:var(--gold2)}
.mode-btn:not(.active):hover{background:var(--gold4);color:var(--gold)}
.mode-divider{width:1px;background:var(--border2)}
.lang-sw{display:flex;gap:2px;margin-left:auto}
.lang-b{padding:4px 10px;font-size:10px;letter-spacing:.1em;color:var(--ink3);border:1px solid transparent;transition:all .12s}
.lang-b.on,.lang-b:hover{color:var(--gold);border-color:var(--gold3);background:var(--gold4)}
.hdr-actions{display:flex;gap:8px}
.btn-in{padding:7px 16px;font-size:11px;letter-spacing:.07em;color:var(--ink2);border:1px solid var(--border2);transition:all .15s}
.btn-in:hover{border-color:var(--gold);color:var(--gold)}
.btn-sub{padding:7px 18px;font-size:11px;letter-spacing:.07em;background:var(--ink);color:var(--gold2);transition:all .15s}
.btn-sub:hover{background:var(--gold);color:var(--ink)}
.main{max-width:1280px;margin:0 auto;padding:3rem 2rem;display:grid;grid-template-columns:1fr 340px;gap:3rem;align-items:start}
.chat-zone{display:flex;flex-direction:column;gap:1.5rem}
.chat-heading h1{font-family:'Cormorant Garamond',serif;font-size:44px;font-weight:300;line-height:1.12;letter-spacing:-.02em}
.chat-heading h1 strong{font-weight:600;color:var(--gold)}
.chat-heading p{margin-top:.75rem;font-size:14px;color:var(--ink3);line-height:1.65;max-width:520px}

/* ═══ CONSOLE CHAT — structure flex fixe ═══ */
.chat-console{
  background:#FEFCF5;
  border:1px solid var(--border);
  display:flex;
  flex-direction:column;
  height:460px;
}
/* zone messages : flex:1 + min-height:0 = scroll interne garanti */
.chat-messages{
  flex:1;
  min-height:0;
  overflow-y:auto;
  padding:1.5rem;
  display:flex;
  flex-direction:column;
  gap:1rem;
}
/* barre de saisie : reste fixe en bas */
.chat-input-row{
  flex-shrink:0;
  border-top:1px solid var(--border);
  display:flex;
  align-items:center;
  padding:.75rem 1rem;
  gap:.75rem;
  background:var(--white);
}

.msg{display:flex;gap:10px;align-items:flex-start;animation:fadeUp .3s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.msg-av{width:28px;height:28px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:500}
.msg-av.ai{background:var(--ink);color:var(--gold2)}
.msg-av.usr{background:var(--gold3);color:var(--ink2)}
.msg-bub{padding:.75rem 1rem;font-size:13px;line-height:1.75;max-width:500px}
.msg-bub.ai{background:var(--white);border:1px solid var(--border);color:var(--ink2)}
.msg-bub.ai p{margin:0 0 1em 0}
.msg-bub.ai p:last-child{margin-bottom:0}
.msg-bub.usr{background:var(--ink);color:var(--gold3)}
.msg-src{font-size:11px;color:var(--ink3);margin-top:.35rem;padding-left:38px}
.msg-src span{color:var(--gold);border-bottom:1px dotted var(--gold3);cursor:pointer}
.typing{display:flex;gap:4px;padding:.75rem 1rem;background:var(--white);border:1px solid var(--border);width:60px}
.dot{width:5px;height:5px;background:var(--gold);border-radius:50%;animation:bbl .8s infinite}
.dot:nth-child(2){animation-delay:.15s}.dot:nth-child(3){animation-delay:.3s}
@keyframes bbl{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}
.chat-inp{flex:1;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--ink);outline:none}
.chat-inp::placeholder{color:var(--ink3)}
.chat-send{padding:8px 20px;background:var(--ink);color:var(--gold2);font-size:11px;letter-spacing:.08em;transition:all .15s}
.chat-send:hover{background:var(--gold);color:var(--ink)}
.quota-bar{display:flex;align-items:center;justify-content:space-between;padding:.6rem 1rem;background:var(--gold4);border:1px solid var(--gold3);border-top:none;font-size:11px;color:var(--ink3)}
.q-dots{display:flex;gap:4px;align-items:center}
.q-dot{width:8px;height:8px;border-radius:50%;background:var(--border2)}
.q-dot.used{background:var(--gold)}
.q-cta{color:var(--gold);cursor:pointer}.q-cta:hover{text-decoration:underline}

/* ═══ MENU CARTES Critère 1 ═══ */
.menu-intro{font-size:13px;color:var(--ink2);line-height:1.7;margin-bottom:.875rem}
.menu-cards{display:flex;flex-direction:column;gap:0;margin:.5rem 0;border:1px solid var(--border)}
.menu-card{display:flex;align-items:center;gap:12px;padding:10px 14px;border:none;border-bottom:1px dashed var(--border2);background:var(--white);cursor:pointer;transition:all .15s;text-align:left;width:100%;font-family:'DM Sans',sans-serif}
.menu-card:last-child{border-bottom:none}
.menu-card:hover{background:var(--gold4)}
.menu-card:active{background:var(--gold3)}
.menu-num{font-size:15px;font-weight:600;color:var(--gold);min-width:26px;font-family:'Cormorant Garamond',serif}
.menu-label{font-size:12px;color:var(--ink2)}
.menu-footer{font-size:11px;color:var(--ink3);margin-top:.625rem;padding:.5rem .75rem;background:var(--gold4);border:1px solid var(--gold3);font-style:italic}

.reg-banner{background:var(--ink);padding:1.25rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.reg-t strong{color:var(--gold2);font-size:14px;display:block;margin-bottom:.2rem}
.reg-t span{font-size:12px;color:var(--ink3)}
.reg-btns{display:flex;gap:.5rem;flex-shrink:0}
.reg-b{padding:8px 18px;font-size:11px;letter-spacing:.07em}
.reg-b.p{background:var(--gold);color:var(--ink)}
.reg-b.o{border:1px solid rgba(201,168,76,.4);color:var(--gold3)}
.reg-b:hover{opacity:.85}
.sidebar{display:flex;flex-direction:column;gap:1.5rem}
.widget{border:1px solid var(--border);background:var(--white)}
.wgt-hdr{padding:.7rem 1rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.wgt-title{font-size:10px;letter-spacing:.14em;color:var(--ink3)}
.live-badge{font-size:9px;letter-spacing:.1em;color:var(--up);display:flex;align-items:center;gap:4px}
.live-dot{width:5px;height:5px;border-radius:50%;background:var(--up);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.rates{padding:.75rem 1rem;display:grid;grid-template-columns:1fr 1fr;gap:.5rem}
.rate{padding:.5rem .75rem;background:var(--gold4);display:flex;flex-direction:column;gap:2px}
.r-pair{font-size:10px;letter-spacing:.08em;color:var(--ink3)}
.r-val{font-size:16px;font-weight:500;color:var(--ink);font-variant-numeric:tabular-nums}
.r-chg{font-size:10px}
.elist{padding:.5rem 1rem}
.eitem{display:flex;justify-content:space-between;align-items:center;padding:.5rem 0;border-bottom:1px solid var(--gold4)}
.eitem:last-child{border:none}
.e-name{font-size:12px;color:var(--ink2)}
.e-price{font-size:13px;font-weight:500;color:var(--ink)}
.e-unit{font-size:10px;color:var(--ink3)}
.nlist,.clist{padding:.5rem 1rem}
.nitem,.citem{padding:.6rem 0;border-bottom:1px solid var(--gold4);cursor:pointer}
.nitem:last-child,.citem:last-child{border:none}
.nitem:hover .n-title,.citem:hover .c-obj{color:var(--gold)}
.n-src{font-size:9px;letter-spacing:.12em;color:var(--gold);margin-bottom:3px;font-weight:500}
.c-num{font-size:10px;color:var(--gold);letter-spacing:.1em;margin-bottom:3px}
.n-title,.c-obj{font-size:12px;line-height:1.45;color:var(--ink2);transition:color .15s}
.c-obj{font-size:11px}
.n-date,.c-date{font-size:10px;color:var(--ink3);margin-top:2px}
#classic-view{display:none;max-width:1280px;margin:2rem auto;padding:0 2rem}
.classic-notice{background:var(--gold4);border:1px solid var(--gold3);padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem;gap:1rem}
.classic-notice span{font-size:13px;color:var(--ink2)}
.c-nav{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem}
.c-nav-item{border:1px solid var(--border);padding:1.25rem 1.5rem;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:.75rem;text-decoration:none}
.c-nav-item:hover{border-color:var(--gold);background:var(--gold4)}
.cn-num{font-size:22px;font-family:'Cormorant Garamond',serif;color:var(--gold);font-weight:600;min-width:36px}
.cn-label{font-size:13px;color:var(--ink2)}
.cn-sub{font-size:11px;color:var(--ink3);margin-top:2px}
.classic-lock{display:flex;align-items:center;gap:.5rem;font-size:11px;color:var(--ink3);margin-top:1.5rem;padding:1rem;border:1px dashed var(--border2)}
.overlay{display:none;position:fixed;inset:0;background:rgba(10,10,10,.6);z-index:500;align-items:center;justify-content:center}
.overlay.open{display:flex}
.modal{background:var(--white);border:1px solid var(--border2);padding:2.5rem;width:100%;max-width:420px;position:relative;animation:fadeUp .2s ease}
.modal h2{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:400;margin-bottom:.75rem}
.modal h2 em{color:var(--gold);font-style:normal}
.modal p{font-size:13px;color:var(--ink3);margin-bottom:1.5rem;line-height:1.6}
.m-field{display:flex;flex-direction:column;gap:.35rem;margin-bottom:1rem}
.m-field label{font-size:11px;letter-spacing:.08em;color:var(--ink3)}
.m-field input,.m-field select{padding:.75rem 1rem;border:1px solid var(--border2);background:var(--white);font-family:'DM Sans',sans-serif;font-size:13px;color:var(--ink);outline:none;transition:border-color .15s}
.m-field input:focus,.m-field select:focus{border-color:var(--gold)}
.m-submit{width:100%;padding:12px;background:var(--ink);color:var(--gold2);font-size:12px;letter-spacing:.1em;margin-top:.5rem;transition:all .15s}
.m-submit:hover{background:var(--gold);color:var(--ink)}
.m-close{position:absolute;top:1rem;right:1rem;font-size:18px;color:var(--ink3);cursor:pointer}
.m-close:hover{color:var(--ink)}
.trial-badge{display:inline-flex;align-items:center;gap:6px;background:var(--gold4);border:1px solid var(--gold3);padding:6px 12px;font-size:11px;color:var(--ink2);margin-bottom:1.5rem}
.trial-badge strong{color:var(--gold)}
footer{border-top:1px solid var(--border);padding:1.5rem 2rem;margin-top:3rem}
.footer-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.footer-logo{font-family:'Cormorant Garamond',serif;font-size:16px;color:var(--ink3)}
.footer-logo em{color:var(--gold);font-style:normal}
.footer-links{display:flex;gap:1.5rem}
.footer-links a{font-size:11px;letter-spacing:.06em;color:var(--ink3);transition:color .12s}
.footer-links a:hover{color:var(--gold)}
.footer-copy{font-size:10px;color:var(--ink3);letter-spacing:.06em}
.dashboard-panel{border:1px solid var(--border);background:var(--white)}
.db-date-row{display:flex;align-items:center;justify-content:space-between;padding:.9rem 1.25rem;background:var(--ink);border-bottom:2px solid var(--gold)}
.db-date-left{display:flex;align-items:baseline;gap:.75rem}
.db-day{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:300;color:var(--gold2);line-height:1}
.db-date-full{font-size:12px;letter-spacing:.08em;color:var(--ink3)}
.db-date-right{display:flex;flex-direction:column;align-items:flex-end;gap:3px}
.db-hijri{font-size:11px;color:var(--ink3);letter-spacing:.04em}
.db-label-free{font-size:9px;letter-spacing:.16em;color:var(--gold);background:rgba(201,168,76,.15);padding:2px 8px}
.db-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:0;border-bottom:1px solid var(--border)}
.db-card{padding:.875rem 1rem;border-right:1px solid var(--border)}
.db-card:last-child{border-right:none}
.db-card-title{font-size:9px;letter-spacing:.14em;color:var(--ink3);margin-bottom:.625rem;padding-bottom:.4rem;border-bottom:1px solid var(--gold4)}
.db-rates{display:flex;flex-direction:column;gap:4px}
.db-rate{display:flex;align-items:center;gap:6px;padding:3px 0}
.db-pair{font-size:10px;letter-spacing:.08em;color:var(--ink3);min-width:28px}
.db-val{font-size:13px;font-weight:500;color:var(--ink);font-variant-numeric:tabular-nums;flex:1}
.db-chg{font-size:10px}
.db-energy{display:flex;flex-direction:column;gap:4px}
.db-erow{display:flex;align-items:center;padding:3px 0;gap:4px}
.db-ename{font-size:11px;color:var(--ink2);flex:1}
.db-eprice{font-size:12px;font-weight:500;color:var(--ink)}
.db-eunit{font-size:10px;color:var(--ink3);min-width:56px;text-align:right}
.db-news{display:flex;flex-direction:column;gap:6px}
.db-nitem{display:flex;align-items:flex-start;gap:8px;padding:4px 0;border-bottom:1px solid var(--gold4)}
.db-nitem:last-child{border:none}
.db-ntag{font-size:9px;letter-spacing:.1em;color:var(--gold);flex-shrink:0;padding-top:1px}
.db-ntitle{font-size:11px;color:var(--ink2);line-height:1.4}
.db-faq-row{padding:.875rem 1.25rem;background:var(--gold4);border-top:1px solid var(--gold3);display:flex;align-items:center;gap:1rem;flex-wrap:wrap}
.db-faq-label{font-size:11px;color:var(--ink3);flex-shrink:0;letter-spacing:.04em}
.db-faq-btns{display:flex;flex-wrap:wrap;gap:.4rem;flex:1}
.db-faq-btn{padding:5px 12px;font-size:11px;border:1px solid var(--border2);color:var(--ink2);background:var(--white);transition:all .15s}
.db-faq-btn:hover{border-color:var(--gold);color:var(--gold)}
.db-faq-all{background:var(--ink);color:var(--gold2);border-color:var(--ink);font-size:10px;letter-spacing:.07em;margin-left:auto}
.db-faq-all:hover{background:var(--gold);color:var(--ink);border-color:var(--gold)}
.faq-panel{display:none;border:1px solid var(--border);border-top:none;background:var(--white)}
.faq-panel.open{display:block}
.faq-panel-hdr{padding:.75rem 1.25rem;background:var(--ink);display:flex;align-items:center;justify-content:space-between}
.faq-panel-title{font-size:11px;letter-spacing:.1em;color:var(--gold2)}
.faq-close{font-size:14px;color:var(--ink3);cursor:pointer}.faq-close:hover{color:var(--gold)}
.faq-grid{display:grid;grid-template-columns:1fr 1fr;gap:0}
.faq-item{padding:.75rem 1.25rem;border-bottom:1px solid var(--gold4);border-right:1px solid var(--gold4);cursor:pointer;transition:background .15s}
.faq-item:hover{background:var(--gold4)}
.faq-item:nth-child(even){border-right:none}
.faq-q{font-size:12px;color:var(--ink2);line-height:1.4}
.faq-cat{font-size:9px;letter-spacing:.1em;color:var(--gold);margin-bottom:3px}
@media(max-width:900px){
  .main{grid-template-columns:1fr}
  .sidebar{display:none}
  .chat-heading h1{font-size:30px}
  .hdr{flex-wrap:wrap;height:auto;padding:.75rem 1rem;gap:.5rem}
}
`;

const bodyHTML = `
<div class="ticker-wrap"><div class="ticker-track">
  <div class="t-item"><span class="t-label">DH/EUR</span><span class="t-val">10.82</span><span class="t-chg up">▲ +0.12%</span></div>
  <div class="t-item"><span class="t-label">DH/USD</span><span class="t-val">9.97</span><span class="t-chg dn">▼ -0.08%</span></div>
  <div class="t-item"><span class="t-label">DH/GBP</span><span class="t-val">12.64</span><span class="t-chg up">▲ +0.05%</span></div>
  <div class="t-item"><span class="t-label">DH/CNY</span><span class="t-val">1.38</span><span class="t-chg up">▲ +0.03%</span></div>
  <div class="t-item"><span class="t-label">BRENT</span><span class="t-val">$83.40</span><span class="t-chg dn">▼ -0.42%</span></div>
  <div class="t-item"><span class="t-label">FRET TANGER</span><span class="t-val">$2 140</span><span class="t-chg up">▲ +2.1%</span></div>
  <div class="t-item"><span class="t-label">PHOSPHATE</span><span class="t-val">$332/t</span><span class="t-chg up">▲ +0.8%</span></div>
  <div class="t-item"><span class="t-label">BLÉ</span><span class="t-val">$198/t</span><span class="t-chg dn">▼ -1.2%</span></div>
  <div class="t-item"><span class="t-label">DH/EUR</span><span class="t-val">10.82</span><span class="t-chg up">▲ +0.12%</span></div>
  <div class="t-item"><span class="t-label">DH/USD</span><span class="t-val">9.97</span><span class="t-chg dn">▼ -0.08%</span></div>
  <div class="t-item"><span class="t-label">DH/GBP</span><span class="t-val">12.64</span><span class="t-chg up">▲ +0.05%</span></div>
  <div class="t-item"><span class="t-label">DH/CNY</span><span class="t-val">1.38</span><span class="t-chg up">▲ +0.03%</span></div>
  <div class="t-item"><span class="t-label">BRENT</span><span class="t-val">$83.40</span><span class="t-chg dn">▼ -0.42%</span></div>
  <div class="t-item"><span class="t-label">FRET TANGER</span><span class="t-val">$2 140</span><span class="t-chg up">▲ +2.1%</span></div>
  <div class="t-item"><span class="t-label">PHOSPHATE</span><span class="t-val">$332/t</span><span class="t-chg up">▲ +0.8%</span></div>
  <div class="t-item"><span class="t-label">BLÉ</span><span class="t-val">$198/t</span><span class="t-chg dn">▼ -1.2%</span></div>
</div></div>

<header><div class="hdr">
  <div class="logo">Douane<em>.</em>ia<sup>MAROC</sup></div>
  <div class="mode-toggle">
    <button class="mode-btn active" id="btn-chat" onclick="setMode('chat')">💬 MODE CHAT IA</button>
    <div class="mode-divider"></div>
    <button class="mode-btn" id="btn-classic" onclick="setMode('classic')">☰ MODE CLASSIQUE</button>
  </div>
  <div class="lang-sw">
    <button class="lang-b on" onclick="setLang('fr',this)">FR</button>
    <button class="lang-b" onclick="setLang('ar',this)">ع</button>
    <button class="lang-b" onclick="setLang('en',this)">EN</button>
  </div>
  <div class="hdr-actions">
    <button class="btn-in" onclick="openModal('login')">CONNEXION</button>
    <button class="btn-sub" onclick="openModal('register')">ESSAI 7 JOURS</button>
  </div>
</div></header>

<div id="chat-view">
<div class="main">
  <div class="chat-zone">
    <div class="chat-heading">
      <h1 id="h1-txt">L'intelligence douanière<br><strong>à portée de question</strong></h1>
      <p id="sub-txt">Posez vos questions sur la réglementation douanière marocaine — circulaires ADII, tarifs, procédures, régimes économiques. Réponses précises et sourcées.</p>
    </div>

    <!-- console chat : hauteur fixe, scroll interne sur .chat-messages uniquement -->
    <div class="chat-console">
      <div class="chat-messages" id="messages">
        <div class="msg">
          <div class="msg-av ai">DI</div>
          <div><div class="msg-bub ai" id="welcome-msg">Bonjour — je suis <strong>Douane.ia</strong>, votre assistant en réglementation douanière marocaine.<br><br>Je m'appuie sur les circulaires officielles de l'ADII pour vous fournir des réponses précises et sourcées.<br><br>Inscrivez-vous pour accéder à <strong>7 jours d'essai complet</strong>.</div></div>
        </div>
      </div>
      <div class="chat-input-row">
        <input class="chat-inp" id="chat-input" type="text" placeholder="Posez votre question douanière..." onkeydown="if(event.key==='Enter')sendMsg()"/>
        <button class="chat-send" onclick="sendMsg()">ENVOYER →</button>
      </div>
    </div>

    <div class="quota-bar">
      <div style="display:flex;align-items:center;gap:8px">
        <span>Essai visiteur :</span>
        <div class="q-dots" style="display:flex;gap:4px">
          <div class="q-dot used" id="d1"></div><div class="q-dot" id="d2"></div><div class="q-dot" id="d3"></div>
        </div>
        <span id="quota-txt">2 questions restantes</span>
      </div>
      <span class="q-cta" onclick="openModal('register')">Créer un compte — 7 jours gratuits →</span>
    </div>

    <div class="dashboard-panel">
      <div class="db-date-row">
        <div class="db-date-left"><span class="db-day" id="db-day"></span><span class="db-date-full" id="db-date-full"></span></div>
        <div class="db-date-right"><span class="db-hijri" id="db-hijri"></span><span class="db-label-free">DONNÉES GRATUITES</span></div>
      </div>
      <div class="db-grid">
        <div class="db-card">
          <div class="db-card-title">COURS DH — BAM</div>
          <div class="db-rates">
            <div class="db-rate"><span class="db-pair">EUR</span><span class="db-val">10.82</span><span class="db-chg up">▲0.12%</span></div>
            <div class="db-rate"><span class="db-pair">USD</span><span class="db-val">9.97</span><span class="db-chg dn">▼0.08%</span></div>
            <div class="db-rate"><span class="db-pair">GBP</span><span class="db-val">12.64</span><span class="db-chg up">▲0.05%</span></div>
            <div class="db-rate"><span class="db-pair">CNY</span><span class="db-val">1.38</span><span class="db-chg up">▲0.03%</span></div>
            <div class="db-rate"><span class="db-pair">SAR</span><span class="db-val">2.66</span><span class="db-chg up">▲0.01%</span></div>
            <div class="db-rate"><span class="db-pair">AED</span><span class="db-val">2.71</span><span class="db-chg dn">▼0.02%</span></div>
          </div>
        </div>
        <div class="db-card">
          <div class="db-card-title">ÉNERGIE & FRET</div>
          <div class="db-energy">
            <div class="db-erow"><span class="db-ename">Pétrole Brent</span><span class="db-eprice">$83.40<span class="dn"> ▼</span></span><span class="db-eunit">$/baril</span></div>
            <div class="db-erow"><span class="db-ename">WTI</span><span class="db-eprice">$79.20<span class="dn"> ▼</span></span><span class="db-eunit">$/baril</span></div>
            <div class="db-erow"><span class="db-ename">Fret Tanger Med</span><span class="db-eprice">$2 140<span class="up"> ▲</span></span><span class="db-eunit">$/conteneur</span></div>
            <div class="db-erow"><span class="db-ename">Indice Baltic</span><span class="db-eprice">1 842<span class="up"> ▲</span></span><span class="db-eunit">points</span></div>
          </div>
        </div>
        <div class="db-card">
          <div class="db-card-title">MATIÈRES PREMIÈRES</div>
          <div class="db-energy">
            <div class="db-erow"><span class="db-ename">Phosphate OCP</span><span class="db-eprice">$332<span class="up"> ▲</span></span><span class="db-eunit">$/tonne</span></div>
            <div class="db-erow"><span class="db-ename">Blé tendre</span><span class="db-eprice">$198<span class="dn"> ▼</span></span><span class="db-eunit">$/tonne</span></div>
            <div class="db-erow"><span class="db-ename">Sucre brut</span><span class="db-eprice">$412<span class="dn"> ▼</span></span><span class="db-eunit">$/tonne</span></div>
            <div class="db-erow"><span class="db-ename">Acier HRC</span><span class="db-eprice">$580<span class="up"> ▲</span></span><span class="db-eunit">$/tonne</span></div>
          </div>
        </div>
        <div class="db-card">
          <div class="db-card-title">ACTUALITÉ DOUANE DU JOUR</div>
          <div class="db-news">
            <div class="db-nitem"><span class="db-ntag">ADII</span><span class="db-ntitle">Dédouanement express Tanger Med — délai réduit à 2h pour les opérateurs OEA</span></div>
            <div class="db-nitem"><span class="db-ntag">TARIFS</span><span class="db-ntitle">Accord Maroc-UK : nouveaux contingents tarifaires produits agricoles effectifs Q2 2026</span></div>
            <div class="db-nitem"><span class="db-ntag">BADR</span><span class="db-ntitle">Mise à jour BADR v4.2 — nouvelle interface déclaration en détail déployée</span></div>
          </div>
        </div>
      </div>
      <div class="db-faq-row">
        <div class="db-faq-label">Vous avez une question spécifique ?</div>
        <div class="db-faq-btns">
          <button class="db-faq-btn" onclick="openFaq('Taux droits import véhicule neuf')">🚗 Import véhicule</button>
          <button class="db-faq-btn" onclick="openFaq('TIC sur les tabacs manufacturés')">🚬 TIC tabacs</button>
          <button class="db-faq-btn" onclick="openFaq('Admission temporaire MRE')">🏠 Admission MRE</button>
          <button class="db-faq-btn" onclick="openFaq('Zones accélération industrielle ZAI')">🏭 Zones ZAI</button>
          <button class="db-faq-btn" onclick="openFaq('TVA importation exonérations')">📋 TVA import</button>
          <button class="db-faq-btn" onclick="openFaq('Dédouanement par anticipation BADR')">⚡ Anticipation</button>
          <button class="db-faq-btn db-faq-all" onclick="openFaqPanel()">QUESTIONS FRÉQUENTES — VOIR TOUT →</button>
        </div>
      </div>
    </div>

    <div class="faq-panel" id="faq-panel">
      <div class="faq-panel-hdr">
        <span class="faq-panel-title">QUESTIONS FRÉQUENTES — CLIQUEZ POUR INITIER LE DIALOGUE</span>
        <span class="faq-close" onclick="closeFaqPanel()">✕</span>
      </div>
      <div class="faq-grid">
        <div class="faq-item" onclick="openFaq('Quel est le taux de droits d import pour un véhicule neuf ?')"><div class="faq-cat">TARIFS</div><div class="faq-q">Taux droits import véhicule neuf</div></div>
        <div class="faq-item" onclick="openFaq('Comment fonctionne l admission temporaire pour les MRE ?')"><div class="faq-cat">RÉGIMES</div><div class="faq-q">Admission temporaire véhicules MRE</div></div>
        <div class="faq-item" onclick="openFaq('Quels sont les taux de TIC sur les tabacs manufacturés ?')"><div class="faq-cat">FISCALITÉ</div><div class="faq-q">TIC — tabacs et cigarettes</div></div>
        <div class="faq-item" onclick="openFaq('Quelles sont les exonérations TVA à l importation ?')"><div class="faq-cat">TVA</div><div class="faq-q">Exonérations TVA à l'importation</div></div>
        <div class="faq-item" onclick="openFaq('Comment fonctionne le dédouanement par anticipation sur BADR ?')"><div class="faq-cat">PROCÉDURES</div><div class="faq-q">Dédouanement par anticipation BADR</div></div>
        <div class="faq-item" onclick="openFaq('Quelles sont les conditions pour opérer dans une zone d accélération industrielle ?')"><div class="faq-cat">ZONES</div><div class="faq-q">Conditions zones d'accélération industrielle</div></div>
        <div class="faq-item" onclick="openFaq('Comment obtenir un badge d accès aux bureaux des douanes ?')"><div class="faq-cat">ADMINISTRATION</div><div class="faq-q">Badge accès bureaux douanes</div></div>
        <div class="faq-item" onclick="openFaq('Quel est le régime douanier pour le blé dur importé ?')"><div class="faq-cat">TARIFS</div><div class="faq-q">Suspension droits sur blé dur</div></div>
        <div class="faq-item" onclick="openFaq('Comment s inscrit un opérateur dans le système BADR via Portnet ?')"><div class="faq-cat">BADR</div><div class="faq-q">Inscription opérateur dans BADR</div></div>
        <div class="faq-item" onclick="openFaq('Quelles sont les sanctions en cas d infraction douanière ?')"><div class="faq-cat">CONTENTIEUX</div><div class="faq-q">Sanctions infractions douanières</div></div>
        <div class="faq-item" onclick="openFaq('Comment fonctionne le régime drawback ?')"><div class="faq-cat">RÉGIMES</div><div class="faq-q">Régime drawback — remboursement droits</div></div>
        <div class="faq-item" onclick="openFaq('Quelles marchandises sont soumises à la taxe sur les bois importés ?')"><div class="faq-cat">FISCALITÉ</div><div class="faq-q">Taxe sur les bois importés</div></div>
      </div>
    </div>

    <div class="reg-banner">
      <div class="reg-t">
        <strong>Accès complet — 7 jours offerts</strong>
        <span>Transitaires · PME importatrices · Cabinets conseil · Directions logistique</span>
      </div>
      <div class="reg-btns">
        <button class="reg-b p" onclick="openModal('register')">CRÉER UN COMPTE</button>
        <button class="reg-b o" onclick="openModal('login')">SE CONNECTER</button>
      </div>
    </div>
  </div>

  <aside class="sidebar">
    <div class="widget">
      <div class="wgt-hdr"><span class="wgt-title">COURS DH — DEVISES</span><span class="live-badge"><div class="live-dot"></div>LIVE</span></div>
      <div class="rates">
        <div class="rate"><span class="r-pair">DH / EUR</span><span class="r-val">10.82</span><span class="r-chg up">▲ +0.12%</span></div>
        <div class="rate"><span class="r-pair">DH / USD</span><span class="r-val">9.97</span><span class="r-chg dn">▼ -0.08%</span></div>
        <div class="rate"><span class="r-pair">DH / GBP</span><span class="r-val">12.64</span><span class="r-chg up">▲ +0.05%</span></div>
        <div class="rate"><span class="r-pair">DH / CNY</span><span class="r-val">1.38</span><span class="r-chg up">▲ +0.03%</span></div>
      </div>
    </div>
    <div class="widget">
      <div class="wgt-hdr"><span class="wgt-title">ÉNERGIE & MATIÈRES</span><span class="live-badge"><div class="live-dot"></div>LIVE</span></div>
      <div class="elist">
        <div class="eitem"><span class="e-name">Pétrole Brent</span><div><div class="e-price">$83.40 <span class="dn" style="font-size:10px">▼</span></div><div class="e-unit">USD / baril</div></div></div>
        <div class="eitem"><span class="e-name">Fret Tanger Med</span><div><div class="e-price">$2 140 <span class="up" style="font-size:10px">▲</span></div><div class="e-unit">USD / conteneur</div></div></div>
        <div class="eitem"><span class="e-name">Phosphate OCP</span><div><div class="e-price">$332 <span class="up" style="font-size:10px">▲</span></div><div class="e-unit">USD / tonne</div></div></div>
        <div class="eitem"><span class="e-name">Blé tendre</span><div><div class="e-price">$198 <span class="dn" style="font-size:10px">▼</span></div><div class="e-unit">USD / tonne</div></div></div>
      </div>
    </div>
    <div class="widget">
      <div class="wgt-hdr"><span class="wgt-title">ACTUALITÉS DOUANE MAROC</span></div>
      <div class="nlist">
        <div class="nitem" onclick="window.open('https://www.douane.gov.ma','_blank')"><div class="n-src">douane.gov.ma</div><div class="n-title">Site officiel ADII — Circulaires, procédures, actualités réglementaires</div><div class="n-date">Official ↗</div></div>
        <div class="nitem" onclick="window.open('https://medias24.com/categorie/economie/','_blank')"><div class="n-src">medias24.com</div><div class="n-title">Économie marocaine — Commerce extérieur, douane, fiscalité</div><div class="n-date">Quotidien ↗</div></div>
        <div class="nitem" onclick="window.open('https://www.leconomiste.com','_blank')"><div class="n-src">leconomiste.com</div><div class="n-title">L'Économiste — Premier quotidien économique du Maroc</div><div class="n-date">Quotidien ↗</div></div>
        <div class="nitem" onclick="window.open('https://www.portnet.ma/','_blank')"><div class="n-src">portnet.ma</div><div class="n-title">PortNet — Guichet unique commerce extérieur Maroc</div><div class="n-date">Officiel ↗</div></div>
      </div>
    </div>
    <div class="widget">
      <div class="wgt-hdr"><span class="wgt-title">NOUVELLES CIRCULAIRES ADII</span><span class="live-badge"><div class="live-dot"></div>BASE LIVE</span></div>
      <div class="clist" id="circulaires-list"><div style="padding:.75rem 1rem;font-size:11px;color:var(--ink3)">Chargement...</div></div>
    </div>
  </aside>
</div>
</div>

<div id="classic-view">
  <div class="classic-notice">
    <span>Vous êtes en <strong>mode classique</strong> — accès complet aux modules réservé aux abonnés.</span>
    <button class="btn-sub" onclick="setMode('chat')" style="flex-shrink:0">← RETOUR CHAT IA</button>
  </div>
  <div class="c-nav">
    <a href="/modules/faq" class="c-nav-item"><span class="cn-num">00</span><div><div class="cn-label">FAQ Douanière</div><div class="cn-sub">173 questions — Titres 1–11</div></div></a>
    <a href="/modules/audit" class="c-nav-item"><span class="cn-num">05</span><div><div class="cn-label">Audit Douanier</div><div class="cn-sub">Scoring conformité, radar chart</div></div></a>
    <a href="/modules/risques" class="c-nav-item"><span class="cn-num">12</span><div><div class="cn-label">Contrôle des Risques</div><div class="cn-sub">38 situations analysées</div></div></a>
    <a href="/modules/simulateur" class="c-nav-item" style="border-color:var(--gold)"><span class="cn-num" style="color:var(--gold)">SIM</span><div><div class="cn-label">Simulateur Droits & Taxes</div><div class="cn-sub">Cascade DI · TVA · TIC · PFI</div></div></a>
    <a href="/modules/comparateur" class="c-nav-item" style="border-color:var(--gold)"><span class="cn-num" style="color:var(--gold)">CMP</span><div><div class="cn-label">Comparateur Régimes</div><div class="cn-sub">9 régimes CDII · Coûts réels</div></div></a>
    <a href="/modules/index-commerce" class="c-nav-item" style="border-color:var(--gold)"><span class="cn-num" style="color:var(--gold)">ICI</span><div><div class="cn-label">Index Commerce Intl.</div><div class="cn-sub">18 pays · 10 rubriques</div></div></a>
    <a href="/community" class="c-nav-item"><span class="cn-num">COM</span><div><div class="cn-label">Communauté</div><div class="cn-sub">Forum · Q&A · Circulaires live</div></div></a>
    <div class="c-nav-item" onclick="openModal('register')"><span class="cn-num">+</span><div><div class="cn-label">Procédures Douanières</div><div class="cn-sub">Dédouanement, déclarations BADR</div></div></div>
    <div class="c-nav-item" onclick="openModal('register')"><span class="cn-num">+</span><div><div class="cn-label">Tarifs & Fiscalité</div><div class="cn-sub">17 881 positions SH</div></div></div>
    <div class="c-nav-item" onclick="openModal('register')"><span class="cn-num">+</span><div><div class="cn-label">Mon Compte</div><div class="cn-sub">Profil, abonnement, équipe</div></div></div>
  </div>
  <div class="classic-lock">
    <span style="color:var(--gold);font-size:16px">🔒</span>
    <span>L'accès complet aux modules est disponible après inscription. <strong style="color:var(--gold);cursor:pointer" onclick="openModal('register')">Commencer l'essai de 7 jours →</strong></span>
  </div>
</div>

<footer><div class="footer-inner">
  <div class="footer-logo">Douane<em>.</em>ia<sup style="font-size:9px;color:#8A8078;letter-spacing:.06em;vertical-align:super"> MAROC</sup></div>
  <div class="footer-links"><a href="#">Mentions légales</a><a href="#">Confidentialité</a><a href="#">Tarifs</a><a href="#">Contact</a><a href="#">API</a></div>
  <div class="footer-copy">© 2026 DOUANE.IA — TOUS DROITS RÉSERVÉS</div>
</div></footer>

<div class="overlay" id="overlay-register" onclick="if(event.target===this)closeModal('register')">
  <div class="modal">
    <span class="m-close" onclick="closeModal('register')">✕</span>
    <h2>Rejoindre <em>Douane.ia</em></h2>
    <div class="trial-badge">✦ <strong>7 jours d'accès complet offerts</strong> — sans carte bancaire</div>
    <div class="m-field"><label>PRÉNOM & NOM</label><input type="text" placeholder="Mohamed Alami"/></div>
    <div class="m-field"><label>EMAIL PROFESSIONNEL</label><input type="email" placeholder="m.alami@entreprise.ma"/></div>
    <div class="m-field"><label>PROFIL</label>
      <select><option>Transitaire / Agent en douane</option><option>Importateur / Exportateur PME</option><option>Directeur logistique</option><option>Cabinet conseil douanier</option><option>Autre</option></select>
    </div>
    <div class="m-field"><label>MOT DE PASSE</label><input type="password" placeholder="••••••••"/></div>
    <button class="m-submit">DÉMARRER MON ESSAI GRATUIT →</button>
    <p style="text-align:center;font-size:11px;color:var(--ink3);margin-top:1rem">Déjà inscrit ? <span style="color:var(--gold);cursor:pointer" onclick="closeModal('register');openModal('login')">Se connecter</span></p>
  </div>
</div>
<div class="overlay" id="overlay-login" onclick="if(event.target===this)closeModal('login')">
  <div class="modal">
    <span class="m-close" onclick="closeModal('login')">✕</span>
    <h2>Connexion à <em>Douane.ia</em></h2>
    <p>Accédez à votre espace et reprenez là où vous en étiez.</p>
    <div class="m-field"><label>EMAIL</label><input type="email" placeholder="votre@email.ma"/></div>
    <div class="m-field"><label>MOT DE PASSE</label><input type="password" placeholder="••••••••"/></div>
    <button class="m-submit">SE CONNECTER →</button>
    <p style="text-align:center;font-size:11px;color:var(--ink3);margin-top:1rem">Pas encore de compte ? <span style="color:var(--gold);cursor:pointer" onclick="closeModal('login');openModal('register')">Essai gratuit 7 jours</span></p>
  </div>
</div>`;

const scriptContent = `
const LANGS={
  fr:{h1:"L'intelligence douanière<br><strong>à portée de question</strong>",sub:"Posez vos questions sur la réglementation douanière marocaine — circulaires ADII, tarifs, procédures, régimes économiques.",ph:"Posez votre question douanière...",welcome:"Bonjour — je suis <strong>Douane.ia</strong>, votre assistant en réglementation douanière marocaine.<br><br>Je m'appuie sur les circulaires officielles de l'ADII pour vous fournir des réponses précises et sourcées.<br><br>Inscrivez-vous pour accéder à <strong>7 jours d'essai complet</strong>."},
  ar:{h1:"الذكاء الجمركي<br><strong>في متناول سؤالك</strong>",sub:"اطرح أسئلتك حول التنظيم الجمركي المغربي — المناشير، التعريفات، الإجراءات.",ph:"اطرح سؤالك الجمركي...",welcome:"مرحباً — أنا <strong>Douane.ia</strong>، مساعدك في التنظيم الجمركي المغربي.<br><br>أستند إلى المناشير الرسمية للإدارة العامة للجمارك.<br><br>سجّل للاستفادة من <strong>7 أيام تجريبية مجانية</strong>."},
  en:{h1:"Moroccan customs intelligence<br><strong>at your fingertips</strong>",sub:"Ask questions about Moroccan customs regulations — ADII circulars, tariffs, procedures, economic regimes.",ph:"Ask your customs question...",welcome:"Hello — I am <strong>Douane.ia</strong>, your Moroccan customs regulation assistant.<br><br>I draw from official ADII circulars to provide precise, sourced answers.<br><br>Sign up to access your <strong>7-day free trial</strong>."}
};

function isMenuResponse(t){
  var m=t.match(/\*\*\d{1,2}\.\*\*/g);
  return m&&m.length>=3;
}

function parseMenu(t){
  var introEnd=t.indexOf('**1.**');
  var intro=introEnd>-1?t.slice(0,introEnd).trim():'';
  var itemRe=/\*\*(\d{1,2})\.\*\*\s*([^*]+?)(?=\s*\*\*\d{1,2}\.\*\*|\s*→|$)/g;
  var items=[];var m;
  while((m=itemRe.exec(t))!==null){items.push({num:m[1],label:m[2].trim()});}
  var footerM=t.match(/(→.+)$/);
  var footer=footerM?footerM[1].trim():'';
  return{intro:intro,items:items,footer:footer};
}

function renderMenuCards(t){
  var p=parseMenu(t);
  var html='';
  if(p.intro)html+='<div class="menu-intro">'+escHtml(p.intro)+'</div>';
  html+='<div class="menu-cards">';
  for(var i=0;i<p.items.length;i++){
    var item=p.items[i];
    html+='<button class="menu-card" onclick="sendChoice('+item.num+')">'
      +'<span class="menu-num">'+item.num+'.</span>'
      +'<span class="menu-label">'+escHtml(item.label)+'</span>'
      +'</button>';
  }
  html+='</div>';
  if(p.footer)html+='<div class="menu-footer">'+escHtml(p.footer)+'</div>';
  return html;
}

function mdToHtml(t){
  var s=escHtml(t);
  s=s.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
  s='<p>'+s+'</p>';
  s=s.replace(/\\n\\n/g,'</p><p>');
  s=s.replace(/\\n/g,'<br>');
  s=s.replace(/<p><\/p>/g,'');
  return s;
}

function escHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function sendChoice(n){
  document.getElementById('chat-input').value=String(n);
  sendMsg();
}

function setMode(m){
  document.getElementById('chat-view').style.display=m==='chat'?'block':'none';
  document.getElementById('classic-view').style.display=m==='classic'?'block':'none';
  document.getElementById('btn-chat').classList.toggle('active',m==='chat');
  document.getElementById('btn-classic').classList.toggle('active',m==='classic');
}

function setLang(l,btn){
  document.querySelectorAll('.lang-b').forEach(function(b){b.classList.remove('on');});
  if(btn)btn.classList.add('on');
  var d=LANGS[l];
  document.getElementById('h1-txt').innerHTML=d.h1;
  document.getElementById('sub-txt').textContent=d.sub;
  document.getElementById('chat-input').placeholder=d.ph;
  document.getElementById('welcome-msg').innerHTML=d.welcome;
  document.documentElement.lang=l;
  document.documentElement.dir=l==='ar'?'rtl':'ltr';
}

var quota=2;
function sendMsg(){
  var inp=document.getElementById('chat-input');
  var msg=inp.value.trim();
  if(!msg)return;
  if(quota<=0){openModal('register');return;}
  addMsg(msg,'usr');
  inp.value='';
  quota--;
  updateQuota();
  showTyping();
  fetch('/api/chat',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({message:msg,channel:'web',sessionId:getSid()})
  })
  .then(function(r){return r.json();})
  .then(function(d){removeTyping();addMsg(d.response||'Erreur.','ai',d.sources);})
  .catch(function(){removeTyping();addMsg('Erreur de connexion. Veuillez réessayer.','ai');});
}

function addMsg(text,role,sources){
  var box=document.getElementById('messages');
  var wrap=document.createElement('div');wrap.className='msg';
  var av=document.createElement('div');av.className='msg-av '+(role==='ai'?'ai':'usr');av.textContent=role==='ai'?'DI':'Vous';
  var right=document.createElement('div');
  var bub=document.createElement('div');bub.className='msg-bub '+role;
  if(role==='ai'){
    bub.innerHTML=isMenuResponse(text)?renderMenuCards(text):mdToHtml(text);
  }else{
    bub.textContent=text;
  }
  right.appendChild(bub);
  if(sources&&sources.length){
    var s=document.createElement('div');s.className='msg-src';
    s.innerHTML='Source : '+sources.map(function(x){
      return '<span title="'+escHtml(x.objet)+'">Circ. N°'+x.numero+' ('+x.date+')</span>';
    }).join(' · ');
    right.appendChild(s);
  }
  wrap.appendChild(av);wrap.appendChild(right);
  box.appendChild(wrap);
  box.scrollTop=box.scrollHeight;
}

function showTyping(){
  var box=document.getElementById('messages');
  var t=document.createElement('div');t.className='msg';t.id='typing';
  t.innerHTML='<div class="msg-av ai">DI</div><div class="typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
  box.appendChild(t);box.scrollTop=box.scrollHeight;
}
function removeTyping(){var t=document.getElementById('typing');if(t)t.remove();}

function updateQuota(){
  var dots=[document.getElementById('d1'),document.getElementById('d2'),document.getElementById('d3')];
  dots.forEach(function(d,i){if(d)d.classList.toggle('used',i<(3-quota));});
  var el=document.getElementById('quota-txt');
  if(el)el.textContent=quota>0?quota+' question'+(quota>1?'s':'')+' restante'+(quota>1?'s':''):'Limite atteinte';
  if(quota<=0)setTimeout(function(){openModal('register');},1500);
}

function getSid(){
  var s=sessionStorage.getItem('dia');
  if(!s){s=Math.random().toString(36).slice(2);sessionStorage.setItem('dia',s);}
  return s;
}
function openModal(n){document.getElementById('overlay-'+n).classList.add('open');}
function closeModal(n){document.getElementById('overlay-'+n).classList.remove('open');}
document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeModal('register');closeModal('login');}});

function initDate(){
  var now=new Date();
  var days=['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  var months=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  document.getElementById('db-day').textContent=days[now.getDay()];
  document.getElementById('db-date-full').textContent=now.getDate()+' '+months[now.getMonth()]+' '+now.getFullYear();
  document.getElementById('db-hijri').textContent=toHijri(now);
}
function toHijri(d){
  var jd=Math.floor((d.getTime()/86400000)+2440587.5);
  var l=jd-1948440+10632;var n=Math.floor((l-1)/10631);l=l-10631*n+354;
  var j=(Math.floor((10985-l)/5965))+(Math.floor((l-317)/5536))+(Math.floor(l/15)+1)%2+(Math.floor((3+11*Math.floor(((l+5)%30)/5))/11))%2;
  l=l-Math.floor((29.5001*j+29)/30)+1;
  var year=19*n+j-16;var month=Math.floor((l-1)/29)+1;var day=l%(month===1?30:29)||1;
  var hM=['Moharram','Safar','Rabi I','Rabi II','Joumada I','Joumada II','Rajab','Chaabane','Ramadan','Chawwal','Dhou al-Qi','Dhou al-Hi'];
  return day+' '+hM[month-1]+' '+year+' H';
}

async function loadLatestCirculaires(){
  var el=document.getElementById('circulaires-list');
  if(!el)return;
  try{
    var URL='https://vfgjihkshhmnwjwbnrfz.supabase.co';
    var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmZ2ppaGtzaGhtbndqd2JucmZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTY2NzAsImV4cCI6MjA4OTc3MjY3MH0.5Fttwav2CqiVG8jOFeUuTYyPsFZiewr9uujCb4pXVVM';
    var res=await fetch(URL+'/rest/v1/circulaires?select=numero,date,objet&order=date.desc&limit=3',{headers:{'apikey':KEY,'Authorization':'Bearer '+KEY}});
    var data=await res.json();
    if(!Array.isArray(data)||!data.length){el.innerHTML='<div style="padding:.75rem 1rem;font-size:11px;color:var(--ink3)">Aucune circulaire.</div>';return;}
    el.innerHTML=data.map(function(c){
      var d=c.date?new Date(c.date):null;
      var ds=d?d.toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'}):'';
      var obj=c.objet?c.objet.slice(0,60)+(c.objet.length>60?'…':''):'';
      return '<div class="citem" onclick="openFaq(\'Que dit la circulaire '+c.numero+' ?\')"><div class="c-num">N° '+c.numero+'</div><div class="c-obj">'+escHtml(obj)+'</div><div class="c-date">'+ds+'</div></div>';
    }).join('');
  }catch(e){el.innerHTML='<div style="padding:.75rem 1rem;font-size:11px;color:var(--ink3)">Erreur de chargement.</div>';}
}

function openFaqPanel(){
  var p=document.getElementById('faq-panel');
  p.classList.toggle('open');
  if(p.classList.contains('open'))p.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function closeFaqPanel(){document.getElementById('faq-panel').classList.remove('open');}
function openFaq(question){
  closeFaqPanel();
  document.getElementById('chat-input').value=question;
  document.getElementById('chat-input').scrollIntoView({behavior:'smooth',block:'center'});
  document.getElementById('chat-input').focus();
  setTimeout(function(){sendMsg();},300);
}

loadLatestCirculaires();
initDate();
`;

export default function HomePage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.textContent = scriptContent;
    document.body.appendChild(script);
    return () => { try { document.body.removeChild(script); } catch(e){} };
  }, []);

  return (
    <>
      <Head>
        <title>Douane.ia — Intelligence Douanière Marocaine</title>
        <meta name="description" content="Assistant intelligent en réglementation douanière marocaine." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: bodyHTML }} />
    </>
  );
}
