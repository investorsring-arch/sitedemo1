import Head from 'next/head';
import Script from 'next/script';

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
.chat-console{background:#FEFCF5;border:1px solid var(--border);display:flex;flex-direction:column;height:460px}
.chat-messages{flex:1;min-height:0;overflow-y:auto;padding:1.5rem;display:flex;flex-direction:column;gap:1rem}
.chat-input-row{flex-shrink:0;border-top:1px solid var(--border);display:flex;align-items:flex-end;padding:.75rem 1rem;gap:.75rem;background:var(--white)}
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
.chat-inp{flex:1;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--ink);outline:none;resize:none;min-height:62px;line-height:1.6;padding-top:2px}
.chat-inp::placeholder{color:var(--ink3)}
.chat-send{padding:8px 20px;background:var(--ink);color:var(--gold2);font-size:11px;letter-spacing:.08em;transition:all .15s;flex-shrink:0;align-self:flex-end}
.chat-send:hover{background:var(--gold);color:var(--ink)}
.quota-bar{display:flex;align-items:center;justify-content:space-between;padding:.6rem 1rem;background:var(--gold4);border:1px solid var(--gold3);border-top:none;font-size:11px;color:var(--ink3)}
.q-dots{display:flex;gap:4px;align-items:center}
.q-dot{width:8px;height:8px;border-radius:50%;background:var(--border2)}
.q-dot.used{background:var(--gold)}
.q-cta{color:var(--gold);cursor:pointer}.q-cta:hover{text-decoration:underline}
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
.classic-section-label{font-size:9px;letter-spacing:.18em;color:var(--ink3);padding:.25rem 0 .75rem 0;margin-top:1.25rem}
.classic-section-label:first-child{margin-top:0}
.c-nav{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem}
.c-nav-item{border:1px solid var(--border);padding:1.25rem 1.5rem;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:.75rem;text-decoration:none}
.c-nav-item:hover{border-color:var(--gold);background:var(--gold4)}
.cn-num{font-size:22px;font-family:'Cormorant Garamond',serif;color:var(--gold);font-weight:600;min-width:36px}
.cn-label{font-size:13px;color:var(--ink2)}
.cn-sub{font-size:11px;color:var(--ink3);margin-top:2px}
.c-nav-admin .c-nav-item{border-color:var(--border2);background:rgba(10,10,10,.02)}
.c-nav-admin .c-nav-item:hover{border-color:var(--gold);background:var(--gold4)}
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
.db-info-row{padding:.875rem 1.25rem 1rem;background:var(--gold4);border-top:1px solid var(--gold3)}
.db-info-lbl{font-size:9px;letter-spacing:.16em;color:var(--ink3);font-weight:600;margin-bottom:.625rem;display:flex;align-items:center;gap:5px}
.db-info-lbl::before{content:"ℹ";font-size:11px;color:var(--gold)}
.db-dd-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.5rem}
.db-dd{position:relative;background:var(--white);border:1px solid var(--border2);transition:border-color .15s}
.db-dd:hover{border-color:var(--gold)}
.db-dd.open{border-color:var(--gold);box-shadow:0 4px 14px rgba(201,168,76,.18);z-index:50}
.db-dd-btn{width:100%;display:flex;align-items:center;gap:5px;padding:6px 9px;cursor:pointer;font-family:'DM Sans',sans-serif;text-align:left}
.db-dd-ico{font-size:13px;flex-shrink:0}
.db-dd-lbl{flex:1;font-size:10px;letter-spacing:.05em;color:var(--ink2);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.db-dd-cnt{font-size:9px;color:var(--ink3);background:var(--gold4);border:1px solid var(--gold3);padding:1px 5px;flex-shrink:0}
.db-dd-arr{font-size:8px;color:var(--gold);flex-shrink:0;transition:transform .18s}
.db-dd.open .db-dd-arr{transform:rotate(180deg)}
.db-dd-panel{display:none;position:absolute;top:100%;left:-1px;right:-1px;background:var(--white);border:1px solid var(--gold);border-top:none;z-index:100;box-shadow:0 8px 20px rgba(10,10,10,.12)}
.db-dd.open .db-dd-panel{display:block}
.db-dd-srch{display:flex;align-items:center;gap:5px;padding:5px 8px;border-bottom:1px solid var(--border);background:var(--gold4)}
.db-dd-srch::before{content:"🔍";font-size:10px}
.db-dd-inp{flex:1;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:11px;color:var(--ink);outline:none}
.db-dd-inp::placeholder{color:var(--ink3)}
.db-dd-sel{width:100%;border:none;outline:none;font-family:'DM Sans',sans-serif;font-size:11px;color:var(--ink2);background:var(--white);max-height:150px;overflow-y:auto;cursor:pointer}
.db-dd-sel option{padding:4px 10px}
.db-dd-res{display:none;padding:4px 9px;font-size:10px;color:var(--ink2);background:var(--gold4);border-top:1px solid var(--gold3);line-height:1.4}
.db-dd-res.vis{display:block}
.db-dd-res strong{color:var(--gold);font-weight:600}
@media(max-width:900px){.db-dd-grid{grid-template-columns:1fr 1fr}}
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
      <p id="sub-txt">Posez vos questions sur la réglementation douanière marocaine — données réglementaires ADII, tarifs, procédures, régimes économiques. Réponses précises et sourcées.</p>
    </div>
    <div class="chat-console">
      <div class="chat-messages" id="messages">
        <div class="msg">
          <div class="msg-av ai">DI</div>
          <div><div class="msg-bub ai" id="welcome-msg">Bonjour — je suis <strong>Douane.ia</strong>, votre assistant en réglementation douanière marocaine.<br>Je m'appuie sur les données réglementaires officielles de l'ADII pour vous fournir des réponses précises et sourcées.<br>Inscrivez-vous pour accéder à <strong>7 jours d'essai complet</strong>.</div></div>
        </div>
      </div>
      <div class="chat-input-row">
        <textarea class="chat-inp" id="chat-input" rows="3" placeholder="Posez votre question douanière..." onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMsg()}"></textarea>
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
        <div class="db-date-right"><span class="db-label-free">DONNÉES UTILES</span></div>
      </div>
      <div class="db-grid">
        <div class="db-card"><div class="db-card-title">COURS DH — BAM</div><div class="db-rates">
          <div class="db-rate"><span class="db-pair">EUR</span><span class="db-val">10.82</span><span class="db-chg up">▲0.12%</span></div>
          <div class="db-rate"><span class="db-pair">USD</span><span class="db-val">9.97</span><span class="db-chg dn">▼0.08%</span></div>
          <div class="db-rate"><span class="db-pair">GBP</span><span class="db-val">12.64</span><span class="db-chg up">▲0.05%</span></div>
          <div class="db-rate"><span class="db-pair">CNY</span><span class="db-val">1.38</span><span class="db-chg up">▲0.03%</span></div>
          <div class="db-rate"><span class="db-pair">SAR</span><span class="db-val">2.66</span><span class="db-chg up">▲0.01%</span></div>
          <div class="db-rate"><span class="db-pair">AED</span><span class="db-val">2.71</span><span class="db-chg dn">▼0.02%</span></div>
        </div></div>
        <div class="db-card"><div class="db-card-title">ÉNERGIE & FRET</div><div class="db-energy">
          <div class="db-erow"><span class="db-ename">Pétrole Brent</span><span class="db-eprice">$83.40<span class="dn"> ▼</span></span><span class="db-eunit">$/baril</span></div>
          <div class="db-erow"><span class="db-ename">WTI</span><span class="db-eprice">$79.20<span class="dn"> ▼</span></span><span class="db-eunit">$/baril</span></div>
          <div class="db-erow"><span class="db-ename">Fret Tanger Med</span><span class="db-eprice">$2 140<span class="up"> ▲</span></span><span class="db-eunit">$/conteneur</span></div>
          <div class="db-erow"><span class="db-ename">Indice Baltic</span><span class="db-eprice">1 842<span class="up"> ▲</span></span><span class="db-eunit">points</span></div>
        </div></div>
        <div class="db-card"><div class="db-card-title">MATIÈRES PREMIÈRES</div><div class="db-energy">
          <div class="db-erow"><span class="db-ename">Phosphate OCP</span><span class="db-eprice">$332<span class="up"> ▲</span></span><span class="db-eunit">$/tonne</span></div>
          <div class="db-erow"><span class="db-ename">Blé tendre</span><span class="db-eprice">$198<span class="dn"> ▼</span></span><span class="db-eunit">$/tonne</span></div>
          <div class="db-erow"><span class="db-ename">Sucre brut</span><span class="db-eprice">$412<span class="dn"> ▼</span></span><span class="db-eunit">$/tonne</span></div>
          <div class="db-erow"><span class="db-ename">Acier HRC</span><span class="db-eprice">$580<span class="up"> ▲</span></span><span class="db-eunit">$/tonne</span></div>
        </div></div>
        <div class="db-card"><div class="db-card-title">ACTUALITÉ DOUANE DU JOUR</div><div class="db-news">
          <div class="db-nitem"><span class="db-ntag">ADII</span><span class="db-ntitle">Dédouanement express Tanger Med — délai réduit à 2h pour les opérateurs OEA</span></div>
          <div class="db-nitem"><span class="db-ntag">TARIFS</span><span class="db-ntitle">Accord Maroc-UK : nouveaux contingents tarifaires produits agricoles effectifs Q2 2026</span></div>
          <div class="db-nitem"><span class="db-ntag">BADR</span><span class="db-ntitle">Mise à jour BADR v4.2 — nouvelle interface déclaration en détail déployée</span></div>
        </div></div>
      </div>
      <div class="db-info-row">
        <div class="db-info-lbl">INFORMATIONS UTILES</div>
        <div class="db-dd-grid">
          <div class="db-dd" id="dd1">
            <button class="db-dd-btn" onclick="tDD('dd1')"><span class="db-dd-ico">🏛️</span><span class="db-dd-lbl">Codes Bureaux DUM</span><span class="db-dd-cnt">50</span><span class="db-dd-arr">▼</span></button>
            <div class="db-dd-panel"><div class="db-dd-srch"><input class="db-dd-inp" type="text" placeholder="Code ou bureau..." oninput="fDD('dd1',this.value)"></div><select class="db-dd-sel" size="5" onchange="pDD('dd1',this)"><option value="">— Sélectionner —</option></select></div>
            <div class="db-dd-res" id="r-dd1"></div>
          </div>
          <div class="db-dd" id="dd2">
            <button class="db-dd-btn" onclick="tDD('dd2')"><span class="db-dd-ico">📋</span><span class="db-dd-lbl">Codes Régimes</span><span class="db-dd-cnt">268</span><span class="db-dd-arr">▼</span></button>
            <div class="db-dd-panel"><div class="db-dd-srch"><input class="db-dd-inp" type="text" placeholder="Code ou libellé..." oninput="fDD('dd2',this.value)"></div><select class="db-dd-sel" size="5" onchange="pDD('dd2',this)"><option value="">— Sélectionner —</option></select></div>
            <div class="db-dd-res" id="r-dd2"></div>
          </div>
          <div class="db-dd" id="dd3">
            <button class="db-dd-btn" onclick="tDD('dd3')"><span class="db-dd-ico">🔖</span><span class="db-dd-lbl">Codes Franchises</span><span class="db-dd-cnt">89</span><span class="db-dd-arr">▼</span></button>
            <div class="db-dd-panel"><div class="db-dd-srch"><input class="db-dd-inp" type="text" placeholder="Code ou désignation..." oninput="fDD('dd3',this.value)"></div><select class="db-dd-sel" size="5" onchange="pDD('dd3',this)"><option value="">— Sélectionner —</option></select></div>
            <div class="db-dd-res" id="r-dd3"></div>
          </div>
          <div class="db-dd" id="dd4">
            <button class="db-dd-btn" onclick="tDD('dd4')"><span class="db-dd-ico">⚖️</span><span class="db-dd-lbl">Centres RC / Tribunaux</span><span class="db-dd-cnt">67</span><span class="db-dd-arr">▼</span></button>
            <div class="db-dd-panel"><div class="db-dd-srch"><input class="db-dd-inp" type="text" placeholder="N° ou ville..." oninput="fDD('dd4',this.value)"></div><select class="db-dd-sel" size="5" onchange="pDD('dd4',this)"><option value="">— Sélectionner —</option></select></div>
            <div class="db-dd-res" id="r-dd4"></div>
          </div>
        </div>
      </div>
    </div>
    <script>(function(){
var D={dd1:[{c:"000",l:"Administration Centrale"},{c:"100",l:"AGADIR"},{c:"101",l:"LAAYOUNE"},{c:"102",l:"LAAYOUNE/AEROPORT"},{c:"103",l:"LAAYOUNE/COLIS POSTAUX"},{c:"104",l:"ED-DAKHLA"},{c:"105",l:"TAN-TAN"},{c:"106",l:"AGADIR/AEROPORT AL MASSIRA"},{c:"200",l:"SAFI"},{c:"201",l:"MARRAKECH"},{c:"202",l:"ESSAOUIRA"},{c:"203",l:"OUARZAZATE"},{c:"204",l:"MARRAKECH/MENARA"},{c:"300",l:"CASABLANCA-MEAD"},{c:"301",l:"CASA/NOUACEUR-FRET"},{c:"302",l:"MOHAMMEDIA"},{c:"303",l:"EL-JADIDA"},{c:"304",l:"CASA/COLIS-POSTAUX"},{c:"305",l:"JORF LASFAR"},{c:"306",l:"CASABLANCA-EXTERIEUR"},{c:"307",l:"CASA/GARANTIE"},{c:"308",l:"NOUASSER/AEROGARE"},{c:"309",l:"CASA/PORT"},{c:"310",l:"SETTAT"},{c:"311",l:"BERRECHID"},{c:"400",l:"TANGER/PORT"},{c:"401",l:"TANGER-VILLE"},{c:"402",l:"TANGER/GARANTIE ET I.I."},{c:"403",l:"KENITRA"},{c:"404",l:"RABAT-SALE/AEROPORT"},{c:"405",l:"RABAT"},{c:"406",l:"LARACHE"},{c:"407",l:"TETOUAN"},{c:"408",l:"BAB-SEBTA"},{c:"409",l:"RABAT-VILLE/COLIS-POSTAUX/ONCF"},{c:"410",l:"TANGER/POSTES ET VEHICULES"},{c:"411",l:"TANGER-MEDITERRANEE"},{c:"412",l:"TANGER IBN BATOUTA"},{c:"500",l:"FES VILLE"},{c:"501",l:"AL-HOCEIMA"},{c:"502",l:"FES-SAIS/AEROPORT"},{c:"503",l:"FES/GARANTIE ET I.I."},{c:"504",l:"TAZA"},{c:"600",l:"OUJDA"},{c:"601",l:"OUJDA/ZOUJ BEGHAL"},{c:"602",l:"NADOR"},{c:"603",l:"AHFIR"},{c:"607",l:"NADOR PORT"},{c:"609",l:"BAB MELLILIA"},{c:"700",l:"MEKNES"}],
dd2:[{c:"000",l:"REGIME ANCIEN PRIMAIRE"},{c:"002",l:"TRANSBORDEMENT SUR ETRANGER"},{c:"003",l:"TRANSPORT MARITIME INTERIEUR"},{c:"004",l:"DECLARATION OCCASIONNELLE IMPORT"},{c:"005",l:"DECLARATION OCCASIONNELLE EXPORT"},{c:"006",l:"DECLARATION PROVISOIRE IMPORT SIMPLE"},{c:"007",l:"DECLARATION PROVISOIRE IMPORT REGIMES ECONOMIQUES"},{c:"008",l:"ADMISSION TEMPORAIRE CONTENEURS"},{c:"009",l:"ADMISSION TEMPORAIRE VEHICULES USAGE COMMERCIAL"},{c:"010",l:"MISE A LA CONSOMMATION DIRECTE"},{c:"011",l:"EQUIPEMENT DEFENSE NATIONALE"},{c:"012",l:"INVESTISSEMENT"},{c:"013",l:"IMPORT. ACCORDS/CONVENTIONS"},{c:"014",l:"FRANCHISES DIPLOMATIQUES"},{c:"015",l:"PAPIER D EDITION"},{c:"016",l:"MAT/PROD. AGRICOL. FRANCHISE"},{c:"017",l:"MAT/PROD. PECHE EN FRANCHISE"},{c:"018",l:"DONS"},{c:"019",l:"AUTRES FRANCHISES"},{c:"020",l:"IMPORTATION COMPENSATION EXPORTATION PREALABLE AVEC PAIEMENT"},{c:"021",l:"IMPORTATION COMPENSATION EXPORTATION PREALABLE SANS PAIEMENT"},{c:"022",l:"ADMISSION TEMPORAIRE PERFECTIONNEMENT ACTIF AVEC PAIEMENT"},{c:"023",l:"ATPA SANS PAIEMENT"},{c:"024",l:"TRANSIT SS DOUANE IMP. DIRECTE"},{c:"030",l:"IT MAT. RECHERCHE HYDROCARBURE"},{c:"031",l:"IT MAT. SOUMIS A REDEVANCES"},{c:"032",l:"IT MAT. NON SOUMIS A REDEVANCE"},{c:"033",l:"IT DES VEHICULES AUTOMOBILES"},{c:"034",l:"AUTRES IT"},{c:"035",l:"ENTREPOT PUBLIC"},{c:"036",l:"ENTREPOT PRIVE BANAL"},{c:"037",l:"ENTREPOT PRIVE PARTICULIER"},{c:"038",l:"ENTREPOT INDUSTRIEL IMPORT"},{c:"040",l:"MAC EN SUITE ATPA"},{c:"044",l:"MAC EN SUITE AT"},{c:"046",l:"MAC EN SUITE ENTREPOT PUBLIC"},{c:"050",l:"MAC MARCHANDISES ZONES FRANCHES"},{c:"051",l:"REIMPORTATION SUITE ETPP"},{c:"052",l:"REIMPORTATION SUITE ET"},{c:"053",l:"REIMPORTATION SUITE DRAWBACK"},{c:"060",l:"EXPORTATION EN SIMPLE SORTIE"},{c:"069",l:"EXPORTATION DANS LE CADRE DU DRAWBACK"},{c:"070",l:"EXPORTATION SUITE ATPA AVEC PAIEMENT"},{c:"072",l:"EXPORTATION SUITE ATPA SANS PAIEMENT"},{c:"074",l:"EXPORTATION SUITE AT"},{c:"075",l:"EXPORTATION SUITE EPP"},{c:"076",l:"EXP. VERS ZONE FRANCHE"},{c:"078",l:"EXPORTATION TEMPORAIRE"},{c:"079",l:"EXPORTATION PREALABLE"},{c:"080",l:"MUTATION ET ENTREE EN ENTREPOT"},{c:"085",l:"TRANSIT A L IMPORT"},{c:"086",l:"TRANSIT A L EXPORT"},{c:"090",l:"ENTREPOT DE PRODUITS PETROLIERS"},{c:"091",l:"ENTREPOT SUCRE"},{c:"093",l:"ATPA MARCHANDISES SOUMISES A TIC"},{c:"099",l:"MAC MARCHANDISES SOUMISES A TIC"},{c:"121",l:"INV ENVERGURE ORIG. UE"},{c:"122",l:"INV ENVERGURE ORIG. AELE"},{c:"134",l:"IMP MSE ORIGINAIRE DE L UE"},{c:"135",l:"IMP MSE ORIGINAIRE DE L AELE"},{c:"300",l:"ADMISSION TEMPORAIRE MAT. RECHERCHE HYDROCARBURE"},{c:"321",l:"AT MARCHANDISES DELAI 6 MOIS"},{c:"322",l:"AT MARCHANDISES DELAI 2 ANS"},{c:"331",l:"AT DES VEHICULES"},{c:"332",l:"AUTRES AT"},{c:"381",l:"ENTREPOT INDUSTRIEL FRANC EIF"},{c:"401",l:"M.A.C. NON COUPLEE A R.E."},{c:"411",l:"M.A.C. COUPLEE A R.E."},{c:"451",l:"M.A.C. EN SUITE A.T."},{c:"501",l:"ADMISSION TEMPORAIRE"},{c:"521",l:"I.T. MATERIEL HYDROCARBURE"},{c:"541",l:"I.T. VEHICULES AUTOMOBILES"},{c:"841",l:"TRANSIT"},{c:"877",l:"TRANSIT AU SEIN DU MEME BUREAU"},{c:"900",l:"EXPORTATION TEMPORAIRE VEHICULES USAGE COMMERCIAL"},{c:"901",l:"ZONE FRANCHE"},{c:"941",l:"DEC. PROV. IMPORT SIMPLE"},{c:"945",l:"DEC. OCCAS. IMPORT"},{c:"975",l:"DEC. IMPOSITION AUX T.I.C."},{c:"999",l:"Suite a une decision"}],
dd3:[{c:"1",l:"Articles d edition"},{c:"2",l:"Films cinematographiques documentaires ou educatifs"},{c:"3",l:"Franchise UNESCO"},{c:"6",l:"Associations de Micro credit"},{c:"7",l:"Agence Developpement Economique Nord et SUD"},{c:"8",l:"Ligue Nationale lutte maladies cardio-vasculaires"},{c:"9",l:"Fondation Hassan II lutte contre le cancer"},{c:"10",l:"Materiel militaires importes par les FAR"},{c:"11",l:"Materiel special administrations securite"},{c:"12",l:"Marchandises en retour sur le territoire assujetti"},{c:"13",l:"Franchises diplomatiques"},{c:"14",l:"Envois organismes internationaux siegeant au Maroc"},{c:"15",l:"Dons oeuvres de bienfaisance"},{c:"16",l:"Changement de residence"},{c:"17",l:"Heritage"},{c:"18",l:"Trousseaux eleves"},{c:"19",l:"Trousseaux mariage"},{c:"20",l:"Dons"},{c:"21",l:"Aides financieres non remboursables"},{c:"22",l:"Echantillons sans valeur marchande"},{c:"23",l:"Objets art trophees medailles commemoratives"},{c:"24",l:"Cercueil et urnes"},{c:"25",l:"Medicaments importes par des non residents"},{c:"27",l:"Franchise royales"},{c:"28",l:"Fondation Chekh Zaid Ibn Soltan"},{c:"29",l:"Universite Al Akhawayn Ifrane"},{c:"30",l:"Fondation Mohamed VI"},{c:"31",l:"Entraide nationale"},{c:"32",l:"Croissant rouge hors biens equipement"},{c:"33",l:"Croissant rouge biens equipement materiels et outillages"},{c:"34",l:"Bank Al Maghreb hors monnaies et metaux precieux"},{c:"35",l:"Bank Al Maghreb monnaies ayant cours legal et metaux precieux"},{c:"37",l:"Fondation Cheikh Khalifa Ibn Zaid"},{c:"1001",l:"Petrole brut"},{c:"1002",l:"Graines de betteraves a sucre"},{c:"1003",l:"Semences fourrageres"},{c:"1004",l:"Aeronefs travaux agricoles aeriens"},{c:"1005",l:"Billets de banque etrangers"},{c:"1006",l:"Monnaies"},{c:"1008",l:"Mais hybrides de semence"},{c:"1014",l:"Peaux brutes"},{c:"1015",l:"Papiers timbres"},{c:"1021",l:"Timbres fiscaux"},{c:"1024",l:"Produits destines hemodialyse"},{c:"1025",l:"Passeports vierges"},{c:"1027",l:"Plants de noyers"},{c:"1028",l:"Plants oliviers"},{c:"1029",l:"Materiels energies renouvelables non agricoles"},{c:"1030",l:"Materiels energies renouvelables pour agriculture"},{c:"1031",l:"Graines de semences"},{c:"1035",l:"Cristallins artificiels"},{c:"1037",l:"Vehicules transports touristiques"},{c:"1041",l:"Materiels recherche hydrocarbures"},{c:"1044",l:"Carburants lubrifiants navigation maritime"},{c:"1046",l:"Biens equipement investissement superieur 200 Mdhs"},{c:"1049",l:"Filets et engins de peche"},{c:"1050",l:"Materiels irrigation et serres"},{c:"1053",l:"Animaux reproducteurs races pures"},{c:"1055",l:"Produits materiels destines agriculture"},{c:"1056",l:"Aeronefs services publics transport aerien"},{c:"1062",l:"Pieces fabrication vehicules et cyclomoteurs economiques"},{c:"1076",l:"Aliments pour betails"},{c:"1077",l:"Produits petroliers"},{c:"2001",l:"Produits de la peche maritime marocaine"},{c:"2002",l:"Biens investissement"},{c:"2003",l:"Biens equipement enseignement prive ou formation professionnelle"},{c:"2004",l:"Autocars et camions entreprises TIR"},{c:"2006",l:"Medicaments pour diabete cardio et sida"},{c:"2009",l:"Vehicule utilitaire leger economique et cyclomoteur economique"},{c:"2010",l:"Matieres premieres produits pharmaceutiques"},{c:"2014",l:"Voiture dite economique"},{c:"3001",l:"Combustibles production energie electrique ONE"}],
dd4:[{c:"01",l:"AGADIR"},{c:"03",l:"ALHOCEIMA"},{c:"611",l:"ASILAH"},{c:"05",l:"AZILAL"},{c:"471",l:"AZROU"},{c:"591",l:"BEN AHMED"},{c:"09",l:"BEN SLIMANE"},{c:"197",l:"BENGUERIR"},{c:"07",l:"BENI MELLAL"},{c:"551",l:"BERKANE"},{c:"593",l:"BERRECHID"},{c:"293",l:"BOUARFA"},{c:"411",l:"BOUJAAD"},{c:"13",l:"BOULMANE"},{c:"81",l:"CASABLANCA"},{c:"15",l:"CHEFCHAOUEN"},{c:"53",l:"DAKHLA"},{c:"17",l:"EL JADIDA"},{c:"21",l:"ERRACHIDIA"},{c:"23",l:"ESSAOUIRA"},{c:"25",l:"ES-SMARA"},{c:"27",l:"FES"},{c:"077",l:"FKIH BEN SALEH"},{c:"31",l:"GUELMIM"},{c:"693",l:"GUERCIF"},{c:"455",l:"IMINTANOUTE"},{c:"013",l:"INZEGANE"},{c:"19",l:"KALAA-SRAGHNA"},{c:"079",l:"KASBA TADLA"},{c:"35",l:"KENITRA"},{c:"37",l:"KHEMISSET"},{c:"39",l:"KHENIFRA"},{c:"41",l:"KHOURIBGA"},{c:"443",l:"KSAR KEBIR"},{c:"43",l:"LAAYOUNE"},{c:"44",l:"LARACHE"},{c:"45",l:"MARRAKECH"},{c:"47",l:"MEKNES"},{c:"395",l:"MIDELT"},{c:"83",l:"MOHAMMEDIA"},{c:"49",l:"NADOR"},{c:"51",l:"OUARZAZATE"},{c:"605",l:"OUAZZANE"},{c:"415",l:"OUED ZEM"},{c:"55",l:"OUJDA"},{c:"85",l:"RABAT"},{c:"375",l:"ROMANI"},{c:"57",l:"SAFI"},{c:"87",l:"SALE"},{c:"273",l:"SEFROU"},{c:"59",l:"SETTAT"},{c:"175",l:"SIDI BENNOUR"},{c:"60",l:"SIDI KACEM"},{c:"358",l:"SIDI SLIMANE"},{c:"359",l:"SOUK LARBAA"},{c:"61",l:"TANGER"},{c:"63",l:"TANTAN"},{c:"65",l:"TAOUNATE"},{c:"552",l:"TAOURIRT"},{c:"66",l:"TAROUDANTE"},{c:"67",l:"TATA"},{c:"69",l:"TAZA"},{c:"89",l:"TEMARA"},{c:"71",l:"TETOUAN"},{c:"73",l:"TIZNIT"},{c:"573",l:"YOUSSOUFIA"},{c:"517",l:"ZAGORA"}]
};
function bld(id){var s=document.querySelector("#"+id+" .db-dd-sel");if(!s)return;s.innerHTML="<option value=''>— Sélectionner —</option>";D[id].forEach(function(d){var o=document.createElement("option");o.value=d.c;o.textContent=d.c+" — "+d.l;s.appendChild(o)});}
Object.keys(D).forEach(bld);
window.tDD=function(id){var el=document.getElementById(id);var op=el.classList.contains("open");document.querySelectorAll(".db-dd").forEach(function(d){d.classList.remove("open");});if(!op){el.classList.add("open");var inp=el.querySelector(".db-dd-inp");if(inp)setTimeout(function(){inp.focus();},40);}};
window.fDD=function(id,q){var lq=q.toLowerCase().trim();var f=lq?D[id].filter(function(d){return d.c.toLowerCase().includes(lq)||d.l.toLowerCase().includes(lq);}):D[id];var s=document.querySelector("#"+id+" .db-dd-sel");s.innerHTML="<option value=''>— Sélectionner —</option>";f.forEach(function(d){var o=document.createElement("option");o.value=d.c;o.textContent=d.c+" — "+d.l;s.appendChild(o);});};
window.pDD=function(id,sel){var code=sel.value;var r=document.getElementById("r-"+id);if(!code){r.classList.remove("vis");return;}var item=D[id].find(function(d){return d.c===code;});if(item){r.innerHTML="<strong>"+item.c+"<\/strong> — "+item.l;r.classList.add("vis");}};
document.addEventListener("click",function(e){if(!e.target.closest(".db-dd")){document.querySelectorAll(".db-dd").forEach(function(d){d.classList.remove("open");});}});
})();</script>
    <div class="reg-banner">
      <div class="reg-t"><strong>Accès complet — 7 jours offerts</strong><span>Transitaires · PME importatrices · Cabinets conseil · Directions logistique</span></div>
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
      <div class="wgt-hdr"><span class="wgt-title">RESSOURCES UTILES</span></div>
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

