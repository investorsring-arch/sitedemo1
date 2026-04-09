// pages/admin/abonnements.tsx — CRUD complet (Ajouter / Modifier / Supprimer)
import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

interface Abo {
  id: number; nom: string; email: string; plan: string
  montant: string; debut: string; renouvellement: string
  paiement: string; statut: string
}

const INIT: Abo[] = [
  { id:1, nom:'Karim Benali',         email:'k.benali@transitaire.ma',   plan:'Professionnel', montant:'1 990',  debut:'15/01/2025', renouvellement:'15/04/2025', paiement:'Banque Populaire', statut:'Actif'  },
  { id:2, nom:'Fatima Zahra Idrissi', email:'fz.idrissi@cabinet-fzi.ma', plan:'Cabinet',       montant:'4 990',  debut:'02/02/2025', renouvellement:'02/05/2025', paiement:'Virement',          statut:'Actif'  },
  { id:3, nom:'Mohammed Tazi',        email:'m.tazi@importexport.ma',    plan:'Consultation',  montant:'799',    debut:'10/02/2025', renouvellement:'10/04/2025', paiement:'Banque Populaire', statut:'Actif'  },
  { id:4, nom:'Sara Chaoui',          email:'s.chaoui@logima.ma',        plan:'Professionnel', montant:'0',      debut:'19/03/2025', renouvellement:'02/04/2025', paiement:'—',                 statut:'Essai'  },
  { id:5, nom:'Youssef Alami',        email:'y.alami@freelance.ma',      plan:'Consultation',  montant:'799',    debut:'05/12/2024', renouvellement:'—',          paiement:'Banque Populaire', statut:'Impayé' },
]

const EMPTY: Omit<Abo,'id'> = { nom:'', email:'', plan:'Consultation', montant:'799', debut:'', renouvellement:'', paiement:'', statut:'Actif' }

const SC: Record<string,string> = { 'Actif':'bg', 'Essai':'ba', 'Impayé':'br' }
const PLANS = ['Consultation','Professionnel','Cabinet']
const STATUTS = ['Actif','Essai','Impayé','Suspendu']
const PAIEMENTS = ['Banque Populaire','Virement','Carte bancaire','—']

