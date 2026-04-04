import ModuleLayout from '../../components/ModuleLayout'
export default function Regimes() {
  const cards=[
    ['RÉGIME ÉCON.','Admission Temporaire (AT)',"Importation en suspension de droits pour transformation ou réexportation. Délai max 3 ans."],
    ['RÉGIME ÉCON.','Perfectionnement Actif (PA)','Transformation de marchandises importées pour réexportation après ouvraison.'],
    ['RÉGIME SUSPEN.','Entrepôt de Stockage','Stockage en suspension de droits dans les entrepôts ADII agréés.'],
    ["ZONE FRANCHE","Zones Franches d'Exportation","TFZ (Tanger), CFCIM, zones industrielles avec statut douanier spécifique."],
    ['RÉGIME ÉCON.','Drawback','Remboursement des droits de douane sur intrants incorporés dans des produits exportés.'],
    ['RÉGIME ÉCON.','Exportation Temporaire (ET)','Exportation provisoire de biens pour réparation, transformation ou foires internationales.'],
  ]
  return(
    <ModuleLayout kicker="MODULE 04" title="Régimes Particuliers" sub="Régimes économiques suspensifs et exonératoires : conditions d'obtention, obligations, apurement.">
      <div className="card-grid">
        {cards.map(([num,title,desc])=>(
          <div key={title} className="card"><div className="card-num">{num}</div><div className="card-title">{title}</div><div className="card-desc">{desc}</div><div className="card-arrow">→ Détails & conditions</div></div>
        ))}
      </div>
    </ModuleLayout>
  )
}
