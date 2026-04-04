import { useState } from 'react'
import ModuleLayout from '../../components/ModuleLayout'
export default function Reglementation() {
  const [q,setQ]=useState('')
  const data=[
    ['Circ. 6202/312','Procédures de dédouanement des médicaments','15/01/2025','Circulaire','bb'],
    ['Note 2025/18','Taux de change douanier — T1 2025','02/01/2025','Note','ba'],
    ['Loi 2-22-724','Code des douanes — amendements 2022','01/12/2022','Loi','br'],
    ['Circ. 6180/295','Régime de l\'admission temporaire pour perfectionnement actif','10/09/2024','Circulaire','bb'],
    ['Décret 2-23-441','Tarif douanier 2024 — mises à jour SH 2022','01/01/2024','Décret','br'],
  ]
  const rows=data.filter(r=>r.join(' ').toLowerCase().includes(q.toLowerCase()))
  return(
    <ModuleLayout kicker="MODULE 02" title="Réglementation Simplifiée" sub="Circulaires ADII, textes de loi et notes de service traduits en langage professionnel accessible.">
      <div className="search-bar"><input className="search-input" placeholder="Rechercher une circulaire, un texte réglementaire…" value={q} onChange={e=>setQ(e.target.value)}/></div>
      <div className="section"><div className="section-title">Circulaires et textes récents</div>
        <table className="data-table"><thead><tr><th>Référence</th><th>Objet</th><th>Date</th><th>Type</th><th>Action</th></tr></thead>
          <tbody>{rows.map(([ref,obj,date,type,cls])=><tr key={ref}><td>{ref}</td><td>{obj}</td><td>{date}</td><td><span className={`badge ${cls}`}>{type}</span></td><td><button className="btn btn-outline btn-sm">Consulter</button></td></tr>)}</tbody>
        </table>
      </div>
    </ModuleLayout>
  )
}
