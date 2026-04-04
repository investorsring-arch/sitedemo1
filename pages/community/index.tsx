import { useState, useRef, useEffect } from "react";

const SUPA_URL = 'https://vfgjihkshhmnwjwbnrfz.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmZ2ppaGtzaGhtbndqd2JucmZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTY2NzAsImV4cCI6MjA4OTc3MjY3MH0.5Fttwav2CqiVG8jOFeUuTYyPsFZiewr9uujCb4pXVVM';

type Tab = 'qa' | 'circ' | 'fils' | 'ideas' | 'avis';

interface WaMsg { text: string; cls: 'me' | 'other' | 'admin'; name?: string; time: string; }

const now = () => { const d = new Date(); return `${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`; };

const WA_INIT: Record<Tab, WaMsg[]> = {
  qa: [
    { text: "Bienvenue sur l'espace communautaire — posez vos questions, partagez vos expériences.", cls: 'admin', name: 'Admin Douane.ia', time: '08:30' },
    { text: "Bonjour — retour sur exonération panneaux solaires SH 8541 ?", cls: 'other', name: 'M. Alami · Transitaire', time: '09:14' },
    { text: "Confirmé bureau Casa — circ. 6502 prime sur BADR. Joindre attestation investissement.", cls: 'other', name: 'H. Ziani · Cabinet', time: '09:22' },
    { text: "Exact. Réponse officielle publiée sur le fil Q&A. Exonération totale sous condition ZAI.", cls: 'admin', name: 'Admin Douane.ia', time: '09:35' },
    { text: "Et pour AT MRE — bureau Agadir bloque le renouvellement...", cls: 'other', name: 'S. Kadiri · Transitaire', time: '10:47' },
    { text: "Renouvellement AVANT expiration — Art. 191 CDII sinon infraction.", cls: 'other', name: 'L. Chraibi · Conseil', time: '10:55' },
    { text: "Confirmé. Recours possible Direction Régionale si refus injustifié.", cls: 'admin', name: 'Admin Douane.ia', time: '11:03' },
  ],
  circ: [
    { text: "Circ. 6708 publiée — exonération ZAI étendue. Consultez l'onglet Circulaires.", cls: 'admin', name: 'Admin Douane.ia', time: '09:00' },
    { text: "La position 8543.70 est-elle incluse ?", cls: 'other', name: 'M. Alami', time: '09:18' },
    { text: "Oui — annexe II. Exonération totale sous condition ZAI confirmée.", cls: 'admin', name: 'Admin Douane.ia', time: '09:25' },
    { text: "Pour la 6707 — OEA en renouvellement couverts ?", cls: 'other', name: 'R. Tahiri', time: '10:02' },
    { text: "Oui — attestation de dépôt suffit pendant la période transitoire.", cls: 'admin', name: 'Admin Douane.ia', time: '10:10' },
  ],
  fils: [
    { text: "Bureau Agadir bloque le renouvellement AT MRE malgré la circ. 5894...", cls: 'other', name: 'S. Kadiri', time: '10:47' },
    { text: "Renouvellement avant expiration — sinon Art. 191 CDII infraction.", cls: 'other', name: 'L. Chraibi', time: '10:55' },
    { text: "Recours auprès Direction Régionale possible si refus injustifié.", cls: 'admin', name: 'Admin Douane.ia', time: '11:03' },
    { text: "Merci — je vais contacter la Direction Régionale.", cls: 'other', name: 'S. Kadiri', time: '11:12' },
  ],
  ideas: [
    { text: "Simulateur de pénalités en cours d'étude — objectif T2 2026.", cls: 'admin', name: 'Admin Douane.ia', time: '08:45' },
    { text: "Export PDF aussi très attendu par nos clients.", cls: 'other', name: 'F. Benali', time: '09:30' },
    { text: "+1 pour l'export PDF — indispensable pour validation interne.", cls: 'other', name: 'K. Bennani', time: '10:15' },
  ],
  avis: [
    { text: "Simulateur très utile ! Export PDF manque pour validation interne.", cls: 'other', name: 'M. Alami', time: '09:05' },
    { text: "Chat IA répond bien aux questions précises — bravo !", cls: 'other', name: 'F. Benali', time: '10:20' },
    { text: "Merci pour vos retours ! Export PDF planifié T2 2026.", cls: 'admin', name: 'Admin Douane.ia', time: '10:35' },
    { text: "Mode sombre serait apprécié pour les longues sessions.", cls: 'other', name: 'S. Kadiri', time: '11:00' },
  ],
};

