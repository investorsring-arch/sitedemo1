// pages/admin/contenus.tsx
import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

const MODULES = ['Procédures Expliquées','Réglementation Simplifiée','Processus Douaniers',
  'Régimes Particuliers','Décisions de Classement','Audit Douanier','Conseil Personnalisé',
  'Douane Engineering','Contentieux & Litiges','Tableau de Bord','Analyses Stratégiques']

const INIT = [
  { id:1, module:'Procédures', titre:'Dédouanement à l\'importation', type:'Procédure', statut:'Publié', acces:'Tous', modifie:'15/03/2025', contenu:'Guide complet des étapes de dédouanement...' },
  { id:2, module:'Réglementation', titre:'Circulaire 6202/312 — Médicaments', type:'Circulaire', statut:'Publié', acces:'Tous', modifie:'15/01/2025', contenu:'Procédures spécifiques aux produits pharmaceutiques...' },
  { id:3, module:'Classement', titre:'RTC-2025-0142 — Écrans LED', type:'Décision RTC', statut:'Publié', acces:'Pro', modifie:'12/02/2025', contenu:'Classification des écrans LED pour véhicules...' },
  { id:4, module:'Analyses', titre:'Baromètre Q1 2025', type:'Rapport', statut:'Brouillon', acces:'Cabinet', modifie:'19/03/2025', contenu:'Analyse des échanges commerciaux du premier trimestre...' },
  { id:5, module:'Régimes', titre:'Admission Temporaire — Guide 2025', type:'Guide', statut:'Brouillon', acces:'Tous', modifie:'18/03/2025', contenu:'Conditions et procédures pour l\'admission temporaire...' },
]

const SC: Record<string,string> = { 'Publié':'bg','Brouillon':'ba','Archivé':'br' }
const EMPTY = { module:'Procédures Expliquées', titre:'', type:'Procédure', statut:'Brouillon', acces:'Tous', modifie:'', contenu:'' }

