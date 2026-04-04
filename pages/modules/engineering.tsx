import ModuleLayout from '../../components/ModuleLayout'
export default function Engineering() {
  const cards=[
    ['Audit flux logistique','Analyse de vos schémas actuels, identification des optimisations tarifaires et logistiques.'],
    ['Ingénierie tarifaire','Optimisation légale du classement douanier, utilisation des accords de libre-échange (ALE).'],
    ['Restructuration supply chain','Redéfinition des flux en tenant compte des régimes économiques, zones franches et corridors.'],
    ['Veille réglementaire','Alertes sur les évolutions tarifaires, nouvelles circulaires et impacts sur vos opérations.'],
  ]
  return(
    <ModuleLayout kicker="MODULE 08" title="Douane Engineering" sub="Ingénierie des schémas douaniers, optimisation des flux et structuration des opérations pour réduire les coûts et délais.">
      <div className="card-grid">{cards.map(([t,d])=><div key={t} className="card"><div className="card-title">{t}</div><div className="card-desc">{d}</div></div>)}</div>
    </ModuleLayout>
  )
}
