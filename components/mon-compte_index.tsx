import { useState } from 'react'
import Layout from '../../components/Layout'

// ── Types ────────────────────────────────────────────────────────────────────

type Tab = 'profil' | 'abonnement' | 'paiement' | 'equipe' | 'securite'

interface TeamMember {
  id: number
  nom: string
  email: string
  role: 'admin' | 'lecteur'
  actif: boolean
  dernierAcces: string
}

// ── Données de démo ───────────────────────────────────────────────────────────

const USER = {
  nom: 'Fatima Zahra Idrissi',
  email: 'fz.idrissi@cabinet-fzi.ma',
  tel: '+212 6 98 76 54 32',
  societe: 'Cabinet FZI Douane & Commerce',
  fonction: 'Directrice associée',
  ville: 'Casablanca',
  pays: 'Maroc',
  avatar: 'FZ',
  plan: 'Cabinet & Entreprise',
  planColor: '#991B1B',
  montant: '4 990',
  cycle: 'mensuel',
  debut: '02/02/2025',
  prochain: '02/05/2025',
  joursRestants: 41,
}

const TEAM_INIT: TeamMember[] = [
  { id:1, nom:'Karim Tazi', email:'k.tazi@cabinet-fzi.ma', role:'admin', actif:true, dernierAcces:'Aujourd\'hui 09:14' },
  { id:2, nom:'Nadia Bennani', email:'n.bennani@cabinet-fzi.ma', role:'lecteur', actif:true, dernierAcces:'Hier 17:32' },
  { id:3, nom:'Omar Fassi', email:'o.fassi@cabinet-fzi.ma', role:'lecteur', actif:false, dernierAcces:'12/03/2025' },
]

// ── Styles partagés ───────────────────────────────────────────────────────────

const S = {
  section: { marginBottom: '2rem' } as React.CSSProperties,
  sectionTitle: { fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:500, color:'var(--bd)', marginBottom:'1rem', paddingBottom:'.5rem', borderBottom:'.5px solid var(--rule)' } as React.CSSProperties,
  label: { display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 } as React.CSSProperties,
  row2: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.25rem' } as React.CSSProperties,
  row3: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem', marginBottom:'1.25rem' } as React.CSSProperties,
  group: { marginBottom:'1.25rem' } as React.CSSProperties,
  hint: { fontSize:11, color:'var(--inkm)', marginTop:4 } as React.CSSProperties,
  card: { background:'var(--white)', border:'.5px solid var(--rule)', padding:'1.25rem', marginBottom:'1rem' } as React.CSSProperties,
  btn: { padding:'.55rem 1.4rem', fontSize:12, letterSpacing:'.06em', cursor:'pointer', border:'none', transition:'all .13s' } as React.CSSProperties,
}

// ── Composant principal ───────────────────────────────────────────────────────

