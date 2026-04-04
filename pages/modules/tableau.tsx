import ModuleLayout from '../../components/ModuleLayout'
export default function Tableau() {
  const dossiers=[
    ['DUM-2025-04412','Machines industrielles','Mise à consommation','TANGER MED','BAE délivré','bg','18/03/2025'],
    ['DUM-2025-04398','Textiles synthétiques','Mise à consommation','CASABLANCA','En vérification','ba','17/03/2025'],
    ['DUM-2025-04351','Composants électroniques','Admission temporaire','CASA AÉROPORT','Liquidation','bb','15/03/2025'],
    ['DUM-2025-04290','Matières premières plastiques','Entrepôt','CASABLANCA','BAE délivré','bg','12/03/2025'],
  ]
  return(
    <ModuleLayout kicker="MODULE 10" title="Tableau de Bord" sub="Suivi en temps réel de vos dossiers douaniers, alertes réglementaires et indicateurs clés de performance.">
      <div className="dash-grid">
        <div className="dash-card"><div className="dash-lbl">DOSSIERS EN COURS</div><div className="dash-val">12</div><div className="dash-sub">3 en attente BAE</div></div>
        <div className="dash-card"><div className="dash-lbl">DROITS PAYÉS CE MOIS</div><div className="dash-val">184K</div><div className="dash-sub">DH · TVA incluse</div></div>
        <div className="dash-card"><div className="dash-lbl">DÉLAI MOYEN</div><div className="dash-val">2.4j</div><div className="dash-sub">dédouanement import</div></div>
        <div className="dash-card"><div className="dash-lbl">ALERTES ACTIVES</div><div className="dash-val">2</div><div className="dash-sub">1 critique · 1 info</div></div>
      </div>
      <div className="section"><div className="section-title">Dossiers récents</div>
        <table className="data-table"><thead><tr><th>Ref. DUM</th><th>Marchandise</th><th>Régime</th><th>Port/Aéroport</th><th>Statut</th><th>Date</th></tr></thead>
          <tbody>{dossiers.map(([ref,marc,reg,port,stat,cls,date])=><tr key={ref}><td>{ref}</td><td>{marc}</td><td>{reg}</td><td>{port}</td><td><span className={`badge ${cls}`}>{stat}</span></td><td>{date}</td></tr>)}</tbody>
        </table>
      </div>
    </ModuleLayout>
  )
}