const CIRCULAIRES = [
  { num: '6708', ref: '6708/311', date: 'janv. 26', domaine: 'INVESTISSEMENTS & ZAI', titre: 'Investissements et régimes particuliers', resume: 'Extension exonération équipements ZAI — positions SH éligibles mises à jour', comments: 6, thread: [
    { who: 'Admin', color: '#C9A84C', msg: 'Exonération applicable aux positions 8479.89 et 8543.70 — condition destination ZAI.' },
    { who: 'K. Bennani', color: '#0F6E56', msg: 'Confirmé bureau Casa, procédure acceptée sans problème.' },
  ]},
  { num: '6707', ref: '6707/313', date: 'déc. 25', domaine: 'CAUTIONNEMENT & RED', titre: 'Facilités de cautionnement régimes économiques', resume: 'Réduction 40% OEA · Applicable 1er janvier 2026', comments: 14, thread: [
    { who: 'Admin', color: '#C9A84C', msg: 'Réduction 40% sous condition agrément OEA valide à la date DUM.' },
    { who: 'R. Tahiri', color: '#534AB7', msg: 'Renouvellement en cours assimilé à agrément valide — Art. 7 al. 3.' },
  ]},
  { num: '6706', ref: '6706/302', date: 'nov. 25', domaine: 'TVA & E-COMMERCE', titre: 'TVA sur importations e-commerce', resume: 'Seuil franchise 1 200 MAD · TVA collectée plateformes', comments: 9, thread: [
    { who: 'Admin', color: '#C9A84C', msg: 'Seuil 500 → 1 200 MAD. TVA collectée par la plateforme à la commande.' },
    { who: 'F. Benali', color: '#0F6E56', msg: 'Amazon et Alibaba concernés dès 5 M MAD ventes annuelles au Maroc.' },
  ]},
];

const WelcomeBar = () => (
  <div style={{ background: 'var(--gold4)', borderBottom: '1px solid var(--gold3)', padding: '.55rem 1rem' }}>
    <div style={{ fontSize: 9, letterSpacing: '.12em', color: 'var(--gold)', marginBottom: 3 }}>DOUANE.IA — COMMUNAUTÉ</div>
    <div style={{ fontSize: 11, color: 'var(--ink2)', lineHeight: 1.55 }}>
      Bonjour — Laissez votre avis sur des sujets qui vous préoccupent, et invitez la communauté à vous répondre.{' '}
      <strong style={{ color: 'var(--gold)' }}>Ceci est votre espace et notre famille.</strong>
    </div>
  </div>
);

