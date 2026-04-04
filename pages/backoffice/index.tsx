import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

const ADMIN_EMAIL    = 'investors@gmail.com'
const ADMIN_PASSWORD = 'DAS2026owner'

export default function BackofficeLogin() {
  const router = useRouter()
  const [email, setEmail]     = useState('')
  const [pwd, setPwd]         = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      if (email === ADMIN_EMAIL && pwd === ADMIN_PASSWORD) {
        sessionStorage.setItem('bo_auth', '1')
        router.push('/backoffice/dashboard')
      } else {
        setError('Identifiants incorrects.')
      }
      setLoading(false)
    }, 600)
  }

  return (
    <>
      <Head><title>Backoffice — Douane.ia</title></Head>
      <style suppressHydrationWarning>{`
        *{box-sizing:border-box;margin:0;padding:0;font-family:'DM Sans',system-ui,sans-serif}
        body{background:#0A0A0A;min-height:100vh;display:flex;align-items:center;justify-content:center}
        input{width:100%;padding:10px 14px;border:1px solid #2A2A2A;background:#111;color:#E8C97A;font-family:inherit;font-size:13px;outline:none;transition:border-color .15s}
        input:focus{border-color:#C9A84C}
        input::placeholder{color:#3A3A3A}
      `}</style>

      <div style={{ width:'100%', maxWidth:360, padding:'0 20px' }}>

        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:600, color:'#E8C97A' }}>
            Douane<span style={{ color:'#C9A84C' }}>.</span>ia
          </div>
          <div style={{ fontSize:9, letterSpacing:'.18em', color:'#3A3A3A', marginTop:6 }}>
            BACKOFFICE ADMINISTRATION
          </div>
        </div>

        <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div>
            <div style={{ fontSize:9, letterSpacing:'.12em', color:'#5F5E5A', marginBottom:6 }}>IDENTIFIANT</div>
            <input
              type="email" placeholder="email@admin.ma"
              value={email} onChange={e => { setEmail(e.target.value); setError('') }}
              autoComplete="off"
            />
          </div>
          <div>
            <div style={{ fontSize:9, letterSpacing:'.12em', color:'#5F5E5A', marginBottom:6 }}>MOT DE PASSE</div>
            <input
              type="password" placeholder="••••••••••"
              value={pwd} onChange={e => { setPwd(e.target.value); setError('') }}
            />
          </div>

          {error && (
            <div style={{ padding:'8px 12px', background:'rgba(232,93,93,.1)', border:'1px solid rgba(232,93,93,.3)', fontSize:12, color:'#E85D5D' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !pwd}
            style={{
              marginTop:8, padding:'12px',
              background: loading || !email || !pwd ? '#1A1A1A' : '#C9A84C',
              color:       loading || !email || !pwd ? '#3A3A3A' : '#0A0A0A',
              fontSize:11, letterSpacing:'.1em', border:'none',
              cursor: loading || !email || !pwd ? 'not-allowed' : 'pointer',
              fontFamily:'inherit', fontWeight:500, transition:'all .15s',
            }}
          >
            {loading ? 'VÉRIFICATION...' : 'ACCÉDER AU BACKOFFICE'}
          </button>
        </form>

        <div style={{ marginTop:'2rem', textAlign:'center', fontSize:10, color:'#1A1A1A' }}>
          Accès restreint · Douane.ia · 2026
        </div>
      </div>
    </>
  )
}
