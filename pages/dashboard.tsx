import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Layout from '../components/Layout'

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface UserProfile {
  profil:   string
  secteurs: string[]
  codesSH:  string[]
  maturite: string
  nom?:     string
}

// ─────────────────────────────────────────────────────────────────────────────
// STATIC DATA (à remplacer par queries Supabase)
// ─────────────────────────────────────────────────────────────────────────────
const DOSSIERS = [
  { ref:'#D-2026-018', obj:'Classement code SH — composants LED',         mod:'Classement', statut:'Résolu',    cls:'bg', date:'20/03/2026' },
  { ref:'#D-2026-015', obj:'Régime AT — moules industriels',              mod:'Régimes',    statut:'En cours',  cls:'ba', date:'18/03/2026' },
  { ref:'#D-2026-012', obj:'Recours gracieux — rappel de droits',         mod:'Contentieux',statut:'En attente',cls:'bb', date:'15/03/2026' },
  { ref:'#D-2026-009', obj:'Calcul droits import équipements médicaux',   mod:'Tarifs',     statut:'Résolu',    cls:'bg', date:'10/03/2026' },
  { ref:'#D-2026-005', obj:'Origine préférentielle ALECA — textile coton',mod:'Origine',    statut:'En cours',  cls:'ba', date:'05/03/2026' },
]

const HIST_IA = [
  { q:'Taux DI sur véhicules électriques importés',           module:'Tarifs',       date:'02/04 09:14' },
  { q:'Régime admission temporaire — pièces aéronefs',        module:'Régimes',      date:'01/04 16:32' },
  { q:'Exonération TVA médicaments importés',                 module:'TVA',          date:'01/04 11:05' },
  { q:'Délais dédouanement Tanger Med 2026',                  module:'Procédures',   date:'31/03 08:47' },
  { q:'Calcul PFI pour import textiles depuis Chine (FOB)',   module:'Tarifs',       date:'30/03 14:20' },
  { q:'Conditions régime drawback exportations',              module:'Régimes',      date:'29/03 10:11' },
  { q:'Infractions douanières — délais prescription',         module:'Contentieux',  date:'28/03 09:33' },
]

const ALERTS = [
  { level:'rouge', titre:'Circulaire N°6241 — TIC boissons sucrées',        meta:'Impacte vos codes 2202.10 · 2202.90',          date:'Auj.' },
  { level:'amber', titre:'Modification DI chapitre 61 textile',             meta:'17,5% → 15% effectif 1er avril 2026',          date:'2j'   },
  { level:'bleu',  titre:'BADR v4.2 — nouveaux champs DUM obligatoires',    meta:'Formation requise avant le 15/04/2026',        date:'5j'   },
  { level:'vert',  titre:'ALECA — origine préférentielle confirmée',        meta:'Exportations textile UE éligibles EUR-1',      date:'1sem' },
]

const SCORE_DOMAINS = [
  { label:'Classement SH',       val:85, color:'#4CAF7C' },
  { label:'Régimes économiques', val:78, color:'#4CAF7C' },
  { label:'Fiscalité douanière', val:72, color:'#C9A84C' },
  { label:'Procédures BADR',     val:65, color:'#C9A84C' },
  { label:'Contrôle des risques',val:55, color:'#E85D5D' },
  { label:'Contentieux',         val:90, color:'#4CAF7C' },
]

const PROFIL_LABELS: Record<string,string> = {
  transitaire:'Transitaire / Agent en douane',
  pme:'PME importatrice',
  cabinet:'Cabinet conseil douanier',
  direction:'Direction logistique',
  autre:'Autre profil',
}

const MATURITE_LABELS: Record<string,string> = {
  debutant:'Débutant',
  intermediaire:'Intermédiaire',
  expert:'Expert',
}

const ACTIVITY = [2,0,3,5,1,4,2,6,3,1,4,5,3,7,2,4,5,2,3,6,4,1,5,3,7,4,2,6,3,4]
const ACT_LBLS = ['3/3','','5/3','','7/3','','9/3','','11/3','','13/3','','15/3','','17/3','','19/3','','21/3','','23/3','','25/3','','27/3','','29/3','','31/3','2/4']
const PIE_DATA   = [34,22,18,14,12]
const PIE_COLORS = ['#C9A84C','#378ADD','#4CAF7C','#D85A30','#888780']
const PIE_LBLS   = ['Tarifs 34%','Régimes 22%','TVA 18%','Procédures 14%','Autres 12%']

