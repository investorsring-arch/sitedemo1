import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Dossiers() {
  const router = useRouter()
  const [dossiers] = useState([
    {
      id: 1,
      name: 'Import Textiles - Lot A',
      hsCode: '6204.62.00',
      amount: '€25,000',
      status: 'En cours',
      risk: 'Moyen',
      date: '2026-03-15'
    },
    {
      id: 2,
      name: 'Équipements électroniques',
      hsCode: '8517.62.90',
      amount: '€150,000',
      status: 'Approuvé',
      risk: 'Bas',
      date: '2026-03-10'
    },
    {
      id: 3,
      name: 'Produits cosmétiques',
      hsCode: '3304.99.00',
      amount: '€12,500',
      status: 'En révision',
      risk: 'Élevé',
      date: '2026-03-18'
    },
    {
      id: 4,
      name: 'Pièces automobiles',
      hsCode: '8708.40.50',
      amount: '€75,000',
      status: 'Rejeté',
      risk: 'Très élevé',
      date: '2026-03-08'
    },
  ])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Approuvé': return '#28a745'
      case 'En cours': return '#ffc107'
      case 'En révision': return '#ff9800'
      case 'Rejeté': return '#dc3545'
      default: return '#6c757d'
    }
  }

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'Bas': return '#28a745'
      case 'Moyen': return '#ffc107'
      case 'Élevé': return '#ff9800'
      case 'Très élevé': return '#dc3545'
      default: return '#6c757d'
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'Arial' }}>
      {/* Header */}
      <div style={{ background: '#ff9800', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>📁 Mes Dossiers</h1>
        <button onClick={() => router.push('/dashboard')} style={{ padding: '10px 20px', background: 'white', color: '#ff9800', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          ← Dashboard
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' }}>
        <button style={{
          marginBottom: '20px',
          padding: '12px 20px',
          background: '#ff9800',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          + Nouveau Dossier
        </button>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Nom</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>HS Code</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Montant</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Statut</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Risque</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dossiers.map(dossier => (
                <tr key={dossier.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px' }}><strong>{dossier.name}</strong></td>
                  <td style={{ padding: '15px' }}>{dossier.hsCode}</td>
                  <td style={{ padding: '15px' }}>{dossier.amount}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      padding: '5px 10px',
                      background: getStatusColor(dossier.status),
                      color: 'white',
                      borderRadius: '3px',
                      fontSize: '12px'
                    }}>
                      {dossier.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      padding: '5px 10px',
                      background: getRiskColor(dossier.risk),
                      color: 'white',
                      borderRadius: '3px',
                      fontSize: '12px'
                    }}>
                      {dossier.risk}
                    </span>
                  </td>
                  <td style={{ padding: '15px', fontSize: '12px' }}>{dossier.date}</td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <button style={{
                      padding: '5px 10px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}>
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}