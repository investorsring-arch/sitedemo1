import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import BackofficeLayout from '../../components/BackofficeLayout'

interface Circulaire {
  id: number
  numero: string
  titre: string
  date: string
  categorie: string
  statut: 'indexee' | 'en_attente' | 'erreur'
  chunks: number
  source: string
}

const CIRCULAIRES: Circulaire[] = [
  { id:1,  numero:'5801/2026', titre:'Procédures simplifiées pour les opérateurs économiques agréés',  date:'01/04/2026', categorie:'OEA',             statut:'indexee',    chunks:24, source:'ADII' },
  { id:2,  numero:'5799/2026', titre:'Mise à jour des droits applicables aux produits agroalimentaires',date:'28/03/2026', categorie:'Tarifs',          statut:'indexee',    chunks:31, source:'ADII' },
  { id:3,  numero:'5796/2026', titre:'Modalités de dédouanement des envois express',                   date:'20/03/2026', categorie:'Express / e-com', statut:'indexee',    chunks:18, source:'ADII' },
  { id:4,  numero:'5790/2026', titre:'Régime de l\'admission temporaire — nouvelles conditions',        date:'15/03/2026', categorie:'Régimes éco.',    statut:'en_attente', chunks:0,  source:'ADII' },
  { id:5,  numero:'5785/2026', titre:'Instructions relatives au transit douanier international',        date:'10/03/2026', categorie:'Transit',         statut:'indexee',    chunks:42, source:'ADII' },
  { id:6,  numero:'5780/2026', titre:'Contrôle de conformité des marchandises importées de Chine',     date:'03/03/2026', categorie:'Contrôle',        statut:'indexee',    chunks:27, source:'ADII' },
  { id:7,  numero:'5775/2026', titre:'Nouvelle nomenclature des positions tarifaires 2026',            date:'25/02/2026', categorie:'Nomenclature',    statut:'erreur',     chunks:0,  source:'ADII' },
  { id:8,  numero:'5770/2026', titre:'Procédure de mainlevée d\'urgence pour denrées périssables',     date:'18/02/2026', categorie:'Procédures',      statut:'indexee',    chunks:15, source:'ADII' },
  { id:9,  numero:'5765/2026', titre:'Accords ALECA — mise à jour des règles d\'origine',              date:'10/02/2026', categorie:'ALECA / Origine', statut:'indexee',    chunks:38, source:'ADII' },
  { id:10, numero:'5760/2026', titre:'Gestion des garanties et cautionnements douaniers',              date:'02/02/2026', categorie:'Garanties',       statut:'indexee',    chunks:22, source:'ADII' },
]

const STATUT_C = {
  indexee:    { bg:'#E6F7EE', color:'#1A7A40', label:'Indexée RAG' },
  en_attente: { bg:'#FEF5E4', color:'#8A5A10', label:'En attente' },
  erreur:     { bg:'#FEE8E8', color:'#C0392B', label:'Erreur' },
}