type Tab = 'general' | 'dossiers' | 'historique' | 'profil' | 'facturation'

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('general')
  const [profile,   setProfile]   = useState<UserProfile | null>(null)
  const [mounted,   setMounted]   = useState(false)

  const actRef  = useRef<HTMLCanvasElement>(null)
  const pieRef  = useRef<HTMLCanvasElement>(null)
  const actInst = useRef<any>(null)
  const pieInst = useRef<any>(null)

  // Load profile
  useEffect(() => {
    setMounted(true)
    try {
      const raw = localStorage.getItem('douane_profile')
      if (raw) setProfile(JSON.parse(raw))
    } catch {}
  }, [])

  // Charts
  useEffect(() => {
    if (activeTab !== 'general') return
    const existing = document.getElementById('chartjs-script')
    if (existing) { initCharts(); return }
    const s = document.createElement('script')
    s.id = 'chartjs-script'
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
    s.onload = initCharts
    document.body.appendChild(s)
  }, [activeTab])

  function initCharts() {
    const C = (window as any).Chart
    if (!C) return
    if (actRef.current && !actInst.current) {
      actInst.current = new C(actRef.current, {
        type:'bar',
        data:{ labels:ACT_LBLS, datasets:[{ data:ACTIVITY, backgroundColor:'#C9A84C', borderRadius:2 }] },
        options:{ responsive:true, maintainAspectRatio:false,
          plugins:{ legend:{ display:false } },
          scales:{
            x:{ ticks:{ font:{size:9}, maxRotation:45, color:'#8A8078', autoSkip:true, maxTicksLimit:10 }, grid:{ display:false } },
            y:{ ticks:{ font:{size:10}, color:'#8A8078' }, grid:{ color:'rgba(0,0,0,.05)' } },
          },
        },
      })
    }
    if (pieRef.current && !pieInst.current) {
      pieInst.current = new C(pieRef.current, {
        type:'doughnut',
        data:{ labels:PIE_LBLS, datasets:[{ data:PIE_DATA, backgroundColor:PIE_COLORS, borderWidth:0 }] },
        options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, cutout:'68%' },
      })
    }
  }

  useEffect(() => () => { actInst.current?.destroy(); pieInst.current?.destroy() }, [])

  const greet = () => {
    const h = new Date().getHours()
    return h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir'
  }

  const dotColor = (l:string) => ({ rouge:'#E85D5D', amber:'#C9A84C', bleu:'#378ADD', vert:'#4CAF7C' }[l]||'#8A8078')

  const scoreGlobal = Math.round(SCORE_DOMAINS.reduce((a,s)=>a+s.val,0)/SCORE_DOMAINS.length)

  const TABS: { id:Tab; label:string }[] = [
    { id:'general',    label:'Vue générale'    },
    { id:'dossiers',   label:'Mes dossiers'    },
    { id:'historique', label:'Historique IA'   },
    { id:'profil',     label:'Mon profil'      },
    { id:'facturation',label:'Facturation'     },
  ]

  return (
    <Layout variant="inner">
      <Head><title>Mon Dashboard — Douane.ia</title></Head>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── EN-TÊTE ── */}
      <div className="db-top">
        <div>
          <div className="db-kicker">MON ESPACE</div>
          <h1 className="db-title">
            {greet()}{mounted && profile?.nom ? `, ${profile.nom}` : ''}
          </h1>
          <p className="db-sub">
            {mounted && profile
              ? `${PROFIL_LABELS[profile.profil] || profile.profil} · ${new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}`
              : 'Gérez vos dossiers douaniers, vos requêtes IA et votre abonnement.'
            }
          </p>
        </div>
        <div className="db-top-actions">
          <Link href="/onboarding" className="db-btn-outline">Modifier mon profil</Link>
          <Link href="/" className="db-btn-primary">Poser une question IA →</Link>
        </div>
      </div>

      {/* ── TAGS PROFIL ── */}
      {mounted && profile?.secteurs?.length > 0 && (
        <div className="db-tags">
          {profile.secteurs.map(s => <span key={s} className="db-tag">{s}</span>)}
          {profile.codesSH?.filter(Boolean).map(c => (
            <span key={c} className="db-tag db-tag-sh">{c}</span>
          ))}
        </div>
      )}

      {/* ── KPIs ── */}
      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-lbl">REQUÊTES CE MOIS</div>
          <div className="dash-val">47</div>
          <div className="dash-sub up">+12 cette semaine</div>
        </div>
        <div className="dash-card">
          <div className="dash-lbl">DOSSIERS ACTIFS</div>
          <div className="dash-val">5</div>
          <div className="dash-sub neu">2 en attente de documents</div>
        </div>
        <div className="dash-card">
          <div className="dash-lbl">ALERTES NON LUES</div>
          <div className="dash-val">3</div>
          <div className="dash-sub dn">1 critique · 2 info</div>
        </div>
        <div className="dash-card">
          <div className="dash-lbl">SCORE CONFORMITÉ</div>
          <div className="dash-val">{scoreGlobal}%</div>
          <div className="dash-sub up">+5 pts depuis l'audit</div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="tabs">
        {TABS.map(t => (
          <button key={t.id} className={`tab${activeTab===t.id?' active':''}`} onClick={()=>setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════ TAB : VUE GÉNÉRALE ══════════════ */}
      {activeTab === 'general' && (
        <div>
          {/* Activité + Donut */}
          <div className="db-row-wide">
            <div className="db-card">
              <div className="db-card-title">Activité — questions posées (30 jours)</div>
              <div style={{ position:'relative', height:170 }}>
                <canvas ref={actRef} />
              </div>
            </div>
            <div className="db-card">
              <div className="db-card-title">Répartition par domaine</div>
              <div className="db-pie-wrap">
                <div style={{ position:'relative', height:130, width:130, flexShrink:0 }}>
                  <canvas ref={pieRef} />
                </div>
                <div className="db-pie-legend">
                  {PIE_LBLS.map((l,i) => (
                    <span key={i} className="db-leg"><span className="db-leg-dot" style={{background:PIE_COLORS[i]}} />{l}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Alertes + Score */}
          <div className="db-row-half">
            <div className="db-card">
              <div className="db-card-title">Alertes réglementaires</div>
              {ALERTS.map((a,i) => (
                <div key={i} className="db-alert">
                  <div className="db-alert-dot" style={{background:dotColor(a.level)}} />
                  <div className="db-alert-body">
                    <div className="db-alert-title">{a.titre}</div>
                    <div className="db-alert-meta">{a.meta}</div>
                  </div>
                  <div className="db-alert-date">{a.date}</div>
                </div>
              ))}
              <Link href="/modules/risques" className="db-link-more">Voir le Contrôle des risques →</Link>
            </div>

            <div className="db-card">
              <div className="db-card-title">
                Score conformité
                <span className="db-score-badge" style={{
                  background: scoreGlobal>=80?'#E8F4EE':scoreGlobal>=60?'#FBF5E6':'#FAE8E8',
                  color:      scoreGlobal>=80?'#2D6A3F':scoreGlobal>=60?'#8A5A00':'#8B1A1A',
                }}>
                  {scoreGlobal>=80?'Conforme':scoreGlobal>=60?'À améliorer':'Risque élevé'}
                </span>
              </div>
              <div className="db-score-global">
                <span className="db-score-num" style={{color:scoreGlobal>=80?'#4CAF7C':scoreGlobal>=60?'#C9A84C':'#E85D5D'}}>
                  {scoreGlobal}%
                </span>
                <span className="db-score-label">score global</span>
              </div>
              {SCORE_DOMAINS.map((s,i) => (
                <div key={i} className="db-score-row">
                  <span className="db-score-domain">{s.label}</span>
                  <div className="db-score-bar"><div className="db-score-fill" style={{width:`${s.val}%`,background:s.color}} /></div>
                  <span className="db-score-val">{s.val}</span>
                </div>
              ))}
              <Link href="/modules/audit" className="db-link-more">Refaire l'audit complet →</Link>
            </div>
          </div>

          {/* Insights IA */}
          <div className="db-card db-insights-card">
            <div className="db-card-title">Analyse IA — recommandations personnalisées</div>
            <div className="db-insights-grid">
              <div className="db-insight db-insight-gold">
                <div className="db-insight-head">Point fort</div>
                <div className="db-insight-body">Vos questions sur les régimes économiques (+22%) montrent une maîtrise croissante de l'admission temporaire et du drawback.</div>
              </div>
              <div className="db-insight db-insight-amber">
                <div className="db-insight-head">À renforcer</div>
                <div className="db-insight-body">
                  Score faible en contrôle des risques (55%). Le <strong>Module 12</strong> — 38 situations — correspond à votre profil
                  {mounted && profile ? ` ${PROFIL_LABELS[profile.profil]?.toLowerCase()}` : ''}.
                </div>
              </div>
              <div className="db-insight db-insight-red">
                <div className="db-insight-head">Alerte prioritaire</div>
                <div className="db-insight-body">La circulaire N°6241 impacte <strong>2 de vos codes SH surveillés</strong>. Vérifiez le recalcul TIC avant votre prochaine déclaration.</div>
              </div>
            </div>
            <div className="db-insights-actions">
              <Link href="/modules/risques" className="db-ai-btn">Voir le Contrôle des risques →</Link>
              <Link href="/modules/audit"   className="db-ai-btn">Passer l'audit conformité →</Link>
              <Link href="/"                className="db-ai-btn">Interroger l'IA douanière →</Link>
            </div>
          </div>

          {/* Accès rapide */}
          <div className="db-card" style={{marginTop:'1rem'}}>
            <div className="db-card-title">Accès rapide aux modules</div>
            <div className="db-ql-grid">
              {[
                ['/modules/simulateur',  'SIM', 'Simulateur droits & taxes'],
                ['/modules/comparateur', 'CMP', 'Comparateur régimes'],
                ['/modules/faq',         '00',  'FAQ Douanière'],
                ['/modules/audit',       '05',  'Audit douanier'],
                ['/modules/risques',     '12',  'Contrôle des risques'],
                ['/modules/incoterms',   'INC', 'Incoterms 2020'],
              ].map(([href,num,label]) => (
                <Link key={href} href={href} className="db-ql-item">
                  <span className="db-ql-num">{num}</span>
                  <span className="db-ql-label">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ TAB : MES DOSSIERS ══════════════ */}
      {activeTab === 'dossiers' && (
        <div>
          <div className="db-table-header">
            <span className="db-table-count">{DOSSIERS.length} dossiers</span>
            <button className="db-btn-outline">+ Nouveau dossier</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Objet</th>
                <th>Module</th>
                <th>Statut</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {DOSSIERS.map(d => (
                <tr key={d.ref}>
                  <td style={{fontFamily:'monospace',fontSize:12}}>{d.ref}</td>
                  <td>{d.obj}</td>
                  <td><span className="db-module-tag">{d.mod}</span></td>
                  <td><span className={`badge ${d.cls}`}>{d.statut}</span></td>
                  <td style={{color:'var(--inkm,#8A8078)',fontSize:12}}>{d.date}</td>
                  <td><button className="db-row-action">Voir →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ══════════════ TAB : HISTORIQUE IA ══════════════ */}
      {activeTab === 'historique' && (
        <div>
          <div className="db-table-header">
            <span className="db-table-count">{HIST_IA.length} requêtes récentes</span>
            <span className="db-quota-info">47 requêtes ce mois · 23 restantes (plan Pro)</span>
          </div>
          {HIST_IA.map((h,i) => (
            <div key={i} className="db-hist-row">
              <svg className="db-hist-icon" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#C9A84C" strokeWidth="1.2"/>
                <path d="M7 4v3l2 1.5" stroke="#C9A84C" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <div className="db-hist-body">
                <div className="db-hist-q">{h.q}</div>
                <span className="db-module-tag" style={{marginTop:4,display:'inline-block'}}>{h.module}</span>
              </div>
              <div className="db-hist-date">{h.date}</div>
              <button className="db-row-action">Rejouer →</button>
            </div>
          ))}
          <div style={{padding:'1rem 0',borderTop:'1px solid var(--border,#E8DFC8)',marginTop:'.5rem'}}>
            <Link href="/" className="db-link-more">Accéder au Chat IA →</Link>
          </div>
        </div>
      )}

      {/* ══════════════ TAB : MON PROFIL ══════════════ */}
      {activeTab === 'profil' && (
        <div className="db-row-half">
          {mounted && profile ? (
            <div className="db-card">
              <div className="db-card-title">Profil personnalisé</div>
              <table className="db-profile-table">
                <tbody>
                  <tr>
                    <td className="db-pt-lbl">Profil métier</td>
                    <td className="db-pt-val">{PROFIL_LABELS[profile.profil] || profile.profil}</td>
                  </tr>
                  <tr>
                    <td className="db-pt-lbl">Niveau</td>
                    <td className="db-pt-val">{MATURITE_LABELS[profile.maturite] || profile.maturite}</td>
                  </tr>
                  <tr>
                    <td className="db-pt-lbl">Secteurs</td>
                    <td className="db-pt-val">
                      <div className="db-tags" style={{margin:0}}>
                        {profile.secteurs.map(s=><span key={s} className="db-tag">{s}</span>)}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="db-pt-lbl">Codes SH surveillés</td>
                    <td className="db-pt-val">
                      <div className="db-tags" style={{margin:0}}>
                        {profile.codesSH?.filter(Boolean).map(c=><span key={c} className="db-tag db-tag-sh">{c}</span>)}
                        {(!profile.codesSH?.filter(Boolean).length) && <span style={{color:'var(--inkm,#8A8078)',fontSize:12}}>Aucun code configuré</span>}
                      </div>
                    </td>
                  </tr>
                  {profile.nom && (
                    <tr>
                      <td className="db-pt-lbl">Prénom</td>
                      <td className="db-pt-val">{profile.nom}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="db-pt-lbl">Configuré le</td>
                    <td className="db-pt-val" style={{color:'var(--inkm,#8A8078)',fontSize:12}}>
                      {new Date().toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                </tbody>
              </table>
              <Link href="/onboarding" className="db-btn-primary" style={{display:'inline-block',marginTop:'1.25rem',textDecoration:'none'}}>
                Modifier mes préférences →
              </Link>
            </div>
          ) : (
            <div className="db-card db-empty-state">
              <div className="db-empty-title">Profil non configuré</div>
              <div className="db-empty-sub">Répondez à 4 questions pour personnaliser votre dashboard, vos alertes et les réponses de l'IA.</div>
              <Link href="/onboarding" className="db-btn-primary" style={{display:'inline-block',marginTop:'1.25rem',textDecoration:'none'}}>
                Configurer mon profil →
              </Link>
            </div>
          )}

          <div className="db-card">
            <div className="db-card-title">Mon abonnement</div>
            <div className="db-plan-badge">Plan Pro</div>
            <table className="db-profile-table">
              <tbody>
                <tr><td className="db-pt-lbl">Statut</td><td className="db-pt-val"><span style={{color:'#3D8F5F',fontWeight:500}}>Actif</span></td></tr>
                <tr><td className="db-pt-lbl">Renouvellement</td><td className="db-pt-val">01/04/2027</td></tr>
                <tr><td className="db-pt-lbl">Requêtes / mois</td><td className="db-pt-val">500 (47 utilisées)</td></tr>
                <tr><td className="db-pt-lbl">Modules inclus</td><td className="db-pt-val">Tous les modules</td></tr>
                <tr><td className="db-pt-lbl">Tarif</td><td className="db-pt-val">490 DH HT / mois</td></tr>
              </tbody>
            </table>
            <Link href="/abonnements" className="db-btn-outline" style={{display:'inline-block',marginTop:'1.25rem',textDecoration:'none'}}>
              Gérer l'abonnement →
            </Link>
          </div>
        </div>
      )}

      {/* ══════════════ TAB : FACTURATION ══════════════ */}
      {activeTab === 'facturation' && (
        <div>
          <div className="db-table-header">
            <span className="db-table-count">Historique des factures</span>
            <button className="db-btn-outline">Télécharger tout</button>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>N° Facture</th><th>Période</th><th>Plan</th><th>Montant TTC</th><th>Statut</th><th></th></tr>
            </thead>
            <tbody>
              {[
                { num:'F-2026-003', per:'Mars 2026',    plan:'Pro', mt:'588 DH', stat:'Payée', cls:'bg' },
                { num:'F-2026-002', per:'Février 2026', plan:'Pro', mt:'588 DH', stat:'Payée', cls:'bg' },
                { num:'F-2026-001', per:'Janvier 2026', plan:'Pro', mt:'588 DH', stat:'Payée', cls:'bg' },
                { num:'F-2025-012', per:'Décembre 2025',plan:'Pro', mt:'588 DH', stat:'Payée', cls:'bg' },
              ].map(f => (
                <tr key={f.num}>
                  <td style={{fontFamily:'monospace',fontSize:12}}>{f.num}</td>
                  <td>{f.per}</td>
                  <td><span className="db-module-tag">{f.plan}</span></td>
                  <td style={{fontWeight:500}}>{f.mt}</td>
                  <td><span className={`badge ${f.cls}`}>{f.stat}</span></td>
                  <td><button className="db-row-action">PDF →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{padding:'1rem',background:'var(--gold4,#FBF5E6)',border:'1px solid var(--gold3,#F5E4B0)',marginTop:'1rem',fontSize:13,color:'var(--ink2,#3A3530)'}}>
            TVA 20% incluse · Facturation mensuelle · Paiement par virement bancaire ou carte
          </div>
        </div>
      )}
    </Layout>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS — fusion styles existants + nouveaux
// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
.db-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.25rem;flex-wrap:wrap;gap:.75rem}
.db-kicker{font-size:9px;letter-spacing:.2em;color:var(--gold,#C9A84C);margin-bottom:.25rem}
.db-title{font-family:'Cormorant Garamond',serif;font-size:clamp(22px,3vw,30px);font-weight:400;color:var(--ink,#0A0A0A);line-height:1.15}
.db-sub{font-size:12px;color:var(--inkm,#8A8078);margin-top:.3rem;max-width:600px}
.db-top-actions{display:flex;gap:.5rem;align-items:center;flex-shrink:0;flex-wrap:wrap}
.db-btn-primary{padding:8px 18px;font-size:11px;letter-spacing:.07em;background:var(--ink,#0A0A0A);color:var(--gold2,#E8C97A);border:none;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}
.db-btn-primary:hover{background:var(--gold,#C9A84C);color:var(--ink,#0A0A0A)}
.db-btn-outline{padding:7px 16px;font-size:11px;letter-spacing:.06em;color:var(--ink2,#3A3530);border:1px solid var(--border2,#D4C8A8);background:transparent;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}
.db-btn-outline:hover{border-color:var(--gold,#C9A84C);color:var(--gold,#C9A84C)}
.db-tags{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:1rem}
.db-tag{font-size:11px;padding:3px 10px;background:var(--gold4,#FBF5E6);border:1px solid var(--gold3,#F5E4B0);color:var(--ink2,#3A3530)}
.db-tag-sh{font-family:'DM Mono',monospace!important;background:var(--border,#E8DFC8);border-color:var(--border2,#D4C8A8);color:var(--ink,#0A0A0A);letter-spacing:.04em}
.dash-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1rem;margin-bottom:1.5rem}
@media(max-width:640px){.dash-grid{grid-template-columns:1fr 1fr}}
.dash-card{border:1px solid var(--border,#E8DFC8);background:var(--gold4,#FBF5E6);padding:1rem 1.25rem}
.dash-lbl{font-size:9px;letter-spacing:.14em;color:var(--inkm,#8A8078);margin-bottom:.35rem}
.dash-val{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:300;color:var(--ink,#0A0A0A);line-height:1}
.dash-sub{font-size:11px;margin-top:.3rem}
.up{color:#3D8F5F}.dn{color:#B84040}.neu{color:var(--inkm,#8A8078)}
.tabs{display:flex;border-bottom:1px solid var(--border,#E8DFC8);margin-bottom:1.5rem;gap:0;overflow-x:auto}
.tab{padding:.625rem 1.125rem;font-size:12px;letter-spacing:.05em;border:none;background:transparent;color:var(--inkm,#8A8078);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap;transition:all .15s;font-family:'DM Sans',sans-serif}
.tab.active{color:var(--ink,#0A0A0A);border-bottom-color:var(--gold,#C9A84C)}
.tab:hover:not(.active){color:var(--ink2,#3A3530)}
.data-table{width:100%;border-collapse:collapse;font-size:13px}
.data-table th{font-size:9px;letter-spacing:.12em;color:var(--inkm,#8A8078);padding:.5rem .75rem;text-align:left;border-bottom:2px solid var(--border,#E8DFC8);font-weight:500}
.data-table td{padding:.625rem .75rem;border-bottom:1px solid var(--gold4,#FBF5E6);color:var(--ink,#0A0A0A);vertical-align:middle}
.data-table tr:last-child td{border-bottom:none}
.data-table tr:hover td{background:var(--gold4,#FBF5E6)}
.badge{font-size:10px;letter-spacing:.08em;padding:3px 9px;display:inline-block}
.badge.bg{background:#E8F4EE;color:#2D6A3F}
.badge.ba{background:#FEF9ED;color:#8A5A00}
.badge.bb{background:#FAE8E8;color:#8B1A1A}
.db-card{border:1px solid var(--border,#E8DFC8);background:var(--white,#FDFCF8);padding:1.25rem;margin-bottom:1rem}
.db-card-title{font-size:9px;letter-spacing:.16em;color:var(--inkm,#8A8078);margin-bottom:1rem;padding-bottom:.5rem;border-bottom:1px solid var(--gold4,#FBF5E6);display:flex;align-items:center;gap:.75rem}
.db-score-badge{font-size:9px;letter-spacing:.1em;padding:2px 8px;margin-left:auto}
.db-row-wide{display:grid;grid-template-columns:3fr 2fr;gap:1rem;margin-bottom:1rem}
.db-row-half{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
@media(max-width:720px){.db-row-wide,.db-row-half{grid-template-columns:1fr}}
.db-pie-wrap{display:flex;align-items:center;gap:1rem;margin-top:.25rem}
.db-pie-legend{display:flex;flex-direction:column;gap:5px}
.db-leg{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--inkm,#8A8078)}
.db-leg-dot{width:9px;height:9px;border-radius:2px;flex-shrink:0}
.db-alert{display:flex;align-items:flex-start;gap:10px;padding:.5rem 0;border-bottom:1px solid var(--gold4,#FBF5E6)}
.db-alert:last-of-type{border-bottom:none}
.db-alert-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:5px}
.db-alert-body{flex:1}
.db-alert-title{font-size:12px;font-weight:500;color:var(--ink,#0A0A0A)}
.db-alert-meta{font-size:11px;color:var(--inkm,#8A8078);margin-top:2px}
.db-alert-date{font-size:10px;color:var(--inkm,#8A8078);white-space:nowrap;flex-shrink:0}
.db-link-more{display:block;font-size:11px;color:var(--gold,#C9A84C);text-decoration:none;margin-top:.875rem;padding-top:.75rem;border-top:1px solid var(--gold4,#FBF5E6)}
.db-link-more:hover{text-decoration:underline}
.db-score-global{display:flex;align-items:baseline;gap:.625rem;margin-bottom:.875rem;padding-bottom:.75rem;border-bottom:1px solid var(--gold4,#FBF5E6)}
.db-score-num{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:300;line-height:1}
.db-score-label{font-size:11px;color:var(--inkm,#8A8078)}
.db-score-row{display:flex;align-items:center;gap:.5rem;margin-bottom:.4rem}
.db-score-domain{font-size:11px;color:var(--ink2,#3A3530);width:145px;flex-shrink:0;line-height:1.3}
.db-score-bar{flex:1;height:5px;background:var(--border,#E8DFC8);border-radius:3px;overflow:hidden}
.db-score-fill{height:100%;border-radius:3px}
.db-score-val{font-size:11px;font-weight:500;color:var(--ink,#0A0A0A);width:22px;text-align:right;flex-shrink:0}
.db-insights-card{margin-bottom:0}
.db-insights-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.75rem;margin-bottom:1rem}
@media(max-width:720px){.db-insights-grid{grid-template-columns:1fr}}
.db-insight{padding:.875rem 1rem;border-left:2px solid transparent}
.db-insight-gold{background:var(--gold4,#FBF5E6);border-left-color:var(--gold,#C9A84C)}
.db-insight-amber{background:#FEF9ED;border-left-color:#BA7517}
.db-insight-red{background:#FEF0F0;border-left-color:#E85D5D}
.db-insight-head{font-size:9px;letter-spacing:.14em;color:var(--inkm,#8A8078);margin-bottom:.35rem}
.db-insight-body{font-size:12px;color:var(--ink2,#3A3530);line-height:1.6}
.db-insight-body strong{color:var(--ink,#0A0A0A)}
.db-insights-actions{display:flex;gap:.5rem;flex-wrap:wrap}
.db-ai-btn{font-size:11px;color:var(--gold,#C9A84C);text-decoration:none;border:1px solid var(--border,#E8DFC8);padding:6px 14px;transition:all .15s}
.db-ai-btn:hover{background:var(--gold4,#FBF5E6);border-color:var(--gold3,#F5E4B0)}
.db-ql-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:.625rem}
.db-ql-item{display:flex;align-items:center;gap:.5rem;padding:.625rem .875rem;border:1px solid var(--border,#E8DFC8);text-decoration:none;transition:all .15s}
.db-ql-item:hover{border-color:var(--gold,#C9A84C);background:var(--gold4,#FBF5E6)}
.db-ql-num{font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--gold,#C9A84C);font-weight:600;min-width:28px}
.db-ql-label{font-size:12px;color:var(--ink2,#3A3530)}
.db-table-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:.5rem}
.db-table-count{font-size:12px;color:var(--inkm,#8A8078)}
.db-quota-info{font-size:11px;color:var(--inkm,#8A8078)}
.db-module-tag{font-size:10px;letter-spacing:.06em;background:var(--gold4,#FBF5E6);border:1px solid var(--gold3,#F5E4B0);padding:2px 8px;color:var(--ink2,#3A3530);display:inline-block}
.db-row-action{font-size:11px;color:var(--gold,#C9A84C);background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;white-space:nowrap;padding:0}
.db-row-action:hover{text-decoration:underline}
.db-hist-row{display:flex;align-items:flex-start;gap:10px;padding:.625rem 0;border-bottom:1px solid var(--gold4,#FBF5E6)}
.db-hist-row:last-of-type{border-bottom:none}
.db-hist-icon{width:14px;height:14px;flex-shrink:0;margin-top:2px}
.db-hist-body{flex:1}
.db-hist-q{font-size:13px;color:var(--ink,#0A0A0A);line-height:1.35}
.db-hist-date{font-size:11px;color:var(--inkm,#8A8078);white-space:nowrap;margin-top:1px;flex-shrink:0}
.db-profile-table{width:100%;border-collapse:collapse;font-size:13px}
.db-pt-lbl{color:var(--inkm,#8A8078);padding:.5rem .75rem .5rem 0;width:160px;vertical-align:top;border-bottom:1px solid var(--gold4,#FBF5E6);font-size:12px}
.db-pt-val{color:var(--ink,#0A0A0A);padding:.5rem 0;border-bottom:1px solid var(--gold4,#FBF5E6)}
.db-plan-badge{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:300;color:var(--gold,#C9A84C);margin-bottom:1rem}
.db-empty-state{text-align:center;padding:2.5rem}
.db-empty-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:400;color:var(--ink,#0A0A0A);margin-bottom:.5rem}
.db-empty-sub{font-size:13px;color:var(--inkm,#8A8078);line-height:1.65;max-width:380px;margin:0 auto}
`
