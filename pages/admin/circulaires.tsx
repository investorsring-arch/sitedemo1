import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

interface Circ {
  id: number; ref: string; objet: string; date: string
  type: string; statut: string; acces: string
}

const MOCK: Circ[] = [
  { id:1, ref:'Circ. 6202/312', objet:'Procédures de dédouanement des médicaments', date:'15/01/2025', type:'Circulaire', statut:'Publié', acces:'Tous' },
  { id:2, ref:'Note 2025/18', objet:'Taux de change douanier — T1 2025', date:'02/01/2025', type:'Note', statut:'Publié', acces:'Tous' },
  { id:3, ref:'Loi 2-22-724', objet:'Code des douanes — amendements 2022', date:'01/12/2022', type:'Loi', statut:'Publié', acces:'Tous' },
  { id:4, ref:'Circ. 6180/295', objet:'Régime de l\'admission temporaire pour perfectionnement actif', date:'10/09/2024', type:'Circulaire', statut:'Publié', acces:'Pro' },
  { id:5, ref:'Décret 2-23-441', objet:'Tarif douanier 2024 — mises à jour SH 2022', date:'01/01/2024', type:'Décret', statut:'Publié', acces:'Tous' },
  { id:6, ref:'Note 2025/22', objet:'Procédures ZLECAf — phase 2', date:'01/03/2025', type:'Note', statut:'Brouillon', acces:'Pro' },
]

const EMPTY = { ref:'', objet:'', date:'', type:'Circulaire', statut:'Brouillon', acces:'Tous' }

export default function AdminCirculaires() {
  const [data, setData] = useState<Circ[]>(MOCK)
  const [q, setQ] = useState('')
  const [modal, setModal] = useState<'edit'|'new'|'delete'|null>(null)
  const [selected, setSelected] = useState<Circ|null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [toast, setToast] = useState('')

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000) }
  const filtered = data.filter(d => d.ref.toLowerCase().includes(q.toLowerCase()) || d.objet.toLowerCase().includes(q.toLowerCase()))

  const save = () => {
    if (modal === 'edit' && selected) {
      setData(d => d.map(r => r.id === selected.id ? { ...r, ...form } : r))
      showToast(`✓ ${form.ref} mis à jour`)
    } else {
      setData(d => [...d, { ...form, id: Date.now() }])
      showToast(`✓ ${form.ref} ajouté`)
    }
    setModal(null)
  }

  const inp = (f: string) => ({
    className: 'form-input',
    value: (form as any)[f] || '',
    onChange: (e: any) => setForm(x => ({ ...x, [f]: e.target.value }))
  })

  const badge: Record<string, string> = {
    'Publié':'bg', 'Brouillon':'ba', 'Archivé':'br',
    'Circulaire':'bb', 'Note':'ba', 'Loi':'br', 'Décret':'br'
  }

  return (
    <AdminLayout>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:'var(--bd)', marginBottom:4 }}>Circulaires ADII</h1>
          <p style={{ fontSize:13, color:'var(--inkm)' }}>{data.length} circulaires et textes réglementaires</p>
        </div>
        <div style={{ display:'flex', gap:'.75rem' }}>
          <button className="btn btn-outline btn-sm" onClick={() => showToast('Synchronisation ADII lancée…')}>↻ Sync ADII</button>
          <button className="btn btn-primary" onClick={() => { setForm({ ...EMPTY }); setModal('new') }}>+ Nouvelle circulaire</button>
        </div>
      </div>

      <div style={{ marginBottom:'1rem' }}>
        <input className="search-input" placeholder="Rechercher une circulaire…" value={q} onChange={e => setQ(e.target.value)} />
      </div>

      <table className="data-table">
        <thead><tr><th>Référence</th><th>Objet</th><th>Date</th><th>Type</th><th>Accès</th><th>Statut</th><th>Actions</th></tr></thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r.id}>
              <td style={{ fontWeight:500, fontSize:12 }}>{r.ref}</td>
              <td style={{ fontSize:12 }}>{r.objet}</td>
              <td style={{ fontSize:11, color:'var(--inkm)' }}>{r.date}</td>
              <td><span className={`badge ${badge[r.type]||'bb'}`}>{r.type}</span></td>
              <td style={{ fontSize:11 }}>{r.acces}</td>
              <td><span className={`badge ${badge[r.statut]||'ba'}`}>{r.statut}</span></td>
              <td>
                <div style={{ display:'flex', gap:4 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => { setSelected(r); setForm({ ref:r.ref, objet:r.objet, date:r.date, type:r.type, statut:r.statut, acces:r.acces }); setModal('edit') }}>Éditer</button>
                  <button style={{ padding:'3px 8px', fontSize:11, background:'transparent', border:'.5px solid var(--red)', color:'var(--red)', cursor:'pointer' }}
                    onClick={() => { setSelected(r); setModal('delete') }}>✕</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL EDIT/NEW */}
      {(modal==='edit'||modal==='new') && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}
          onClick={e => { if(e.target===e.currentTarget) setModal(null) }}>
          <div style={{ background:'var(--white)', width:520 }}>
            <div style={{ display:'flex', justifyContent:'space-between', padding:'1.2rem 1.5rem', borderBottom:'.5px solid var(--rule)' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:'var(--bd)' }}>
                {modal==='edit' ? 'Modifier la circulaire' : 'Nouvelle circulaire'}
              </div>
              <button style={{ background:'none', border:'none', fontSize:18, cursor:'pointer', color:'var(--inkm)' }} onClick={() => setModal(null)}>✕</button>
            </div>
            <div style={{ padding:'1.5rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>RÉFÉRENCE *</label><input {...inp('ref')} placeholder="ex: Circ. 6202/312"/></div>
                <div><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>DATE</label><input {...inp('date')} placeholder="JJ/MM/AAAA"/></div>
              </div>
              <div style={{ marginTop:'1rem' }}><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>OBJET *</label><input {...inp('objet')} placeholder="Description de la circulaire"/></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem', marginTop:'1rem' }}>
                <div><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>TYPE</label>
                  <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type:e.target.value }))}>
                    <option>Circulaire</option><option>Note</option><option>Loi</option><option>Décret</option>
                  </select>
                </div>
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

      {modal==='delete' && selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'var(--white)', width:400, padding:'1.5rem' }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:'var(--bd)', marginBottom:'1rem' }}>Supprimer la circulaire ?</div>
            <p style={{ fontSize:13, color:'var(--inks)', marginBottom:'1.5rem' }}>{selected.ref} — {selected.objet}</p>
            <div style={{ display:'flex', justifyContent:'flex-end', gap:'.75rem' }}>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn btn-danger" onClick={() => { setData(d => d.filter(r => r.id !== selected.id)); showToast(`✓ ${selected.ref} supprimé`); setModal(null) }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={{ position:'fixed', bottom:'1.5rem', right:'1.5rem', background:'var(--bd)', color:'white', padding:'.7rem 1.2rem', fontSize:13, zIndex:999 }}>{toast}</div>}
    </AdminLayout>
  )
}