export default function AdminContenus() {
  const [data, setData] = useState(INIT)
  const [q, setQ] = useState('')
  const [modal, setModal] = useState<'edit'|'new'|'delete'|null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [selected, setSelected] = useState<typeof INIT[0]|null>(null)
  const [toast, setToast] = useState('')

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000) }
  const filtered = data.filter(d => [d.module, d.titre, d.type].join(' ').toLowerCase().includes(q.toLowerCase()))

  const save = () => {
    const today = new Date().toLocaleDateString('fr-MA')
    if (modal==='edit' && selected) {
      setData(d => d.map(r => r.id===selected.id ? { ...r, ...form, modifie:today } : r))
      showToast(`✓ "${form.titre}" mis à jour`)
    } else {
      setData(d => [...d, { ...form, id:Date.now(), modifie:today }])
      showToast(`✓ "${form.titre}" créé`)
    }
    setModal(null)
  }

  const inp = (f: string) => ({
    className:'form-input', value:(form as any)[f]||'',
    onChange:(e:any) => setForm(x => ({ ...x, [f]:e.target.value }))
  })

  return (
    <AdminLayout>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:'var(--bd)', marginBottom:4 }}>Contenus modules</h1>
          <p style={{ fontSize:13, color:'var(--inkm)' }}>{data.length} contenus — {data.filter(d=>d.statut==='Publié').length} publiés</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm({ ...EMPTY }); setModal('new') }}>+ Nouveau contenu</button>
      </div>

      <input className="search-input" style={{ marginBottom:'1rem' }} placeholder="Rechercher un contenu…" value={q} onChange={e => setQ(e.target.value)} />

      <table className="data-table">
        <thead><tr><th>Module</th><th>Titre</th><th>Type</th><th>Accès</th><th>Statut</th><th>Modifié</th><th>Actions</th></tr></thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r.id}>
              <td style={{ fontSize:11, color:'var(--inkm)' }}>{r.module}</td>
              <td style={{ fontSize:12, fontWeight:500 }}>{r.titre}</td>
              <td style={{ fontSize:11 }}>{r.type}</td>
              <td style={{ fontSize:11 }}>{r.acces}</td>
              <td><span className={`badge ${SC[r.statut]||'ba'}`}>{r.statut}</span></td>
              <td style={{ fontSize:11, color:'var(--inkm)' }}>{r.modifie}</td>
              <td>
                <div style={{ display:'flex', gap:4 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => { setSelected(r); setForm({ module:r.module, titre:r.titre, type:r.type, statut:r.statut, acces:r.acces, modifie:r.modifie, contenu:r.contenu }); setModal('edit') }}>Éditer</button>
                  {r.statut==='Brouillon' && <button style={{ padding:'3px 8px', fontSize:10, background:'transparent', border:'.5px solid var(--green)', color:'var(--green)', cursor:'pointer' }}
                    onClick={() => { setData(d => d.map(x => x.id===r.id ? {...x, statut:'Publié'} : x)); showToast('✓ Publié') }}>Publier</button>}
                  <button style={{ padding:'3px 8px', fontSize:10, background:'transparent', border:'.5px solid var(--red)', color:'var(--red)', cursor:'pointer', fontFamily:'inherit' }}
                    onClick={() => { setSelected(r); setModal('delete') }}>Supprimer</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}
          onClick={e => { if(e.target===e.currentTarget) setModal(null) }}>
          <div style={{ background:'var(--white)', width:560, maxHeight:'90vh', overflow:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', padding:'1.2rem 1.5rem', borderBottom:'.5px solid var(--rule)' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:'var(--bd)' }}>{modal==='edit' ? 'Modifier le contenu' : 'Nouveau contenu'}</div>
              <button style={{ background:'none', border:'none', fontSize:18, cursor:'pointer' }} onClick={() => setModal(null)}>✕</button>
            </div>
            <div style={{ padding:'1.5rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>MODULE</label>
                  <select className="form-select" value={form.module} onChange={e => setForm(f => ({ ...f, module:e.target.value }))}>
                    {MODULES.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>TYPE</label>
                  <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type:e.target.value }))}>
                    {['Procédure','Circulaire','Décision RTC','Guide','Rapport','Check-list','Note'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginTop:'1rem' }}><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>TITRE *</label><input {...inp('titre')}/></div>
              <div style={{ marginTop:'1rem' }}><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>CONTENU</label>
                <textarea className="form-textarea" style={{ minHeight:120 }} value={form.contenu} onChange={e => setForm(f => ({ ...f, contenu:e.target.value }))} placeholder="Rédigez ici. Markdown supporté."/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginTop:'1rem' }}>
                <div><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>STATUT</label>
                  <select className="form-select" value={form.statut} onChange={e => setForm(f => ({ ...f, statut:e.target.value }))}>
                    <option>Brouillon</option><option>Publié</option><option>Archivé</option>
                  </select>
                </div>
                <div><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>ACCÈS</label>
                  <select className="form-select" value={form.acces} onChange={e => setForm(f => ({ ...f, acces:e.target.value }))}>
                    <option value="Tous">Tous les plans</option><option value="Pro">Pro & Cabinet</option><option value="Cabinet">Cabinet uniquement</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ padding:'1rem 1.5rem', borderTop:'.5px solid var(--rule)', display:'flex', justifyContent:'flex-end', gap:'.75rem' }}>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn btn-primary" onClick={save}>Sauvegarder</button>
            </div>
          </div>
        </div>
      )}
      {/* ── MODAL SUPPRESSION ── */}
      {modal === 'delete' && selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}
          onClick={e => { if(e.target===e.currentTarget) setModal(null) }}>
          <div style={{ background:'var(--white)', width:420, padding:'2rem' }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:'var(--bd)', marginBottom:'.75rem' }}>Supprimer le contenu ?</div>
            <p style={{ fontSize:13, color:'var(--inkm)', lineHeight:1.6, marginBottom:'1.5rem' }}>
              <strong>"{selected.titre}"</strong> sera définitivement supprimé.
            </p>
            <div style={{ display:'flex', justifyContent:'flex-end', gap:'.75rem' }}>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn btn-danger" onClick={() => { setData(d => d.filter(r => r.id !== selected.id)); showToast(`"${selected.titre}" supprimé`); setModal(null) }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={{ position:'fixed', bottom:'1.5rem', right:'1.5rem', background:'var(--bd)', color:'white', padding:'.7rem 1.2rem', fontSize:13, zIndex:999 }}>{toast}</div>}
    </AdminLayout>
  )
}