const WaSidebar = ({ tab }: { tab: Tab }) => {
  const [msgs, setMsgs] = useState<WaMsg[]>(WA_INIT[tab]);
  const [val, setVal] = useState('');
  const feedRef = useRef<HTMLDivElement>(null);
  const rep = ['Merci — votre avis enrichit la communauté.', "Bien reçu ! D'autres membres partageront leur vue.", 'Votre contribution est précieuse pour tous.'];
  const rc = useRef(0);

  const send = () => {
    if (!val.trim()) return;
    const m: WaMsg = { text: val, cls: 'me', time: now() };
    setMsgs(p => [...p, m]);
    setVal('');
    if (tab === 'qa') {
      setTimeout(() => {
        setMsgs(p => [...p, { text: rep[rc.current % rep.length], cls: 'admin', name: 'Admin Douane.ia', time: now() }]);
        rc.current++;
      }, 900);
    }
  };

  useEffect(() => { if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight; }, [msgs]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: '#f0ece4' }}>
      <div style={{ background: 'var(--ink)', padding: '.45rem .75rem', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--border)' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'var(--ink)', fontWeight: 500 }}>DIA</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--gold2)' }}>Douane.ia — Live</div>
          <div style={{ fontSize: 9, color: 'var(--ink3)' }}>142 membres</div>
        </div>
      </div>
      <div ref={feedRef} style={{ flex: 1, overflowY: 'auto', padding: '.5rem', display: 'flex', flexDirection: 'column', gap: 6, minHeight: 300, maxHeight: 400 }}>
        <div style={{ textAlign: 'center', fontSize: 9, color: 'var(--ink3)', background: '#ddd8ce', padding: '2px 10px', borderRadius: 8, alignSelf: 'center' }}>Aujourd'hui</div>
        {msgs.map((m, i) => (
          <div key={i} style={{ maxWidth: '88%', padding: '.45rem .7rem', fontSize: 11, lineHeight: 1.5, background: m.cls === 'me' ? '#d9fdd3' : m.cls === 'admin' ? '#fff8e8' : '#fff', borderRadius: m.cls === 'me' ? '8px 0 8px 8px' : '0 8px 8px 8px', alignSelf: m.cls === 'me' ? 'flex-end' : 'flex-start', border: m.cls === 'me' ? '.5px solid #c5f0be' : m.cls === 'admin' ? '.5px solid var(--gold3)' : '.5px solid #e0dbd0' }}>
            {m.name && <div style={{ fontSize: 9, fontWeight: 500, marginBottom: 2, color: m.cls === 'admin' ? 'var(--gold)' : '#0F6E56' }}>{m.name}</div>}
            {m.text}
            <div style={{ fontSize: 9, color: '#8A8078', textAlign: 'right', marginTop: 2 }}>{m.time}</div>
          </div>
        ))}
      </div>
      <div style={{ background: '#f0ece4', borderTop: '.5px solid var(--border2)', padding: '.5rem .6rem', display: 'flex', alignItems: 'center', gap: 5 }}>
        <input value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Message..." style={{ flex: 1, border: 'none', padding: '7px 10px', fontSize: 12, fontFamily: 'inherit', color: 'var(--ink)', outline: 'none', background: '#fff', borderRadius: 20 }} />
        <button onClick={send} style={{ width: 34, height: 34, background: 'var(--up)', border: 'none', borderRadius: '50%', cursor: 'pointer', color: '#fff', fontSize: 14 }}>➤</button>
      </div>
    </div>
  );
};

