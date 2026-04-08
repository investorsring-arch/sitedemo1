import { useState } from 'react'
import ModuleLayout from '../../components/ModuleLayout'

export default function Procedures() {
  const [q, setQ] = useState('')
  const data = [
    ['ADII-001',"Dédouanement à l'importation",'Mise à la consommation','2–5 jours','Actif','bg'],
    ['ADII-002','Exportation définitive','Exportation','1–3 jours','Actif','bg'],
    ['ADII-003','Transit douanier national','Transit','Même jour','Actif','bg'],
    ['ADII-004','Admission temporaire','Régime économique','3–7 jours','Actif','bg'],
    ['ADII-005','Entrepôt de stockage','Régime suspensif','2–4 jours','Actif','bg'],
    ['ADII-006','Perfectionnement actif','Régime économique','5–10 jours','En révision','ba'],
    ['ADII-007','Zone franche (TFZ)','Zone franche','1–2 jours','Actif','bg'],
    ['ADII-008','Dédouanement simplifié OEA','Opérateur économique agréé','4h','OEA uniquement','bb'],
  ]
  const rows = data.filter(r => r.join(' ').toLowerCase().includes(q.toLowerCase()))

  return (
    <ModuleLayout
      kicker="MODULE 01"
      title="Procédures Expliquées"
      sub="Guide complet des procédures douanières marocaines, en langage clair pour transitaires, importateurs et exportateurs."
    >
      {/* ── Lien vers le guide détaillé des régimes ── */}
      <div style={{
        marginBottom: '1.5rem',
        padding: '.875rem 1.25rem',
        background: '#FBF5E6',
        border: '1px solid #F5E4B0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '.5rem',
      }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.1em', color: '#8A8078', marginBottom: '.2rem' }}>
            GUIDE APPROFONDI
          </div>
          <span style={{ fontSize: 13, color: '#3A3530' }}>
            22 procédures détaillées avec codes régimes DUM, checklists et conseils IA
          </span>
        </div>
        <a
          href="/modules/procedures-process"
          style={{
            fontSize: 12,
            color: '#C9A84C',
            fontWeight: 500,
            border: '1px solid #C9A84C',
            padding: '6px 16px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'all .15s',
          }}
        >
          Accéder aux régimes détaillés →
        </a>
      </div>

      {/* ── KPIs ── */}
      <div className="info-grid">
        <div className="istat">
          <div className="istat-n">124</div>
          <div className="istat-l">Procédures documentées</div>
        </div>
        <div className="istat">
          <div className="istat-n">38</div>
          <div className="istat-l">Formulaires disponibles</div>
        </div>
        <div className="istat">
          <div className="istat-n">2025</div>
          <div className="istat-l">Dernière mise à jour ADII</div>
        </div>
      </div>

      {/* ── Recherche ── */}
      <div className="search-bar">
        <input
          className="search-input"
          placeholder="Rechercher une procédure…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      {/* ── Tableau procédures ── */}
      <div className="section">
        <div className="section-title">Procédures principales</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Procédure</th>
              <th>Régime</th>
              <th>Délai moyen</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([ref, proc, reg, del, stat, cls]) => (
              <tr key={ref}>
                <td>{ref}</td>
                <td>{proc}</td>
                <td>{reg}</td>
                <td>{del}</td>
                <td><span className={`badge ${cls}`}>{stat}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Étapes dédouanement import ── */}
      <div className="section">
        <div className="section-title">Étapes — dédouanement à l'importation</div>
        <ul className="steps">
          {[
            ['Dépôt de la déclaration DUM',      'Transmission électronique via BADR. Délai : J+0.'],
            ['Vérification documentaire',          'Facture, LTA/connaissement, certificat d\'origine, liste de colisage. Délai : J+1.'],
            ['Liquidation des droits et taxes',    'Calcul droits de douane, TVA, TIC selon le code SH. Paiement en ligne ou chèque certifié.'],
            ['Visite et vérification physique',    'Sur circuit rouge uniquement. Inspection des marchandises, contrôle de conformité.'],
            ['Bon à enlever (BAE)',                'Délivrance après apurement. Enlèvement des marchandises du port ou de l\'aéroport.'],
          ].map(([t, d], i) => (
            <li key={i} className="step">
              <div className="step-num">{i + 1}</div>
              <div className="step-content">
                <div className="step-title">{t}</div>
                {d}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Footer lien ── */}
      <div style={{
        marginTop: '1.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid #E8DFC8',
        textAlign: 'center',
      }}>
        <span style={{ fontSize: 12, color: '#8A8078' }}>
          Pour les régimes économiques avancés (ATPA, AT, TSD, EIF, EPP, ZAI…) →{' '}
        </span>
        <a
          href="/modules/procedures-process"
          style={{ fontSize: 12, color: '#C9A84C', fontWeight: 500 }}
        >
          Consulter le guide complet des régimes
        </a>
      </div>
    </ModuleLayout>
  )
}
