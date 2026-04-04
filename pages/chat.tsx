import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Chat() {
  const router = useRouter()
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Bonjour! Je suis votre assistant IA Douane.IA. Comment puis-je vous aider?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Ajouter le message utilisateur
    setMessages([...messages, { role: 'user', content: input }])
    setInput('')
    setLoading(true)

    // Mock réponse IA
    setTimeout(() => {
      const responses = [
        'Les tarifs douaniers dépendent du HS code. Pouvez-vous me donner plus de détails?',
        'Pour les importations en Maroc, vous devez respecter les circulaires ADII 2024. Quelle est votre catégorie de produit?',
        'La déclaration en douane doit inclure: le HS code, l\'origine, la valeur FOB et le poids brut.',
        'Les délais de dédouanement sont généralement de 24-48h. Avez-vous d\'autres questions?'
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages(prev => [...prev, { role: 'assistant', content: randomResponse }])
      setLoading(false)
    }, 800)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'Arial' }}>
      {/* Header */}
      <div style={{ background: '#007bff', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>💬 Chat Douane.IA</h1>
        <button onClick={() => router.push('/dashboard')} style={{ padding: '10px 20px', background: 'white', color: '#007bff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          ← Dashboard
        </button>
      </div>

      {/* Chat Container */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '8px', 
          padding: '20px', 
          minHeight: '500px',
          maxHeight: '500px',
          overflowY: 'auto',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: '15px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
              <div style={{
                display: 'inline-block',
                maxWidth: '70%',
                padding: '10px 15px',
                borderRadius: '8px',
                background: msg.role === 'user' ? '#007bff' : '#e9ecef',
                color: msg.role === 'user' ? 'white' : '#333',
                wordWrap: 'break-word'
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ textAlign: 'left', marginTop: '10px' }}>
              <div style={{ display: 'inline-block', padding: '10px 15px', background: '#e9ecef', borderRadius: '8px' }}>
                ⏳ En cours...
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question sur les douanes..."
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              padding: '12px 20px',
              background: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  )
}