export default function CommunityPage() {
  const [tab, setTab] = useState<Tab>('qa');
  const [openCirc, setOpenCirc] = useState<number | null>(null);
  const [votes, setVotes] = useState([24, 11]);
  const [ideaVotes, setIdeaVotes] = useState([47, 31]);
  const [rating, setRating] = useState(0);
  const [profile, setProfile] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [msg, setMsg] = useState('');
  const [contact, setContact] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [dialMsgs, setDialMsgs] = useState<{role: string; text: string}[]>([]);
  const [dialVal, setDialVal] = useState('');
  const [circulaires, setCirculaires] = useState<any[]>([]);
  const arcRef = useRef(0);
  const arep = ['Message reçu — réponse sous 48h.', 'Bien noté, merci !', "Transmis à l'équipe produit."];

  useEffect(() => {
    fetch(`${SUPA_URL}/rest/v1/circulaires?select=numero,date,objet&order=date.desc&limit=3`, {
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` }
    }).then(r => r.json()).then(setCirculaires).catch(() => {});
  }, []);

  const sendDial = () => {
    if (!dialVal.trim()) return;
    setDialMsgs(p => [...p, { role: 'user', text: dialVal }]);
    const v = dialVal;
    setDialVal('');
    setTimeout(() => {
      setDialMsgs(p => [...p, { role: 'ai', text: arep[arcRef.current % arep.length] }]);
      arcRef.current++;
    }, 900);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'qa', label: 'Q&A FORUM' },
    { key: 'circ', label: 'CIRCULAIRES' },
    { key: 'fils', label: 'FILS DE DIALOGUE' },
    { key: 'ideas', label: 'BOÎTE À IDÉES' },
    { key: 'avis', label: 'VOTRE AVIS' },
  ];

  const tabStyle = (k: Tab) => ({
    padding: '.6rem 1rem', fontSize: 10, letterSpacing: '.1em', cursor: 'pointer',
    borderBottom: tab === k ? '2px solid var(--gold)' : '2px solid transparent',
    color: tab === k ? 'var(--gold)' : 'var(--ink3)',
    background: tab === k ? 'var(--gold4)' : 'transparent',
    whiteSpace: 'nowrap' as const,
  });

  return (
    <>
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        :root{--gold:#C9A84C;--gold2:#E8C97A;--gold3:#F5E4B0;--gold4:#FBF5E6;--ink:#0A0A0A;--ink2:#3A3530;--ink3:#8A8078;--white:#FDFCF8;--border:#E8DFC8;--border2:#D4C8A8;--up:#4CAF7C;--dn:#E85D5D}
        body{font-family:'DM Sans',sans-serif;background:var(--white);color:var(--ink)}
        *{box-sizing:border-box;margin:0;padding:0}
        input,select,textarea{font-family:'DM Sans',sans-serif}
      `}</style>

      {/* Header */}
      <div style={{ background: 'var(--ink)', borderBottom: '2px solid var(--gold)', padding: '.7rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: 'var(--gold2)' }}>
          Douane<span style={{ color: 'var(--gold)' }}>.</span>ia <span style={{ fontWeight: 300, fontSize: 14, color: 'var(--ink3)', letterSpacing: '.08em' }}>— COMMUNAUTÉ</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--up)' }} />
          <span style={{ fontSize: 10, color: 'var(--ink3)', letterSpacing: '.06em' }}>142 membres en ligne</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        {tabs.map(t => (
          <div key={t.key} style={tabStyle(t.key)} onClick={() => setTab(t.key)}>{t.label}</div>
        ))}
      </div>

      {/* Q&A */}
      {tab === 'qa' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', minHeight: 460 }}>
          <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
            {[{ av: 'MA', author: 'M. Alami', dom: 'TARIFS', badge: true, title: 'Taux DI panneaux solaires SH 8541.40 ?', excerpt: 'Modules photovoltaïques Chine — BADR 2.5% mais circulaire 6502 parle d\'exonération totale...', vi: 0 },
              { av: 'SK', author: 'S. Kadiri', dom: 'RÉGIMES', badge: false, title: 'Délai apurement admission temporaire MRE ?', excerpt: 'Circ. 5894 dit 6 mois renouvelables mais bureau Agadir refuse...', vi: 1 }
            ].map((p, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--border)', padding: '.75rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'var(--gold2)', flexShrink: 0 }}>{p.av}</div>
                  <span style={{ fontSize: 11, color: 'var(--ink3)' }}>{p.author}</span>
                  <span style={{ fontSize: 9, padding: '2px 6px', background: 'var(--gold4)', border: '1px solid var(--gold3)', color: '#854F0B' }}>{p.dom}</span>
                  {p.badge && <span style={{ fontSize: 9, padding: '2px 6px', background: 'var(--ink)', color: 'var(--gold2)' }}>Officiel</span>}
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink2)', marginBottom: 3 }}>{p.title}</div>
                <div style={{ fontSize: 11, color: 'var(--ink3)', lineHeight: 1.5 }}>{p.excerpt}</div>
                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                  <button style={{ fontSize: 10, color: 'var(--up)', cursor: 'pointer', border: 'none', background: 'none' }} onClick={() => setVotes(v => v.map((x, j) => j === i ? x + 1 : x))}>▲ {votes[i]}</button>
                  <button style={{ fontSize: 10, color: 'var(--ink3)', cursor: 'pointer', border: 'none', background: 'none' }}>💬 {i === 0 ? 7 : 3} réponses</button>
                  <button style={{ fontSize: 10, color: 'var(--ink3)', cursor: 'pointer', border: 'none', background: 'none' }}>📝 Laissez votre commentaire dans la boîte de dialogue</button>
                </div>
              </div>
            ))}
            <WelcomeBar />
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.7rem 1rem', marginTop: 'auto', borderTop: '1px solid var(--border)' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--gold4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'var(--gold)', flexShrink: 0 }}>V</div>
              <input placeholder="Donnez votre avis à la communauté..." style={{ flex: 1, border: '1px solid var(--border2)', padding: '6px 9px', fontSize: 11, color: 'var(--ink)', outline: 'none', background: '#fdfcf8' }} />
              <button style={{ padding: '6px 13px', background: 'var(--ink)', color: 'var(--gold2)', fontSize: 10, letterSpacing: '.08em', border: 'none', cursor: 'pointer' }}>PUBLIER →</button>
            </div>
          </div>
          <WaSidebar tab="qa" />
        </div>
      )}

      {/* CIRCULAIRES */}
      {tab === 'circ' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', minHeight: 460 }}>
          <div style={{ borderRight: '1px solid var(--border)', padding: '.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            <div style={{ fontSize: 9, letterSpacing: '.12em', color: 'var(--ink3)', paddingBottom: '.5rem', borderBottom: '1px solid var(--border)' }}>3 DERNIÈRES CIRCULAIRES ADII — BASE LIVE</div>
            {CIRCULAIRES.map((c, i) => (
              <div key={i} style={{ border: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => setOpenCirc(openCirc === i ? null : i)}>
                <div style={{ padding: '.65rem .875rem', display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                  <div style={{ textAlign: 'center', minWidth: 50, padding: '.35rem', background: 'var(--ink)' }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--gold2)' }}>N° {c.num}</div>
                    <div style={{ fontSize: 9, color: 'var(--ink3)' }}>{c.date}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 9, letterSpacing: '.1em', color: 'var(--gold)', marginBottom: 1 }}>{c.domaine}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink2)' }}>Circ. {c.ref} — {c.titre}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink3)' }}>{c.resume}</div>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--ink3)' }}>{openCirc === i ? '▲' : '▼'}</span>
                </div>
                {openCirc === i && (
                  <div style={{ borderTop: '1px solid var(--gold3)', background: 'var(--gold4)', padding: '.5rem .875rem' }}>
                    <div style={{ fontSize: 9, letterSpacing: '.1em', color: 'var(--gold)', marginBottom: 5 }}>FIL DE DIALOGUE</div>
                    {c.thread.map((t: any, j: number) => (
                      <div key={j} style={{ fontSize: 11, color: 'var(--ink2)', padding: '4px 0', borderBottom: '1px solid var(--gold3)' }}>
                        <strong style={{ color: t.color, fontSize: 10 }}>{t.who}</strong> — {t.msg}
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: 5, marginTop: 5 }}>
                      <input placeholder="Votre commentaire..." style={{ flex: 1, border: '1px solid var(--border2)', padding: '5px 8px', fontSize: 11, outline: 'none', background: '#fdfcf8' }} />
                      <button style={{ padding: '5px 8px', background: 'var(--ink)', color: 'var(--gold2)', border: 'none', cursor: 'pointer', fontSize: 9 }}>→</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <WaSidebar tab="circ" />
        </div>
      )}

      {/* FILS */}
      {tab === 'fils' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', minHeight: 460 }}>
          <div style={{ borderRight: '1px solid var(--border)' }}>
            <div style={{ padding: '.5rem 1rem', borderBottom: '1px solid var(--border)', fontSize: 9, letterSpacing: '.12em', color: 'var(--ink3)', background: 'var(--gold4)' }}>FILS DE DIALOGUE ACTIFS</div>
            {[{ dom: 'TARIFS', title: 'Panneaux solaires SH 8541.40', n: 7, h: '2h', admin: 'Exonération applicable. Joindre attestation.', other: 'H. Ziani — Confirmé bureau Casablanca.' },
              { dom: 'RÉGIMES', title: 'Admission temporaire MRE — délai', n: 3, h: '5h', admin: 'Recours Direction Régionale possible.', other: 'L. Chraibi — Art. 191 CDII — délai avant expiration.' }
            ].map((f, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--border)', padding: '.75rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 9, padding: '2px 6px', background: 'var(--gold4)', border: '1px solid var(--gold3)', color: '#854F0B' }}>{f.dom}</span>
                  <span style={{ fontSize: 10, color: 'var(--ink3)' }}>💬 {f.n} · {f.h}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink2)', marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 11, color: 'var(--ink3)', borderLeft: '2px solid var(--gold)', paddingLeft: 6, marginBottom: 3 }}><strong style={{ color: 'var(--gold)' }}>Admin</strong> — {f.admin}</div>
                <div style={{ fontSize: 11, color: 'var(--ink3)', paddingLeft: 8 }}>{f.other}</div>
              </div>
            ))}
          </div>
          <WaSidebar tab="fils" />
        </div>
      )}

      {/* IDÉES */}
      {tab === 'ideas' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', minHeight: 460 }}>
          <div style={{ borderRight: '1px solid var(--border)' }}>
            <div style={{ padding: '.5rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 9, letterSpacing: '.1em', color: 'var(--ink3)' }}>IDÉES LES PLUS VOTÉES</span>
              <button style={{ padding: '4px 9px', background: 'var(--ink)', color: 'var(--gold2)', fontSize: 9, border: 'none', cursor: 'pointer' }}>+ SOUMETTRE</button>
            </div>
            {[{ label: 'Simulateur de pénalités douanières', desc: "Calcul automatique selon type d'infraction et valeur", status: 'EN ÉTUDE', statusBg: '#E1F5EE', statusColor: '#085041', statusBorder: '#9FE1CB', vi: 0 },
              { label: 'Export PDF simulation droits & taxes', desc: 'Bon de simulation signé avec cascade complète', status: 'PLANIFIÉ', statusBg: 'var(--gold4)', statusColor: '#854F0B', statusBorder: 'var(--gold3)', vi: 1 }
            ].map((idea, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--border)', padding: '.75rem 1rem', display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                <div onClick={() => setIdeaVotes(v => v.map((x, j) => j === i ? x + 1 : x))} style={{ width: 36, height: 36, background: i === 0 ? 'var(--up)' : 'var(--gold4)', border: i === 0 ? 'none' : '1px solid var(--gold3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                  <span style={{ fontSize: 9, color: i === 0 ? '#fff' : 'var(--ink3)' }}>▲</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: i === 0 ? '#fff' : 'var(--ink)' }}>{ideaVotes[i]}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink2)', marginBottom: 1 }}>{idea.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink3)' }}>{idea.desc}</div>
                </div>
                <span style={{ fontSize: 9, padding: '2px 6px', background: idea.statusBg, color: idea.statusColor, border: `1px solid ${idea.statusBorder}`, whiteSpace: 'nowrap' }}>{idea.status}</span>
              </div>
            ))}
          </div>
          <WaSidebar tab="ideas" />
        </div>
      )}

      {/* AVIS */}
      {tab === 'avis' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', minHeight: 460 }}>
          <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '.75rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--gold4)' }}>
              <div style={{ fontSize: 9, letterSpacing: '.14em', color: 'var(--gold)', marginBottom: 2 }}>DOUANE.IA — VOTRE RETOUR</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink2)' }}>Laissez-nous votre avis et suggestions</div>
              <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 1 }}>Vos retours guident directement nos priorités.</div>
            </div>
            <WelcomeBar />
            <div>
              <div style={{ padding: '.45rem .875rem', fontSize: 9, letterSpacing: '.12em', color: 'var(--ink3)', borderBottom: '1px solid var(--gold4)', background: '#fdfcf8' }}>BOÎTE DE DIALOGUE AVEC L'ÉQUIPE</div>
              <div style={{ maxHeight: 80, overflowY: 'auto' }}>
                <div style={{ padding: '.5rem .875rem', fontSize: 11, lineHeight: 1.55, borderBottom: '1px solid var(--gold4)', background: '#fdfcf8', borderLeft: '2px solid var(--gold)' }}>
                  <div style={{ fontSize: 9, color: 'var(--ink3)', marginBottom: 2 }}>Équipe Douane.ia</div>
                  Votre message sera traité sous 48h.
                </div>
                {dialMsgs.map((m, i) => (
                  <div key={i} style={{ padding: '.5rem .875rem', fontSize: 11, lineHeight: 1.55, borderBottom: '1px solid var(--gold4)', background: m.role === 'user' ? 'var(--gold4)' : '#fdfcf8', borderLeft: m.role === 'ai' ? '2px solid var(--gold)' : 'none', textAlign: m.role === 'user' ? 'right' : 'left' }}>
                    <div style={{ fontSize: 9, color: 'var(--ink3)', marginBottom: 2 }}>{m.role === 'user' ? 'Vous' : 'Équipe Douane.ia'}</div>
                    {m.text}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6, padding: '.45rem .875rem', borderTop: '1px solid var(--gold4)' }}>
                <input value={dialVal} onChange={e => setDialVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendDial()} placeholder="Donnez votre avis..." style={{ flex: 1, border: '1px solid var(--border2)', padding: '5px 9px', fontSize: 11, outline: 'none', background: '#fdfcf8' }} />
                <button onClick={sendDial} style={{ padding: '5px 9px', background: 'var(--ink)', color: 'var(--gold2)', fontSize: 9, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>ENVOYER →</button>
              </div>
            </div>

            {!submitted ? (
              <div style={{ padding: '.875rem 1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <div style={{ fontSize: 9, letterSpacing: '.12em', color: 'var(--ink3)', display: 'block', marginBottom: 4 }}>SATISFACTION GLOBALE</div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {[1,2,3,4,5].map(n => (
                      <span key={n} onClick={() => setRating(n)} style={{ fontSize: 19, cursor: 'pointer', color: n <= rating ? 'var(--gold)' : 'var(--border2)', marginRight: 1 }}>★</span>
                    ))}
                    <span style={{ fontSize: 11, color: 'var(--ink3)', marginLeft: 8 }}>{['','Insuffisant','Passable','Bien','Très bien','Excellent'][rating] || 'Cliquez pour noter'}</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: '.12em', color: 'var(--ink3)', marginBottom: 4 }}>VOTRE PROFIL</div>
                  <select value={profile} onChange={e => setProfile(e.target.value)} style={{ width: '100%', border: '1px solid var(--border2)', padding: '6px 9px', fontSize: 12, fontFamily: 'inherit', outline: 'none', background: '#fdfcf8' }}>
                    <option value="">— Sélectionner —</option>
                    <option>Transitaire / Agent en douane</option>
                    <option>Importateur / Exportateur PME</option>
                    <option>Directeur logistique</option>
                    <option>Cabinet conseil douanier</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: '.12em', color: 'var(--ink3)', marginBottom: 4 }}>TYPE DE RETOUR</div>
                  <select value={feedbackType} onChange={e => setFeedbackType(e.target.value)} style={{ width: '100%', border: '1px solid var(--border2)', padding: '6px 9px', fontSize: 12, fontFamily: 'inherit', outline: 'none', background: '#fdfcf8' }}>
                    <option value="">— Sélectionner —</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="bug">Signalement d'erreur</option>
                    <option value="content">Contenu manquant</option>
                    <option value="compliment">Compliment</option>
                  </select>
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <div style={{ fontSize: 9, letterSpacing: '.12em', color: 'var(--ink3)', marginBottom: 4 }}>VOTRE MESSAGE</div>
                  <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Donnez votre avis..." style={{ width: '100%', border: '1px solid var(--border2)', padding: '7px 10px', fontSize: 12, fontFamily: 'inherit', outline: 'none', background: '#fdfcf8', resize: 'vertical', minHeight: 72 }} />
                </div>
                <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 8, padding: '.5rem .875rem', background: 'var(--gold4)', border: '1px solid var(--gold3)' }}>
                  <input type="checkbox" checked={contact} onChange={e => setContact(e.target.checked)} style={{ width: 'auto', cursor: 'pointer' }} />
                  <label style={{ fontSize: 11, color: 'var(--ink2)', cursor: 'pointer' }}>Je souhaite être contacté(e) — réponse sous 48h</label>
                </div>
                {contact && (
                  <div style={{ gridColumn: '1/-1' }}>
                    <div style={{ fontSize: 9, letterSpacing: '.12em', color: 'var(--ink3)', marginBottom: 4 }}>EMAIL</div>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.ma" style={{ width: '100%', border: '1px solid var(--border2)', padding: '7px 10px', fontSize: 12, fontFamily: 'inherit', outline: 'none', background: '#fdfcf8' }} />
                  </div>
                )}
                <div style={{ gridColumn: '1/-1' }}>
                  <button onClick={() => setSubmitted(true)} disabled={!(rating > 0 && msg.length > 10)} style={{ width: '100%', padding: 9, background: 'var(--ink)', color: 'var(--gold2)', fontSize: 11, letterSpacing: '.09em', border: 'none', cursor: rating > 0 && msg.length > 10 ? 'pointer' : 'not-allowed', opacity: rating > 0 && msg.length > 10 ? 1 : 0.4 }}>ENVOYER MON AVIS →</button>
                  <div style={{ fontSize: 10, color: 'var(--ink3)', textAlign: 'center', marginTop: 5 }}>Vos données restent confidentielles.</div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '1.25rem', background: '#E1F5EE', borderTop: '1px solid #9FE1CB', textAlign: 'center' }}>
                <div style={{ fontSize: 16, marginBottom: 5 }}>✓</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#085041', marginBottom: 2 }}>Merci pour votre retour !</div>
                <div style={{ fontSize: 11, color: '#0F6E56' }}>Transmis à l'équipe Douane.ia.</div>
              </div>
            )}
          </div>
          <WaSidebar tab="avis" />
        </div>
      )}
    </>
  );
}