export default function AdminAbonnements() {
  const [data, setData] = useState<Abo[]>(INIT)
  const [q, setQ] = useState('')
  const [modal, setModal] = useState<'edit'|'new'|'delete'|null>(null)
  const [selected, setSelected] = useState<Abo|null>(null)
  const [form, setForm] = useState<Omit<Abo,'id'>>({ ...EMPTY })
  const [toast, setToast] = useState('')

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000) }

  const filtered = data.filter(a =>
    [a.nom, a.email, a.plan, a.statut].join(' ').toLowerCase().includes(q.toLowerCase())
  )

  const mrr = data
    .filter(a => a.statut === 'Actif')
    .reduce((s, a) => s + (parseInt(a.montant.replace(/\s/g, '')) || 0), 0)

  const openNew  = () => { setForm({ ...EMPTY }); setSelected(null); setModal('new') }
  const openEdit = (a: Abo) => {
    setSelected(a)
    setForm({ nom:a.nom, email:a.email, plan:a.plan, montant:a.montant, debut:a.debut, renouvellement:a.renouvellement, paiement:a.paiement, statut:a.statut })
    setModal('edit')
  }
  const openDel  = (a: Abo) => { setSelected(a); setModal('delete') }

  const save = () => {
    if (!form.nom.trim()) { showToast('Le nom est obligatoire'); return }
    if (modal === 'edit' && selected) {
      setData(d => d.map(r => r.id === selected.id ? { ...r, ...form } : r))
      showToast(`✓ Abonnement de ${form.nom} mis à jour`)
    } else {
      setData(d => [...d, { ...form, id: Date.now() }])
      showToast(`✓ Abonnement de ${form.nom} ajouté`)
    }
    setModal(null)
  }

  const supprimer = () => {
    if (!selected) return
    setData(d => d.filter(r => r.id !== selected.id))
    showToast(`Abonnement de ${selected.nom} supprimé`)
    setModal(null)
  }

  const inp = (f: keyof typeof form) => ({
    className: 'form-input',
    value: (form as any)[f] || '',
    onChange: (e: any) => setForm(x => ({ ...x, [f]: e.target.value })),
  })

  return (
    <AdminLayout>
      {/* ── HEADER ── */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:'var(--bd)', marginBottom:4 }}>Abonnements</h1>
          <p style={{ fontSize:13, color:'var(--inkm)' }}>
            MRR estimé : <strong>{mrr.toLocaleString('fr')} DH</strong> · {data.filter(a=>a.statut==='Actif').length} actifs sur {data.length}
          </p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Ajouter un abonnement</button>
      </div>

      {/* ── STATS ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        {PLANS.map(plan => {
          const rev: Record<string,number> = { Consultation:799, Professionnel:1990, Cabinet:4990 }
          const count = data.filter(a => a.plan === plan && a.statut === 'Actif').length
          return (
            <div key={plan} style={{ background:'var(--bl)', padding:'1rem', textAlign:'center' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:'var(--bd)' }}>{count}</div>
              <div style={{ fontSize:11, color:'var(--inkm)', marginTop:4 }}>{plan} ({rev[plan].toLocaleString('fr')} DH)</div>
            </div>
          )
        })}
      </div>

      {/* ── RECHERCHE ── */}
      <input className="search-input" style={{ marginBottom:'1rem' }} placeholder="Rechercher par nom, email, plan ou statut…" value={q} onChange={e => setQ(e.target.value)} />

      {/* ── TABLE ── */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Utilisateur</th><th>Email</th><th>Plan</th><th>Montant / mois</th>
            <th>Début</th><th>Renouvellement</th><th>Paiement</th><th>Statut</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(a => (
            <tr key={a.id}>
              <td style={{ fontWeight:500, fontSize:13 }}>{a.nom}</td>
              <td style={{ fontSize:11, color:'var(--inks)', fontFamily:'monospace' }}>{a.email}</td>
              <td style={{ fontSize:12 }}>{a.plan}</td>
              <td style={{ fontSize:12, fontFamily:'monospace', fontWeight:600 }}>
                {parseInt(a.montant.replace(/\s/g,'')) > 0 ? `${parseInt(a.montant.replace(/\s/g,'')).toLocaleString('fr')} DH` : '—'}
              </td>
              <td style={{ fontSize:11, color:'var(--inkm)' }}>{a.debut}</td>
              <td style={{ fontSize:11, color:'var(--inkm)' }}>{a.renouvellement}</td>
              <td style={{ fontSize:11 }}>{a.paiement}</td>
              <td><span className={`badge ${SC[a.statut]||'ba'}`}>{a.statut}</span></td>
              <td>
                <div style={{ display:'flex', gap:4 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(a)}>Modifier</button>
                  <button
                    style={{ padding:'3px 8px', fontSize:10, background:'transparent', border:'.5px solid var(--red)', color:'var(--red)', cursor:'pointer', fontFamily:'inherit' }}
                    onClick={() => openDel(a)}>
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── MODAL NOUVEAU / ÉDITION ── */}
      {(modal === 'new' || modal === 'edit') && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}
          onClick={e => { if(e.target===e.currentTarget) setModal(null) }}>
          <div style={{ background:'var(--white)', width:560, maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', padding:'1.2rem 1.5rem', borderBottom:'.5px solid var(--rule)', position:'sticky', top:0, background:'var(--white)', zIndex:1 }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:'var(--bd)' }}>
                {modal === 'edit' ? `Modifier — ${selected?.nom}` : 'Nouvel abonnement'}
              </div>
              <button style={{ background:'none', border:'none', fontSize:18, cursor:'pointer' }} onClick={() => setModal(null)}>✕</button>
            </div>
            <div style={{ padding:'1.5rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
                <div><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>NOM COMPLET *</label><input {...inp('nom')} /></div>
                <div><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>EMAIL</label><input {...inp('email')} type="email" /></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
                <div>
                  <label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>PLAN</label>
                  <select className="form-select" value={form.plan} onChange={e => setForm(f => ({ ...f, plan:e.target.value }))}>
                    {PLANS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>MONTANT (DH/mois)</label><input {...inp('montant')} type="text" placeholder="Ex : 1990" /></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
                <div><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>DATE DE DÉBUT</label><input {...inp('debut')} placeholder="JJ/MM/AAAA" /></div>
                <div><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>RENOUVELLEMENT</label><input {...inp('renouvellement')} placeholder="JJ/MM/AAAA" /></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div>
                  <label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>MODE DE PAIEMENT</label>
                  <select className="form-select" value={form.paiement} onChange={e => setForm(f => ({ ...f, paiement:e.target.value }))}>
                    {PAIEMENTS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>STATUT</label>
                  <select className="form-select" value={form.statut} onChange={e => setForm(f => ({ ...f, statut:e.target.value }))}>
                    {STATUTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div style={{ padding:'1rem 1.5rem', borderTop:'.5px solid var(--rule)', display:'flex', justifyContent:'flex-end', gap:'.75rem', position:'sticky', bottom:0, background:'var(--white)' }}>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn btn-primary" onClick={save}>{modal === 'edit' ? 'Enregistrer' : 'Ajouter'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL SUPPRESSION ── */}
      {modal === 'delete' && selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}
          onClick={e => { if(e.target===e.currentTarget) setModal(null) }}>
          <div style={{ background:'var(--white)', width:400, padding:'2rem' }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:'var(--bd)', marginBottom:'.75rem' }}>Supprimer l'abonnement ?</div>
            <p style={{ fontSize:13, color:'var(--inkm)', lineHeight:1.6, marginBottom:'1.5rem' }}>
              L'abonnement de <strong>{selected.nom}</strong> ({selected.plan}) sera définitivement supprimé.
            </p>
            <div style={{ display:'flex', justifyContent:'flex-end', gap:'.75rem' }}>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn btn-danger" onClick={supprimer}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={{ position:'fixed', bottom:'1.5rem', right:'1.5rem', background:'var(--bd)', color:'white', padding:'.7rem 1.2rem', fontSize:13, zIndex:999 }}>{toast}</div>}
    </AdminLayout>
  )
}
