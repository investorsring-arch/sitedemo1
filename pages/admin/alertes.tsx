import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

const INIT = [
  { id:1, titre:'Nouvelle circulaire ADII — Médicaments', type:'Info', cible:'Tous', statut:'Envoyée', date:'15/01/2025', destinataires:248 },
  { id:2, titre:'Mise à jour tarif douanier 2025', type:'Important', cible:'Pro & Cabinet', statut:'Envoyée', date:'01/01/2025', destinataires:116 },
  { id:3, titre:'Rappel renouvellement abonnement', type:'Facturation', cible:'Consultation', statut:'Programmée', date:'01/04/2025', destinataires:43 },
  { id:4, titre:'Nouvelles procédures ZLECAf', type:'Info', cible:'Cabinet', statut:'Brouillon', date:'—', destinataires:0 },
]

const SC: Record<string,string> = { 'Envoyée':'bg', 'Programmée':'bb', 'Brouillon':'ba' }
const TC: Record<string,string> = { 'Important':'br', 'Info':'bb', 'Facturation':'ba' }
const EMPTY = { titre:'', type:'Info', cible:'Tous', statut:'Brouillon', contenu:'' }

export default function AdminAlertes() {
  const [data, setData] = useState(INIT)
  const [modal, setModal] = useState<'new'|null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [toast, setToast] = useState('')

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000) }

  const create = () => {
    setData(d => [...d, { ...form, id:Date.now(), date:'—', destinataires:0 }])
    showToast(`✓ Alerte "${form.titre}" créée`)
    setModal(null)
  }

  return (
    <AdminLayout>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:'var(--bd)', marginBottom:4 }}>Alertes & Notifications</h1>
          <p style={{ fontSize:13, color:'var(--inkm)' }}>Notifications envoyées aux abonnés</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm({ ...EMPTY }); setModal('new') }}>+ Nouvelle alerte</button>
      </div>

      <table className="data-table">
        <thead><tr><th>Titre</th><th>Type</th><th>Cible</th><th>Statut</th><th>Date envoi</th><th>Destinataires</th><th>Actions</th></tr></thead>
        <tbody>
          {data.map(a => (
            <tr key={a.id}>
              <td style={{ fontWeight:500, fontSize:13 }}>{a.titre}</td>
              <td><span className={`badge ${TC[a.type]||'bb'}`}>{a.type}</span></td>
              <td style={{ fontSize:12 }}>{a.cible}</td>
              <td><span className={`badge ${SC[a.statut]||'ba'}`}>{a.statut}</span></td>
              <td style={{ fontSize:11, color:'var(--inkm)' }}>{a.date}</td>
              <td style={{ fontSize:12 }}>{a.destinataires > 0 ? a.destinataires.toLocaleString('fr') : '—'}</td>
              <td>
                {a.statut === 'Brouillon' && (
                  <button className="btn btn-primary btn-sm" onClick={() => {
                    setData(d => d.map(r => r.id===a.id ? { ...r, statut:'Envoyée', date:new Date().toLocaleDateString('fr-MA'), destinataires:248 } : r))
                    showToast(`✓ "${a.titre}" envoyée`)
                  }}>Envoyer</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal === 'new' && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}
          onClick={e => { if(e.target===e.currentTarget) setModal(null) }}>
          <div style={{ background:'var(--white)', width:500 }}>
            <div style={{ display:'flex', justifyContent:'space-between', padding:'1.2rem 1.5rem', borderBottom:'.5px solid var(--rule)' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:'var(--bd)' }}>Nouvelle alerte</div>
              <button style={{ background:'none', border:'none', fontSize:18, cursor:'pointer' }} onClick={() => setModal(null)}>✕</button>
            </div>
            <div style={{ padding:'1.5rem' }}>
              <div style={{ marginBottom:'1rem' }}>
                <label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>TITRE *</label>
                <input className="form-input" value={form.titre} onChange={e => setForm(f => ({ ...f, titre:e.target.value }))} placeholder="Titre de l'alerte"/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
                <div><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>TYPE</label>
                  <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type:e.target.value }))}>
                    <option>Info</option><option>Important</option><option>Facturation</option>
                  </select>
                </div>
                <div><label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>CIBLE</label>
                  <select className="form-select" value={form.cible} onChange={e => setForm(f => ({ ...f, cible:e.target.value }))}>
                    <option value="Tous">Tous les abonnés</option>
                    <option value="Pro & Cabinet">Pro & Cabinet</option>
                    <option value="Consultation">Consultation seulement</option>
                    <option value="Cabinet">Cabinet seulement</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display:'block', fontSize:11, letterSpacing:'.07em', color:'var(--inks)', marginBottom:4 }}>MESSAGE</label>
                <textarea className="form-textarea" value={form.contenu} onChange={e => setForm(f => ({ ...f, contenu:e.target.value }))} placeholder="Contenu de la notification…"/>
              </div>
            </div>
            <div style={{ padding:'1rem 1.5rem', borderTop:'.5px solid var(--rule)', display:'flex', justifyContent:'flex-end', gap:'.75rem' }}>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn btn-outline" onClick={create}>Sauvegarder brouillon</button>
              <button className="btn btn-primary" onClick={() => { setForm(f => ({ ...f, statut:'Envoyée' })); create() }}>Envoyer maintenant</button>
            </div>
          </div>
        </div>
      )}
      {toast && <div style={{ position:'fixed', bottom:'1.5rem', right:'1.5rem', background:'var(--bd)', color:'white', padding:'.7rem 1.2rem', fontSize:13, zIndex:999 }}>{toast}</div>}
    </AdminLayout>
  )
}
