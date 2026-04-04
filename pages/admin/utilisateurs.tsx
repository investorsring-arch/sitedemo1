import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

const USERS = [
  { id:1, nom:'Karim Benali', email:'k.benali@transitaire.ma', societe:'ATLAS TRANSIT SARL', plan:'Professionnel', statut:'Actif', inscrit:'15/01/2025', tel:'+212 6 12 34 56 78' },
  { id:2, nom:'Fatima Zahra Idrissi', email:'fz.idrissi@cabinet-fzi.ma', societe:'Cabinet FZI Douane', plan:'Cabinet', statut:'Actif', inscrit:'02/02/2025', tel:'+212 6 98 76 54 32' },
  { id:3, nom:'Mohammed Tazi', email:'m.tazi@importexport.ma', societe:'TAZI IMPORT EXPORT', plan:'Consultation', statut:'Actif', inscrit:'10/02/2025', tel:'+212 5 22 12 34 56' },
  { id:4, nom:'Sara Chaoui', email:'s.chaoui@logima.ma', societe:'LOGIMA TRANSPORT', plan:'Professionnel', statut:'Essai', inscrit:'19/03/2025', tel:'+212 6 55 44 33 22' },
  { id:5, nom:'Youssef Alami', email:'y.alami@freelance.ma', societe:'Indépendant', plan:'Consultation', statut:'Suspendu', inscrit:'05/12/2024', tel:'+212 6 11 22 33 44' },
]

const PLAN_COLORS: Record<string,string> = { 'Cabinet':'br', 'Professionnel':'bb', 'Consultation':'ba' }
const STAT_COLORS: Record<string,string> = { 'Actif':'bg', 'Essai':'ba', 'Suspendu':'br' }

export default function AdminUtilisateurs() {
  const [users, setUsers] = useState(USERS)
  const [q, setQ] = useState('')
  const [modal, setModal] = useState<'edit'|'new'|null>(null)
  const [form, setForm] = useState({ nom:'', email:'', societe:'', plan:'Consultation', statut:'Actif', tel:'', inscrit:'' })
  const [selected, setSelected] = useState<typeof USERS[0]|null>(null)
  const [toast, setToast] = useState('')

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000) }
  const filtered = users.filter(u => [u.nom, u.email, u.societe].join(' ').toLowerCase().includes(q.toLowerCase()))

  const save = () => {
    if (modal === 'edit' && selected) {
      setUsers(u => u.map(r => r.id === selected.id ? { ...r, ...form } : r))
      showToast(`✓ ${form.nom} mis à jour`)
    } else {
      setUsers(u => [...u, { ...form, id: Date.now(), inscrit: new Date().toLocaleDateString('fr-MA') }])
      showToast(`✓ ${form.nom} ajouté`)
    }
    setModal(null)
  }

  const inp = (f: string) => ({
    className: 'form-input',
    value: (form as any)[f] || '',
    onChange: (e: any) => setForm(x => ({ ...x, [f]: e.target.value }))
  })

  return (
    <AdminLayout>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:'var(--bd)', marginBottom:4 }}>Utilisateurs</h1>
          <p style={{ fontSize:13, color:'var(--inkm)' }}>{users.length} comptes enregistrés</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm({ nom:'', email:'', societe:'', plan:'Consultation', statut:'Essai', tel:'', inscrit:'' }); setModal('new') }}>
          + Ajouter utilisateur
        </button>
      </div>

      <input className="search-input" style={{ marginBottom:'1rem' }} placeholder="Rechercher un utilisateur…" value={q} onChange={e => setQ(e.target.value)} />

      <table className="data-table">
        <thead><tr><th>Nom</th><th>Email</th><th>Société</th><th>Plan</th><th>Statut</th><th>Inscrit le</th><th>Actions</th></tr></thead>
        <tbody>
          {filtered.map(u => (
            <tr key={u.id}>
              <td style={{ fontWeight:500, fontSize:13 }}>{u.nom}</td>
              <td style={{ fontSize:12, color:'var(--inks)' }}>{u.email}</td>
              <td style={{ fontSize:12 }}>{u.societe}</td>
              <td><span className={`badge ${PLAN_COLORS[u.plan]||'bb'}`}>{u.plan}</span></td>
              <td><span className={`badge ${STAT_COLORS[u.statut]||'ba'}`}>{u.statut}</span></td>
              <td style={{ fontSize:11, color:'var(--inkm)' }}>{u.inscrit}</td>
              <td>
                <div style={{ display:'flex', gap:4 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => {
                    setSelected(u)
                    setForm({ nom:u.nom, email:u.email, societe:u.societe, plan:u.plan, statut:u.statut, tel:u.tel, inscrit:u.inscrit })
                    setModal('edit')
                  }}>Gérer</button>
                  {u.statut !== 'Suspendu'
                    ? <button style={{ padding:'3px 8px', fontSize:10, background:'transparent', border:'.5px solid var(--amber)', color:'var(--amber)', cursor:'pointer' }}
                        onClick={() => { setUsers(us => us.map(r => r.id===u.id ? {...r, statut:'Suspendu'} : r)); showToast(`${u.nom} suspendu`) }}>Suspendre</button>
                    : <button style={{ padding:'3px 8px', fontSize:10, background:'transparent', border:'.5px solid var(--green)', color:'var(--green)', cursor:'pointer' }}
                        onClick={() => { setUsers(us => us.map(r => r.id===u.id ? {...r, statut:'Actif'} : r)); showToast(`${u.nom} réactivé`) }}>Réactiver</button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}
          onClick={e => { if(e.target===e.currentTarget) setModal(null) }}>
          <div style={{ background:'var(--white)', width:520 }}>
            <div style={{ display:'flex', justifyContent:'space-between', padding:'1.2rem 1.5rem', borderBottom:'.5px solid var(--rule)' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:'var(--bd)' }}>
                {modal==='edit' ? 'Gérer l\'utilisateur' : 'Ajouter un utilisateur'}
              </div>
              <button style={{ background:'none', border:'none', fontSize:18, cursor:'pointer', color:'var(--inkm)' }} onClick={() => setModal(null)}>✕</button>
            </div>
            <div style={{ padding:'1.5rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>NOM COMPLET</label><input {...inp('nom')}/></div>
                <div><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>EMAIL</label><input {...inp('email')} type="email"/></div>
                <div><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>SOCIÉTÉ</label><input {...inp('societe')}/></div>
                <div><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>TÉLÉPHONE</label><input {...inp('tel')}/></div>
                <div><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>PLAN</label>
                  <select className="form-select" value={form.plan} onChange={e => setForm(f => ({ ...f, plan:e.target.value }))}>
                    <option>Consultation</option><option>Professionnel</option><option>Cabinet</option>
                  </select>
                </div>
                <div><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>STATUT</label>
                  <select className="form-select" value={form.statut} onChange={e => setForm(f => ({ ...f, statut:e.target.value }))}>
                    <option>Actif</option><option>Essai</option><option>Suspendu</option>
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
      {toast && <div style={{ position:'fixed', bottom:'1.5rem', right:'1.5rem', background:'var(--bd)', color:'white', padding:'.7rem 1.2rem', fontSize:13, zIndex:999 }}>{toast}</div>}
    </AdminLayout>
  )
}