<!-- ═══════════════════════════════════════════════════════
     MODE CLASSIQUE — pages répertoriées et opérationnelles
     ═══════════════════════════════════════════════════════ -->
<div id="classic-view">
  <div class="classic-notice">
    <span>Vous êtes en <strong>mode classique</strong> — accès complet aux modules réservé aux abonnés.</span>
    <button class="btn-sub" onclick="setMode('chat')" style="flex-shrink:0">← RETOUR CHAT IA</button>
  </div>

  <!-- MODULES PRINCIPAUX -->
  <div class="classic-section-label">MODULES PRINCIPAUX</div>
  <div class="c-nav">
    <a href="/modules/faq" class="c-nav-item">
      <span class="cn-num">00</span>
      <div><div class="cn-label">FAQ Douanière</div><div class="cn-sub">173 questions — Titres 1–11</div></div>
    </a>
    <a href="/modules/audit" class="c-nav-item">
      <span class="cn-num">05</span>
      <div><div class="cn-label">Audit Douanier</div><div class="cn-sub">Scoring conformité, radar chart</div></div>
    </a>
    <a href="/modules/risques" class="c-nav-item">
      <span class="cn-num">12</span>
      <div><div class="cn-label">Contrôle des Risques</div><div class="cn-sub">38 situations analysées</div></div>
    </a>
    <a href="/modules/classement" class="c-nav-item">
      <span class="cn-num">CLT</span>
      <div><div class="cn-label">Décisions de Classement</div><div class="cn-sub">Positions SH · Décisions ADII</div></div>
    </a>
    <a href="/modules/analyses" class="c-nav-item">
      <span class="cn-num">ANA</span>
      <div><div class="cn-label">Analyses Stratégiques</div><div class="cn-sub">Statistiques · Commerce extérieur</div></div>
    </a>
  </div>

  <!-- OUTILS INTERACTIFS -->
  <div class="classic-section-label" style="margin-top:1.75rem">OUTILS INTERACTIFS</div>
  <div class="c-nav">
    <a href="/modules/simulateur" class="c-nav-item" style="border-color:var(--gold)">
      <span class="cn-num" style="color:var(--gold)">SIM</span>
      <div><div class="cn-label">Simulateur Droits & Taxes</div><div class="cn-sub">Cascade DI · TVA · TIC · PFI</div></div>
    </a>
    <a href="/modules/comparateur" class="c-nav-item" style="border-color:var(--gold)">
      <span class="cn-num" style="color:var(--gold)">CMP</span>
      <div><div class="cn-label">Comparateur Régimes</div><div class="cn-sub">9 régimes CDII · Coûts réels</div></div>
    </a>
    <a href="/modules/origine-aleca" class="c-nav-item" style="border-color:var(--gold)">
      <span class="cn-num" style="color:var(--gold)">ORI</span>
      <div><div class="cn-label">Origine ALECA / UE</div><div class="cn-sub">Règles d'origine · Calcul préférentiel</div></div>
    </a>
    <a href="/modules/index-commerce" class="c-nav-item" style="border-color:var(--gold)">
      <span class="cn-num" style="color:var(--gold)">ICI</span>
      <div><div class="cn-label">Index Commerce Intl.</div><div class="cn-sub">18 pays · 10 rubriques</div></div>
    </a>
    <a href="/modules/arborescence-" class="c-nav-item" style="border-color:var(--gold)">
      <span class="cn-num" style="color:var(--gold)">ARB</span>
      <div><div class="cn-label">Arborescence Commerce</div><div class="cn-sub">Nomenclature SH · Arbre tarifaire</div></div>
    </a>
  </div>

  <!-- ESPACE UTILISATEUR -->
  <div class="classic-section-label" style="margin-top:1.75rem">ESPACE UTILISATEUR</div>
  <div class="c-nav">
    <a href="/community" class="c-nav-item">
      <span class="cn-num">COM</span>
      <div><div class="cn-label">Espace Communautaire</div><div class="cn-sub">Forum · Q&A · Circulaires live</div></div>
    </a>
    <a href="/mon-compte" class="c-nav-item">
      <span class="cn-num">MON</span>
      <div><div class="cn-label">Mon Compte</div><div class="cn-sub">Profil · Abonnement · Équipe</div></div>
    </a>
  </div>

  <!-- BACKOFFICE -->
  <div class="classic-section-label" style="margin-top:1.75rem">BACKOFFICE</div>
  <div class="c-nav c-nav-admin">
    <a href="/admin/tarifs" class="c-nav-item">
      <span class="cn-num" style="color:var(--ink3)">ADM</span>
      <div><div class="cn-label">Admin — Tarifs</div><div class="cn-sub">Gestion positions tarifaires SH</div></div>
    </a>
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

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Douane.ia — Intelligence Douanière Marocaine</title>
        <meta name="description" content="Assistant intelligent en réglementation douanière marocaine." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap"
      />
      <div dangerouslySetInnerHTML={{ __html: bodyHTML }} />
      <Script src="/douane-chat.js" strategy="afterInteractive" />
    </>
  );
}
