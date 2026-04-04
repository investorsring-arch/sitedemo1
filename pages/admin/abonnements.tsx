// pages/admin/abonnements.tsx
import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

const ABOS = [
  { id:1, nom:'Karim Benali', plan:'Professionnel', montant:'1 990 DH', debut:'15/01/2025', renouvellement:'15/04/2025', paiement:'Banque Populaire', statut:'Actif' },
  { id:2, nom:'Fatima Zahra Idrissi', plan:'Cabinet', montant:'4 990 DH', debut:'02/02/2025', renouvellement:'02/05/2025', paiement:'Virement', statut:'Actif' },
  { id:3, nom:'Mohammed Tazi', plan:'Consultation', montant:'799 DH', debut:'10/02/2025', renouvellement:'10/04/2025', paiement:'Banque Populaire', statut:'Actif' },
  { id:4, nom:'Sara Chaoui', plan:'Professionnel', montant:'0 DH', debut:'19/03/2025', renouvellement:'02/04/2025', paiement:'—', statut:'Essai' },
  { id:5, nom:'Youssef Alami', plan:'Consultation', montant:'799 DH', debut:'05/12/2024', renouvellement:'—', paiement:'Banque Populaire', statut:'Impayé' },
]

const SC: Record<string,string> = { 'Actif':'bg', 'Essai':'ba', 'Impayé':'br' }

export default function AdminAbonnements() {
  const [q, setQ] = useState('')
  const filtered = ABOS.filter(a => [a.nom, a.plan, a.statut].join(' ').toLowerCase().includes(q.toLowerCase()))
  const mrr = ABOS.filter(a => a.statut==='Actif').reduce((s, a) => s + parseInt(a.montant.replace(/[^0-9]/g,'')||'0'), 0)

  return (
    <AdminLayout>
      <div style={{ marginBottom:'1.5rem' }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:'var(--bd)', marginBottom:4 }}>Abonnements</h1>
        <p style={{ fontSize:13, color:'var(--inkm)' }}>MRR estimé : <strong>{mrr.toLocaleString('fr')} DH</strong></p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        {[['Consultation (799 DH)', ABOS.filter(a=>a.plan==='Consultation').length],
          ['Professionnel (1 990 DH)', ABOS.filter(a=>a.plan==='Professionnel').length],
          ['Cabinet (4 990 DH)', ABOS.filter(a=>a.plan==='Cabinet').length]
        ].map(([l,v]) => (
          <div key={l as string} style={{ background:'var(--bl)', padding:'1rem', textAlign:'center' }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:'var(--bd)' }}>{v}</div>
            <div style={{ fontSize:11, color:'var(--inkm)', marginTop:4 }}>{l}</div>
          </div>
        ))}
      </div>
      <input className="search-input" style={{ marginBottom:'1rem' }} placeholder="Rechercher…" value={q} onChange={e => setQ(e.target.value)} />
      <table className="data-table">
        <thead><tr><th>Utilisateur</th><th>Plan</th><th>Montant</th><th>Début</th><th>Renouvellement</th><th>Paiement</th><th>Statut</th></tr></thead>
        <tbody>
          {filtered.map(a => (
            <tr key={a.id}>
              <td style={{ fontWeight:500, fontSize:13 }}>{a.nom}</td>
              <td style={{ fontSize:12 }}>{a.plan}</td>
              <td style={{ fontSize:12, fontFamily:'monospace' }}>{a.montant}</td>
              <td style={{ fontSize:11, color:'var(--inkm)' }}>{a.debut}</td>
              <td style={{ fontSize:11, color:'var(--inkm)' }}>{a.renouvellement}</td>
              <td style={{ fontSize:11 }}>{a.paiement}</td>
              <td><span className={`badge ${SC[a.statut]||'ba'}`}>{a.statut}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  )
}
