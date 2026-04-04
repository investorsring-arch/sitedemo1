import Layout from '../components/Layout'

export default function Abonnements() {
  const plans = [
    { name:'CONSULTATION', price:'799', feat:false, tag:false,
      items:['✓ Procédures & réglementation','✓ 50 requêtes IA / mois','✓ Codes SH & taux de droits','✓ Support par email','✗ Régimes & classement','✗ Tableau de bord'],
      cta:'Commencer' },
    { name:'PROFESSIONNEL', price:'1 990', feat:true, tag:'RECOMMANDÉ',
      items:['✓ Tous les modules inclus','✓ Requêtes IA illimitées','✓ Régimes & décisions classement','✓ Tableau de bord & alertes','✓ Support prioritaire 24/7','✓ Conseil personnalisé (4h/mois)'],
      cta:'Commencer' },
    { name:'CABINET & ENTREPRISE', price:'4 990', feat:false, tag:false,
      items:['✓ Tout le plan Professionnel','✓ Audit & contentieux avancés','✓ Conseil expert dédié illimité','✓ Analyses stratégiques ZLECAf','✓ API & intégration ERP','✓ Onboarding dédié'],
      cta:'Nous contacter' },
  ]

  return (
    <Layout variant="inner">
      <div className="page-wrap">
        <div className="page-header">
          <div className="page-kicker">TARIFICATION</div>
          <h1 className="page-title">Abonnements</h1>
          <p className="page-sub">Choisissez le plan adapté à votre activité. TVA 20% incluse. Paiement par Banque Populaire.</p>
        </div>
        <div className="alert alert-info">14 jours d'essai gratuit sur tous les plans — aucune carte bancaire requise.</div>
        <div className="plans-row" style={{margin:'1rem 0 2rem'}}>
          {plans.map(p => (
            <div key={p.name} className={`plan ${p.feat?'feat':''}`}>
              {p.tag && <div className="plan-tag">{p.tag}</div>}
              <div className="plan-nm">{p.name}</div>
              <div className="plan-pr"><span style={{fontSize:'13px',verticalAlign:'super'}}>DH </span>{p.price}</div>
              <div className="plan-per">par mois · TVA incluse</div>
              <ul className="plan-ul">
                {p.items.map((item,i) => <li key={i} style={item.startsWith('✗')?{color:'var(--inkm)'}:{}}>{item}</li>)}
              </ul>
              <button className="plan-btn">{p.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