export default function MonCompte() {
  const [tab, setTab] = useState<Tab>('profil')
  const [toast, setToast] = useState('')
  const [team, setTeam] = useState<TeamMember[]>(TEAM_INIT)
  const [newMember, setNewMember] = useState({ nom:'', email:'', role:'lecteur' as 'admin'|'lecteur' })
  const [showAddMember, setShowAddMember] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const [profil, setProfil] = useState({ ...USER })
  const [paiement, setPaiement] = useState({
    mode: 'carte', // carte | virement | bp | mobile
    carte: { num:'', exp:'', cvv:'', nom:'' },
    bp: { rib:'', titulaire:'' },
    virement: { rib:'', banque:'' },
    mobile: { tel:'', operateur:'orange' }
  })

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3200) }

  const saveProfil = () => showToast('✓ Profil mis à jour')
  const savePaiement = () => showToast('✓ Mode de paiement enregistré')
  const addMember = () => {
    if (!newMember.email) return
    setTeam(t => [...t, { ...newMember, id: Date.now(), actif:true, dernierAcces:'Jamais' }])
    setNewMember({ nom:'', email:'', role:'lecteur' })
    setShowAddMember(false)
    showToast(`✓ Invitation envoyée à ${newMember.email}`)
  }

  const TABS: { key: Tab; label: string }[] = [
    { key:'profil', label:'Mon profil' },
    { key:'abonnement', label:'Abonnement' },
    { key:'paiement', label:'Paiement' },
    { key:'equipe', label:'Mon équipe' },
    { key:'securite', label:'Sécurité' },
  ]

  return (
    <Layout variant="inner">
      <div style={{ maxWidth:780, margin:'0 auto' }}>

        {/* ── EN-TÊTE COMPTE ── */}
        <div style={{ display:'flex', gap:'1.5rem', alignItems:'center', marginBottom:'2rem', padding:'1.5rem', background:'var(--white)', border:'.5px solid var(--rule)' }}>
          {/* Avatar */}
          <div style={{
            width:72, height:72, borderRadius:'50%', background:'var(--bd)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:"'Playfair Display',serif", fontSize:24, color:'white',
            fontWeight:700, flexShrink:0, cursor:'pointer', position:'relative'
          }} title="Changer la photo">
            {profil.avatar}
            <div style={{ position:'absolute', bottom:0, right:0, width:22, height:22, background:'var(--ba)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'white' }}>✎</div>
          </div>

          {/* Infos */}
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:'var(--bd)' }}>{profil.nom}</div>
            <div style={{ fontSize:12, color:'var(--inkm)', marginTop:2 }}>{profil.fonction} · {profil.societe}</div>
            <div style={{ fontSize:12, color:'var(--inkm)' }}>{profil.email} · {profil.tel}</div>
          </div>

          {/* Plan badge */}
          <div style={{ textAlign:'right', flexShrink:0 }}>
            <div style={{ background: profil.planColor, color:'white', fontSize:11, padding:'4px 12px', letterSpacing:'.08em', marginBottom:6 }}>
              {profil.plan.toUpperCase()}
            </div>
            <div style={{ fontSize:11, color:'var(--inkm)' }}>
              Renouvellement : <strong>{profil.prochain}</strong>
            </div>
            <div style={{ fontSize:11, color:'var(--ba)', marginTop:2 }}>
              {profil.joursRestants} jours restants
            </div>
          </div>
        </div>

        {/* ── ONGLETS ── */}
        <div style={{ display:'flex', borderBottom:'.5px solid var(--rule)', marginBottom:'2rem' }}>
          {TABS.map(t => (
            <button key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding:'.6rem 1.25rem', fontSize:12, letterSpacing:'.06em',
                border:'none', borderBottom: tab===t.key ? '2px solid var(--ba)' : '2px solid transparent',
                background:'transparent', cursor:'pointer', marginBottom:'-1px',
                color: tab===t.key ? 'var(--bd)' : 'var(--inkm)',
                fontWeight: tab===t.key ? 500 : 400,
                fontFamily:"'DM Sans',sans-serif"
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════
            TAB : PROFIL
        ════════════════════════════════════════ */}
        {tab === 'profil' && (
          <div>
            <div style={S.section}>
              <div style={S.sectionTitle}>Informations personnelles</div>
              <div style={S.row2}>
                <div style={S.group}>
                  <label style={S.label}>NOM COMPLET</label>
                  <input className="form-input" value={profil.nom} onChange={e => setProfil(p => ({ ...p, nom:e.target.value }))}/>
                </div>
                <div style={S.group}>
                  <label style={S.label}>FONCTION / TITRE</label>
                  <input className="form-input" value={profil.fonction} onChange={e => setProfil(p => ({ ...p, fonction:e.target.value }))}/>
                </div>
              </div>
              <div style={S.row2}>
                <div style={S.group}>
                  <label style={S.label}>EMAIL <span style={{ color:'var(--red)' }}>*</span></label>
                  <input className="form-input" type="email" value={profil.email} onChange={e => setProfil(p => ({ ...p, email:e.target.value }))}/>
                  <div style={S.hint}>Un email de confirmation sera envoyé en cas de changement</div>
                </div>
                <div style={S.group}>
                  <label style={S.label}>TÉLÉPHONE</label>
                  <input className="form-input" value={profil.tel} onChange={e => setProfil(p => ({ ...p, tel:e.target.value }))}/>
                </div>
              </div>
            </div>

            <div style={S.section}>
              <div style={S.sectionTitle}>Société</div>
              <div style={S.row2}>
                <div style={S.group}>
                  <label style={S.label}>NOM DE LA SOCIÉTÉ</label>
                  <input className="form-input" value={profil.societe} onChange={e => setProfil(p => ({ ...p, societe:e.target.value }))}/>
                </div>
                <div style={S.group}>
                  <label style={S.label}>VILLE</label>
                  <input className="form-input" value={profil.ville} onChange={e => setProfil(p => ({ ...p, ville:e.target.value }))}/>
                </div>
              </div>
            </div>

            <div style={S.section}>
              <div style={S.sectionTitle}>Photo de profil</div>
              <div style={{ display:'flex', alignItems:'center', gap:'1.5rem' }}>
                <div style={{ width:80, height:80, borderRadius:'50%', background:'var(--bd)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontSize:28, color:'white', fontWeight:700 }}>
                  {profil.avatar}
                </div>
                <div>
                  <button style={{ ...S.btn, background:'var(--bd)', color:'white', marginRight:'.75rem' }}>Changer la photo</button>
                  <button style={{ ...S.btn, background:'transparent', border:'.5px solid var(--rule)', color:'var(--inks)' }}>Supprimer</button>
                  <div style={{ ...S.hint, marginTop:8 }}>JPG ou PNG · max 2 MB · min 100×100 px</div>
                </div>
              </div>
            </div>

            <div style={{ display:'flex', gap:'.75rem' }}>
              <button style={{ ...S.btn, background:'var(--bd)', color:'white' }} onClick={saveProfil}>Sauvegarder les modifications</button>
              <button style={{ ...S.btn, background:'transparent', border:'.5px solid var(--rule)', color:'var(--inks)' }}>Annuler</button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB : ABONNEMENT
        ════════════════════════════════════════ */}
        {tab === 'abonnement' && (
          <div>
            {/* Plan actuel */}
            <div style={{ ...S.card, borderTop:`3px solid ${profil.planColor}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ fontSize:11, color:'var(--inkm)', letterSpacing:'.08em', marginBottom:6 }}>PLAN ACTUEL</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, color:'var(--bd)' }}>{profil.plan}</div>
                  <div style={{ fontSize:13, color:'var(--inks)', marginTop:4 }}>
                    <strong style={{ fontFamily:'monospace' }}>DH {profil.montant}</strong> / mois · TVA 20% incluse
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:12, color:'var(--inkm)', marginBottom:4 }}>Début : {profil.debut}</div>
                  <div style={{ fontSize:12, color:'var(--inkm)', marginBottom:8 }}>Prochain renouvellement : <strong>{profil.prochain}</strong></div>
                  {/* Barre de progression */}
                  <div style={{ width:180, height:6, background:'var(--bl)', borderRadius:3, overflow:'hidden' }}>
                    <div style={{ width:`${Math.round((profil.joursRestants/90)*100)}%`, height:'100%', background:'var(--ba)' }}/>
                  </div>
                  <div style={{ fontSize:11, color:'var(--ba)', marginTop:4 }}>{profil.joursRestants} jours restants</div>
                </div>
              </div>

              {/* Cycle */}
              <div style={{ marginTop:'1.25rem', paddingTop:'1.25rem', borderTop:'.5px solid var(--rule)', display:'flex', gap:'1rem' }}>
                {['mensuel','annuel'].map(c => (
                  <div key={c} onClick={() => setProfil(p => ({ ...p, cycle:c }))}
                    style={{
                      flex:1, padding:'1rem', border:`.5px solid ${profil.cycle===c ? 'var(--ba)' : 'var(--rule)'}`,
                      background: profil.cycle===c ? 'var(--bl)' : 'transparent',
                      cursor:'pointer', textAlign:'center', transition:'all .13s'
                    }}>
                    <div style={{ fontSize:13, fontWeight:500, color:'var(--bd)', marginBottom:4 }}>
                      {c === 'mensuel' ? 'Mensuel' : 'Annuel (-15%)'}
                    </div>
                    <div style={{ fontSize:12, color:'var(--inkm)' }}>
                      {c === 'mensuel' ? `DH ${profil.montant} / mois` : `DH ${Math.round(parseInt(profil.montant.replace(/\s/g,''))*0.85*12/100)*100} / an`}
                    </div>
                    {c === 'annuel' && <div style={{ fontSize:10, color:'var(--green)', marginTop:4 }}>Économie 2 mois offerts</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Changer de plan */}
            <div style={S.section}>
              <div style={S.sectionTitle}>Changer de forfait</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
                {[
                  { name:'Consultation', price:'799', color:'#D97706', features:['50 requêtes/mois','Modules de base','Support email'] },
                  { name:'Professionnel', price:'1 990', color:'var(--ba)', features:['Requêtes illimitées','Tous les modules','Support 24/7'] },
                  { name:'Cabinet', price:'4 990', color:'#991B1B', features:['Tout Pro +','Équipe jusqu\'à 10','API & ERP'] },
                ].map(p => (
                  <div key={p.name} style={{
                    border:`.5px solid ${p.name===profil.plan ? p.color : 'var(--rule)'}`,
                    padding:'1.25rem', position:'relative',
                    background: p.name===profil.plan ? 'var(--bl)' : 'transparent'
                  }}>
                    {p.name===profil.plan && (
                      <div style={{ position:'absolute', top:-1, right:'1rem', background:p.color, color:'white', fontSize:9, padding:'2px 8px', letterSpacing:'.1em' }}>ACTUEL</div>
                    )}
                    <div style={{ fontSize:11, letterSpacing:'.1em', color:'var(--inkm)', marginBottom:6 }}>{p.name.toUpperCase()}</div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:'var(--bd)', marginBottom:'1rem' }}>
                      <span style={{ fontSize:12, verticalAlign:'super' }}>DH </span>{p.price}
                    </div>
                    <ul style={{ listStyle:'none', marginBottom:'1rem' }}>
                      {p.features.map(f => <li key={f} style={{ fontSize:11, color:'var(--inks)', padding:'3px 0' }}>✓ {f}</li>)}
                    </ul>
                    {p.name !== profil.plan && (
                      <button style={{ width:'100%', padding:'.45rem', fontSize:11, letterSpacing:'.06em', border:`.5px solid ${p.color}`, background:'transparent', color:p.color, cursor:'pointer' }}
                        onClick={() => { setProfil(pr => ({ ...pr, plan:p.name, montant:p.price, planColor:p.color })); showToast(`✓ Forfait changé vers ${p.name}`) }}>
                        {parseInt(p.price.replace(/\s/g,'')) > parseInt(profil.montant.replace(/\s/g,'')) ? 'Upgrader' : 'Downgrader'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Résilier */}
            <div style={{ padding:'1rem', border:'.5px solid #FEE2E2', background:'#FFF5F5' }}>
              <div style={{ fontSize:13, fontWeight:500, color:'#991B1B', marginBottom:4 }}>Résilier l'abonnement</div>
              <div style={{ fontSize:12, color:'var(--inks)', marginBottom:'1rem' }}>
                Votre accès sera maintenu jusqu'au {profil.prochain}. Aucun remboursement ne sera effectué.
              </div>
              <button style={{ ...S.btn, background:'transparent', border:'.5px solid #DC2626', color:'#DC2626', fontSize:12 }}
                onClick={() => setShowCancelConfirm(true)}>
                Demander la résiliation
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB : PAIEMENT
        ════════════════════════════════════════ */}
        {tab === 'paiement' && (
          <div>
            <div style={S.section}>
              <div style={S.sectionTitle}>Mode de paiement</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
                {[
                  { key:'carte', label:'Carte bancaire', sub:'Visa · Mastercard' },
                  { key:'bp', label:'Banque Populaire', sub:'CIH · Chèque certifié' },
                  { key:'virement', label:'Virement bancaire', sub:'RIB / IBAN marocain' },
                  { key:'mobile', label:'Paiement mobile', sub:'Orange Money · Inwi Money' },
                ].map(m => (
                  <div key={m.key}
                    onClick={() => setPaiement(p => ({ ...p, mode:m.key }))}
                    style={{
                      padding:'1rem', border:`.5px solid ${paiement.mode===m.key ? 'var(--ba)' : 'var(--rule)'}`,
                      background: paiement.mode===m.key ? 'var(--bl)' : 'transparent',
                      cursor:'pointer', transition:'all .13s'
                    }}>
                    <div style={{ fontSize:13, fontWeight:500, color:'var(--bd)', marginBottom:2 }}>{m.label}</div>
                    <div style={{ fontSize:11, color:'var(--inkm)' }}>{m.sub}</div>
                  </div>
                ))}
              </div>

              {/* Formulaire carte */}
              {paiement.mode === 'carte' && (
                <div>
                  <div style={S.group}>
                    <label style={S.label}>NUMÉRO DE CARTE</label>
                    <input className="form-input" style={{ fontFamily:'monospace', letterSpacing:'.1em' }}
                      placeholder="1234  5678  9012  3456" maxLength={19}
                      value={paiement.carte.num}
                      onChange={e => {
                        const v = e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim()
                        setPaiement(p => ({ ...p, carte:{ ...p.carte, num:v } }))
                      }}/>
                  </div>
                  <div style={S.row3}>
                    <div style={{ gridColumn:'span 2' }}>
                      <label style={S.label}>NOM SUR LA CARTE</label>
                      <input className="form-input" placeholder="FATIMA ZAHRA IDRISSI"
                        value={paiement.carte.nom}
                        onChange={e => setPaiement(p => ({ ...p, carte:{ ...p.carte, nom:e.target.value.toUpperCase() } }))}/>
                    </div>
                    <div>
                      <label style={S.label}>EXPIRATION</label>
                      <input className="form-input" style={{ fontFamily:'monospace' }} placeholder="MM/AA" maxLength={5}
                        value={paiement.carte.exp}
                        onChange={e => {
                          const v = e.target.value.replace(/\D/g,'').replace(/^(\d{2})(\d)/, '$1/$2')
                          setPaiement(p => ({ ...p, carte:{ ...p.carte, exp:v } }))
                        }}/>
                    </div>
                  </div>
                  <div style={{ ...S.hint, padding:'.75rem', background:'#FFFBEB', border:'.5px solid #FEF3C7' }}>
                    🔒 Vos données de carte sont chiffrées et ne sont jamais stockées sur nos serveurs.
                  </div>
                </div>
              )}

              {/* Formulaire BP */}
              {paiement.mode === 'bp' && (
                <div>
                  <div style={{ padding:'1rem', background:'var(--bl)', fontSize:13, color:'var(--bm)', marginBottom:'1rem', lineHeight:1.6 }}>
                    Paiement par virement Banque Populaire ou dépôt de chèque certifié à l'ordre de <strong>DAS — Douane Assist Solutions</strong>.
                    <br/>Référence à indiquer : votre email d'inscription.
                  </div>
                  <div style={S.group}>
                    <label style={S.label}>RIB EXPÉDITEUR (pour confirmation)</label>
                    <input className="form-input" style={{ fontFamily:'monospace' }} placeholder="007 780 0123456789012 34"
                      value={paiement.bp.rib}
                      onChange={e => setPaiement(p => ({ ...p, bp:{ ...p.bp, rib:e.target.value } }))}/>
                  </div>
                  <div style={S.group}>
                    <label style={S.label}>NOM DU TITULAIRE DU COMPTE</label>
                    <input className="form-input" value={paiement.bp.titulaire}
                      onChange={e => setPaiement(p => ({ ...p, bp:{ ...p.bp, titulaire:e.target.value } }))}/>
                  </div>
                </div>
              )}

              {/* Formulaire virement */}
              {paiement.mode === 'virement' && (
                <div>
                  <div style={{ padding:'1rem', background:'var(--bl)', fontSize:13, color:'var(--bm)', marginBottom:'1rem' }}>
                    <strong>RIB DAS pour recevoir votre virement :</strong><br/>
                    <span style={{ fontFamily:'monospace', fontSize:14, letterSpacing:'.05em' }}>007 780 0000000000000 00</span><br/>
                    Objet du virement : votre email d'inscription
                  </div>
                  <div style={S.group}>
                    <label style={S.label}>VOTRE RIB / IBAN (pour nos archives)</label>
                    <input className="form-input" style={{ fontFamily:'monospace' }} placeholder="MA64 007 780 0123456789012 34"
                      value={paiement.virement.rib}
                      onChange={e => setPaiement(p => ({ ...p, virement:{ ...p.virement, rib:e.target.value } }))}/>
                  </div>
                  <div style={S.group}>
                    <label style={S.label}>NOM DE VOTRE BANQUE</label>
                    <input className="form-input" value={paiement.virement.banque}
                      onChange={e => setPaiement(p => ({ ...p, virement:{ ...p.virement, banque:e.target.value } }))}/>
                  </div>
                </div>
              )}

              {/* Formulaire mobile */}
              {paiement.mode === 'mobile' && (
                <div>
                  <div style={S.row2}>
                    <div style={S.group}>
                      <label style={S.label}>OPÉRATEUR</label>
                      <select className="form-select" value={paiement.mobile.operateur}
                        onChange={e => setPaiement(p => ({ ...p, mobile:{ ...p.mobile, operateur:e.target.value } }))}>
                        <option value="orange">Orange Money</option>
                        <option value="inwi">Inwi Money</option>
                        <option value="maroc_telecom">IAM / Maroc Telecom</option>
                      </select>
                    </div>
                    <div style={S.group}>
                      <label style={S.label}>NUMÉRO MOBILE</label>
                      <input className="form-input" style={{ fontFamily:'monospace' }} placeholder="+212 6 XX XX XX XX"
                        value={paiement.mobile.tel}
                        onChange={e => setPaiement(p => ({ ...p, mobile:{ ...p.mobile, tel:e.target.value } }))}/>
                    </div>
                  </div>
                </div>
              )}

              <button style={{ ...S.btn, background:'var(--bd)', color:'white', marginTop:'1.5rem' }} onClick={savePaiement}>
                Enregistrer le mode de paiement
              </button>
            </div>

            {/* Historique factures */}
            <div style={S.section}>
              <div style={S.sectionTitle}>Historique de facturation</div>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                <thead>
                  <tr style={{ background:'var(--bd)', color:'white' }}>
                    <th style={{ padding:'.5rem 1rem', textAlign:'left', fontSize:11 }}>DATE</th>
                    <th style={{ padding:'.5rem 1rem', textAlign:'left', fontSize:11 }}>DESCRIPTION</th>
                    <th style={{ padding:'.5rem 1rem', textAlign:'right', fontSize:11 }}>MONTANT</th>
                    <th style={{ padding:'.5rem 1rem', textAlign:'center', fontSize:11 }}>FACTURE</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date:'02/04/2025', desc:'Cabinet & Entreprise — Avril 2025', montant:'4 990 DH', statut:'En attente' },
                    { date:'02/03/2025', desc:'Cabinet & Entreprise — Mars 2025', montant:'4 990 DH', statut:'Payé' },
                    { date:'02/02/2025', desc:'Cabinet & Entreprise — Février 2025', montant:'4 990 DH', statut:'Payé' },
                  ].map((f, i) => (
                    <tr key={i} style={{ borderBottom:'.5px solid var(--rule)' }}>
                      <td style={{ padding:'.55rem 1rem', color:'var(--inkm)' }}>{f.date}</td>
                      <td style={{ padding:'.55rem 1rem' }}>{f.desc}</td>
                      <td style={{ padding:'.55rem 1rem', textAlign:'right', fontFamily:'monospace' }}>{f.montant}</td>
                      <td style={{ padding:'.55rem 1rem', textAlign:'center' }}>
                        <button style={{ fontSize:11, background:'transparent', border:'.5px solid var(--rule)', padding:'2px 10px', cursor:'pointer', color:'var(--inks)' }}>
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB : ÉQUIPE
        ════════════════════════════════════════ */}
        {tab === 'equipe' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <div>
                <div style={S.sectionTitle}>Membres de l'équipe</div>
                <div style={{ fontSize:12, color:'var(--inkm)', marginTop:-8 }}>
                  Plan Cabinet · jusqu'à 10 utilisateurs · {team.length}/10 utilisés
                </div>
              </div>
              <button style={{ ...S.btn, background:'var(--bd)', color:'white' }}
                onClick={() => setShowAddMember(true)}>
                + Inviter un membre
              </button>
            </div>

            {/* Barre d'utilisation */}
            <div style={{ marginBottom:'1.5rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--inkm)', marginBottom:4 }}>
                <span>Sièges utilisés</span><span>{team.length}/10</span>
              </div>
              <div style={{ height:6, background:'var(--bl)', borderRadius:3, overflow:'hidden' }}>
                <div style={{ width:`${team.length*10}%`, height:'100%', background:'var(--ba)' }}/>
              </div>
            </div>

            {/* Liste membres */}
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'var(--bd)', color:'white' }}>
                  <th style={{ padding:'.5rem 1rem', textAlign:'left', fontSize:11 }}>MEMBRE</th>
                  <th style={{ padding:'.5rem 1rem', textAlign:'left', fontSize:11 }}>EMAIL</th>
                  <th style={{ padding:'.5rem 1rem', textAlign:'center', fontSize:11 }}>RÔLE</th>
                  <th style={{ padding:'.5rem 1rem', textAlign:'center', fontSize:11 }}>STATUT</th>
                  <th style={{ padding:'.5rem 1rem', textAlign:'left', fontSize:11 }}>DERNIER ACCÈS</th>
                  <th style={{ padding:'.5rem 1rem', textAlign:'center', fontSize:11 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {team.map(m => (
                  <tr key={m.id} style={{ borderBottom:'.5px solid var(--rule)' }}>
                    <td style={{ padding:'.6rem 1rem', fontWeight:500, fontSize:13 }}>{m.nom}</td>
                    <td style={{ padding:'.6rem 1rem', fontSize:12, color:'var(--inks)' }}>{m.email}</td>
                    <td style={{ padding:'.6rem 1rem', textAlign:'center' }}>
                      <select
                        style={{ fontSize:11, padding:'2px 6px', border:'.5px solid var(--rule)', background:'transparent', cursor:'pointer' }}
                        value={m.role}
                        onChange={e => setTeam(t => t.map(x => x.id===m.id ? { ...x, role:e.target.value as 'admin'|'lecteur' } : x))}>
                        <option value="admin">Admin</option>
                        <option value="lecteur">Lecteur</option>
                      </select>
                    </td>
                    <td style={{ padding:'.6rem 1rem', textAlign:'center' }}>
                      <span style={{
                        fontSize:10, padding:'2px 8px', letterSpacing:'.06em',
                        background: m.actif ? '#DCFCE7' : '#FEE2E2',
                        color: m.actif ? '#166534' : '#991B1B'
                      }}>
                        {m.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td style={{ padding:'.6rem 1rem', fontSize:11, color:'var(--inkm)' }}>{m.dernierAcces}</td>
                    <td style={{ padding:'.6rem 1rem', textAlign:'center' }}>
                      <div style={{ display:'flex', gap:4, justifyContent:'center' }}>
                        <button
                          style={{ fontSize:10, padding:'2px 8px', border:`.5px solid ${m.actif ? 'var(--amber)' : 'var(--green)'}`, background:'transparent', color: m.actif ? 'var(--amber)' : 'var(--green)', cursor:'pointer' }}
                          onClick={() => { setTeam(t => t.map(x => x.id===m.id ? { ...x, actif:!x.actif } : x)); showToast(m.actif ? `${m.nom} désactivé` : `${m.nom} réactivé`) }}>
                          {m.actif ? 'Désactiver' : 'Réactiver'}
                        </button>
                        <button
                          style={{ fontSize:10, padding:'2px 8px', border:'.5px solid var(--red)', background:'transparent', color:'var(--red)', cursor:'pointer' }}
                          onClick={() => { setTeam(t => t.filter(x => x.id !== m.id)); showToast(`${m.nom} retiré de l'équipe`) }}>
                          Retirer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Formulaire ajout membre */}
            {showAddMember && (
              <div style={{ marginTop:'1.5rem', padding:'1.5rem', border:'.5px solid var(--ba)', background:'var(--bl)' }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, color:'var(--bd)', marginBottom:'1rem' }}>Inviter un nouveau membre</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr auto', gap:'1rem', alignItems:'flex-end' }}>
                  <div>
                    <label style={S.label}>NOM</label>
                    <input className="form-input" placeholder="Nom complet" value={newMember.nom} onChange={e => setNewMember(m => ({ ...m, nom:e.target.value }))}/>
                  </div>
                  <div>
                    <label style={S.label}>EMAIL</label>
                    <input className="form-input" type="email" placeholder="email@societe.ma" value={newMember.email} onChange={e => setNewMember(m => ({ ...m, email:e.target.value }))}/>
                  </div>
                  <div>
                    <label style={S.label}>RÔLE</label>
                    <select className="form-select" value={newMember.role} onChange={e => setNewMember(m => ({ ...m, role:e.target.value as 'admin'|'lecteur' }))}>
                      <option value="lecteur">Lecteur</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <button style={{ ...S.btn, background:'var(--bd)', color:'white' }} onClick={addMember}>Inviter</button>
                </div>
                <div style={S.hint}>Un email d'invitation sera envoyé à cette adresse.</div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB : SÉCURITÉ
        ════════════════════════════════════════ */}
        {tab === 'securite' && (
          <div>
            <div style={S.section}>
              <div style={S.sectionTitle}>Changer le mot de passe</div>
              <div style={{ maxWidth:420 }}>
                <div style={S.group}><label style={S.label}>MOT DE PASSE ACTUEL</label><input className="form-input" type="password" placeholder="••••••••"/></div>
                <div style={S.group}><label style={S.label}>NOUVEAU MOT DE PASSE</label><input className="form-input" type="password" placeholder="Minimum 8 caractères"/></div>
                <div style={S.group}><label style={S.label}>CONFIRMER LE NOUVEAU MOT DE PASSE</label><input className="form-input" type="password" placeholder="Répétez le mot de passe"/></div>
                <button style={{ ...S.btn, background:'var(--bd)', color:'white' }} onClick={() => showToast('✓ Mot de passe mis à jour')}>Mettre à jour</button>
              </div>
            </div>

            <div style={S.section}>
              <div style={S.sectionTitle}>Sessions actives</div>
              {[
                { device:'Chrome · Windows 11', lieu:'Casablanca, MA', date:'Maintenant', current:true },
                { device:'Safari · iPhone 15', lieu:'Casablanca, MA', date:'Il y a 2h', current:false },
                { device:'Chrome · MacBook Pro', lieu:'Rabat, MA', date:'Hier 14:22', current:false },
              ].map((s, i) => (
                <div key={i} style={{ ...S.card, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:500, color:'var(--bd)' }}>{s.device}</div>
                    <div style={{ fontSize:11, color:'var(--inkm)', marginTop:2 }}>{s.lieu} · {s.date}</div>
                  </div>
                  <div style={{ display:'flex', gap:'.75rem', alignItems:'center' }}>
                    {s.current && <span style={{ fontSize:10, background:'#DCFCE7', color:'#166534', padding:'2px 8px', letterSpacing:'.06em' }}>SESSION ACTUELLE</span>}
                    {!s.current && <button style={{ fontSize:11, background:'transparent', border:'.5px solid var(--red)', color:'var(--red)', padding:'3px 10px', cursor:'pointer' }}
                      onClick={() => showToast('Session déconnectée')}>Déconnecter</button>}
                  </div>
                </div>
              ))}
            </div>

            <div style={S.section}>
              <div style={S.sectionTitle}>Zone de danger</div>
              <div style={{ padding:'1rem', border:'.5px solid #FEE2E2', background:'#FFF5F5' }}>
                <div style={{ fontSize:13, fontWeight:500, color:'#991B1B', marginBottom:4 }}>Supprimer mon compte</div>
                <div style={{ fontSize:12, color:'var(--inks)', marginBottom:'1rem' }}>Cette action supprime définitivement votre compte, vos données et annule votre abonnement.</div>
                <button style={{ ...S.btn, background:'transparent', border:'.5px solid #DC2626', color:'#DC2626', fontSize:12 }}>
                  Supprimer mon compte
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL RÉSILIATION ── */}
        {showCancelConfirm && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ background:'var(--white)', width:440 }}>
              <div style={{ padding:'1.2rem 1.5rem', background:'#FEE2E2', borderBottom:'.5px solid #FECACA' }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:'#991B1B' }}>Confirmer la résiliation</div>
              </div>
              <div style={{ padding:'1.5rem', fontSize:13, color:'var(--inks)', lineHeight:1.7 }}>
                Votre abonnement <strong>{profil.plan}</strong> sera résilié.<br/>
                Vous conserverez l'accès jusqu'au <strong>{profil.prochain}</strong>.<br/>
                <span style={{ color:'var(--red)', fontSize:12 }}>Aucun remboursement ne sera effectué.</span>
              </div>
              <div style={{ padding:'1rem 1.5rem', borderTop:'.5px solid var(--rule)', display:'flex', justifyContent:'flex-end', gap:'.75rem' }}>
                <button style={{ ...S.btn, background:'transparent', border:'.5px solid var(--rule)', color:'var(--inks)' }} onClick={() => setShowCancelConfirm(false)}>Annuler</button>
                <button style={{ ...S.btn, background:'#DC2626', color:'white' }} onClick={() => { setShowCancelConfirm(false); showToast('Demande de résiliation enregistrée') }}>Confirmer la résiliation</button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{ position:'fixed', bottom:'1.5rem', right:'1.5rem', background:'var(--bd)', color:'white', padding:'.7rem 1.25rem', fontSize:13, zIndex:999, boxShadow:'0 4px 16px rgba(0,0,0,.2)' }}>
          {toast}
        </div>
      )}
    </Layout>
  )
}