export default function BackofficeCirulaires() {
  const router = useRouter()
  const [auth, setAuth] = useState(false)
  const [q, setQ] = useState('')
  const [filtre, setFiltre] = useState<Circulaire['statut'] | 'all'>('all')
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('bo_auth') !== '1') { router.replace('/backoffice'); return }
      setAuth(true)
    }
  }, [])

  if (!auth) return null

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000) }

  const filtered = CIRCULAIRES.filter(c => {
    const matchQ = [c.numero, c.titre, c.categorie].join(' ').toLowerCase().includes(q.toLowerCase())
    const matchF = filtre === 'all' || c.statut === filtre
    return matchQ && matchF
  })

  return (
    <BackofficeLayout title="Circulaires ADII">

      {toast && (
        <div style={{ position:'fixed', bottom:24, right:24, background:'#059669', color:'white', padding:'10px 20px', fontSize:12, zIndex:999 }}>
          {toast}
        </div>
      )}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:'var(--bd)', marginBottom:4 }}>Circulaires ADII</h1>
          <p style={{ fontSize:13, color:'var(--inkm)' }}>{CIRCULAIRES.length} circulaires · {CIRCULAIRES.filter(c => c.statut === 'indexee').length} indexées dans le RAG</p>
        </div>
        <button onClick={() => router.push('/backoffice/ingest')}
          style={{ padding:'8px 18px', background:'#C9A84C', color:'#0A0A0A', border:'none', fontSize:12, cursor:'pointer', fontFamily:'inherit', fontWeight:600 }}>
          ⬆ Ingérer de nouvelles circulaires
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'.75rem', marginBottom:'1.5rem' }}>
        {[
          { label:'Indexées RAG', value: CIRCULAIRES.filter(c=>c.statut==='indexee').length, color:'#059669' },
          { label:'En attente',   value: CIRCULAIRES.filter(c=>c.statut==='en_attente').length, color:'#D97706' },
          { label:'En erreur',    value: CIRCULAIRES.filter(c=>c.statut==='erreur').length, color:'#DC2626' },
        ].map(s => (
          <div key={s.label} style={{ background:'var(--white)', border:'.5px solid var(--rule)', borderTop:`3px solid ${s.color}`, padding:'1rem' }}>
            <div style={{ fontSize:10, letterSpacing:'.06em', color:'var(--inkm)', marginBottom:4 }}>{s.label.toUpperCase()}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, color:'var(--bd)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div style={{ display:'flex', gap:'1rem', marginBottom:'1rem', flexWrap:'wrap' }}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher numéro ou titre…"
          style={{ flex:1, minWidth:200, padding:'8px 12px', border:'.5px solid var(--rule)', background:'var(--white)', fontSize:12, color:'var(--bd)', outline:'none', fontFamily:'inherit' }}
        />
        {(['all','indexee','en_attente','erreur'] as const).map(f => (
          <button key={f} onClick={() => setFiltre(f)} style={{
            padding:'6px 14px', fontSize:11, border:'.5px solid var(--rule)', cursor:'pointer', fontFamily:'inherit',
            background: filtre === f ? '#0C2D5C' : 'var(--white)', color: filtre === f ? 'white' : 'var(--inkm)',
          }}>
            {f === 'all' ? 'Toutes' : STATUT_C[f].label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background:'var(--white)', border:'.5px solid var(--rule)', overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead>
            <tr style={{ borderBottom:'.5px solid var(--rule)' }}>
              {['N° CIRCULAIRE','TITRE','DATE','CATÉGORIE','STATUT','CHUNKS',''].map(h => (
                <th key={h} style={{ padding:'.5rem .75rem', textAlign:'left', fontSize:10, letterSpacing:'.06em', color:'var(--inkm)', fontWeight:600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => {
              const s = STATUT_C[c.statut]
              return (
                <tr key={c.id} style={{ borderBottom:'.5px solid var(--rule)' }}>
                  <td style={{ padding:'.5rem .75rem', fontFamily:'monospace', fontSize:11, color:'var(--ba)', fontWeight:600 }}>{c.numero}</td>
                  <td style={{ padding:'.5rem .75rem', color:'var(--inks)', maxWidth:320, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.titre}</td>
                  <td style={{ padding:'.5rem .75rem', color:'var(--inkm)', whiteSpace:'nowrap' }}>{c.date}</td>
                  <td style={{ padding:'.5rem .75rem', color:'var(--inkm)' }}>{c.categorie}</td>
                  <td style={{ padding:'.5rem .75rem' }}>
                    <span style={{ fontSize:10, padding:'2px 8px', background:s.bg, color:s.color, fontWeight:600 }}>{s.label}</span>
                  </td>
                  <td style={{ padding:'.5rem .75rem', color:'var(--inkm)', fontFamily:'monospace' }}>{c.chunks > 0 ? c.chunks : '–'}</td>
                  <td style={{ padding:'.5rem .75rem' }}>
                    {c.statut === 'erreur' || c.statut === 'en_attente' ? (
                      <button onClick={() => showToast(`Re-ingestion de la circulaire ${c.numero} lancée`)}
                        style={{ fontSize:10, padding:'2px 10px', background:'#C9A84C', color:'#0A0A0A', border:'none', cursor:'pointer', fontFamily:'inherit', fontWeight:600 }}>
                        ↺ Ré-ingérer
                      </button>
                    ) : (
                      <span style={{ fontSize:10, color:'var(--inkm)' }}>{c.chunks} chunks</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </BackofficeLayout>
  )
}
