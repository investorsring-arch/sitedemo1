import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Search() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)

  const mockData = [
    { id: 1, title: 'ADII Circulaire 2024-10', type: 'Circulaire', content: 'Nouvelle réglementation sur les importations textiles' },
    { id: 2, title: 'HS Code 6204.62.00', type: 'HS Code', content: 'Vêtements pour femmes - Pantalons en coton' },
    { id: 3, title: 'ADII Circulaire 2024-08', type: 'Circulaire', content: 'Procédure de dédouanement accélérée' },
    { id: 4, title: 'HS Code 8704.31.10', type: 'HS Code', content: 'Véhicules utilitaires - Camions' },
    { id: 5, title: 'ADII Guide 2024', type: 'Guide', content: 'Guide complet des formalités douanières' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const filtered = mockData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.content.toLowerCase().includes(query.toLowerCase())
    )
    setResults(filtered)
    setSearched(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'Arial' }}>
      {/* Header */}
      <div style={{ background: '#28a745', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>🔍 Rechercher ADII</h1>
        <button onClick={() => router.push('/dashboard')} style={{ padding: '10px 20px', background: 'white', color: '#28a745', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          ← Dashboard
        </button>
      </div>

      {/* Search Container */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        <form onSubmit={handleSearch} style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cherchez: HS code, circulaire ADII, produits..."
              style={{
                flex: 1,
                padding: '15px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '4px'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '15px 30px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              Chercher
            </button>
          </div>
        </form>

        {/* Results */}
        <div>
          {searched && (
            <h3>{results.length} résultat(s) trouvé(s)</h3>
          )}
          <div style={{ display: 'grid', gap: '15px' }}>
            {results.map(item => (
              <div key={item.id} style={{
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#28a745'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 8px 0' }}>{item.title}</h4>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
                      <span style={{ background: '#e9ecef', padding: '2px 8px', borderRadius: '3px' }}>
                        {item.type}
                      </span>
                    </p>
                    <p style={{ margin: 0, color: '#333' }}>{item.content}</p>
                  </div>
                  <button
                    onClick={() => alert('Détail: ' + item.title)}
                    style={{
                      padding: '8px 15px',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginLeft: '20px'
                    }}
                  >
                    Voir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {searched && results.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>Aucun résultat trouvé pour "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}