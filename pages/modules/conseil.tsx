import { useState } from 'react'
import ModuleLayout from '../../components/ModuleLayout'
export default function Conseil() {
  const [nom,setNom]=useState(''); const [email,setEmail]=useState(''); const [msg,setMsg]=useState(''); const [sent,setSent]=useState(false)
  return(
    <ModuleLayout kicker="MODULE 07" title="Conseil Personnalisé" sub="Assistance d'experts douaniers certifiés pour les opérations complexes, les litiges et l'optimisation tarifaire.">
      <div className="alert alert-info">Ce module est disponible à partir du plan Professionnel (DH 1 990/mois).</div>
      <div className="card-grid">
        {[['Consultation express','Réponse sous 4h par un expert douanier. Idéal pour les questions urgentes avant dédouanement.'],
          ['Étude de cas tarifaire','Analyse complète de classement, calcul incidence droits+taxes, scénarios d\'optimisation.'],
          ['Accompagnement OEA','Préparation et suivi du dossier de certification Opérateur Économique Agréé.'],
          ['Formation sur mesure','Sessions de formation en douane marocaine pour vos équipes logistique et achats.'],
        ].map(([t,d])=><div key={t} className="card"><div className="card-title">{t}</div><div className="card-desc">{d}</div></div>)}
      </div>
      <div style={{marginTop:'2rem'}}><div className="section-title">Contacter un expert</div>
        {sent?<div className="alert alert-info">Demande envoyée — un expert vous contactera sous 4h.</div>:<>
          <div className="form-row" style={{maxWidth:'580px'}}>
            <div className="form-group"><label className="form-label">NOM COMPLET</label><input className="form-input" value={nom} onChange={e=>setNom(e.target.value)} placeholder="Votre nom"/></div>
            <div className="form-group"><label className="form-label">EMAIL</label><input className="form-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@societe.ma"/></div>
          </div>
          <div className="form-group" style={{maxWidth:'580px'}}><label className="form-label">VOTRE DEMANDE</label><textarea className="form-textarea" value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Décrivez votre problématique douanière…"/></div>
          <button className="btn btn-primary" onClick={()=>setSent(true)}>Envoyer la demande</button>
        </>}
      </div>
    </ModuleLayout>
  )
}
