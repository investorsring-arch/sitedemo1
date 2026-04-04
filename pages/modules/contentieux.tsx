import ModuleLayout from '../../components/ModuleLayout'
export default function Contentieux() {
  const cards=[
    ['Infractions douanières','Classification des infractions (contrebande, fausse déclaration), barèmes de pénalités.'],
    ['Recours gracieux','Réclamation auprès du directeur régional ADII, délais et pièces à fournir.'],
    ['Transaction douanière','Négociation en lieu et place des poursuites judiciaires. Procédure et barèmes 2024.'],
    ['Recours juridictionnel','Tribunal administratif, Cour d\'appel — étapes, délais et représentation.'],
  ]
  return(
    <ModuleLayout kicker="MODULE 09" title="Contentieux & Litiges" sub="Gestion des infractions douanières, procédures de recours, transactions et contentieux devant les juridictions compétentes.">
      <div className="alert alert-warn">Les informations sont à titre indicatif. Pour tout litige, consultez un expert douanier ou un avocat spécialisé.</div>
      <div className="card-grid">{cards.map(([t,d])=><div key={t} className="card"><div className="card-title">{t}</div><div className="card-desc">{d}</div></div>)}</div>
    </ModuleLayout>
  )
}
