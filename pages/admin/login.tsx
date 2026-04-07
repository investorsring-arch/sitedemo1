import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

const PAGE_CSS = [
  '*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}',
  ':root{',
  '--ink:#0A0A0A;--ink2:#3A3530;--ink3:#8A8078;',
  '--gold:#C9A84C;--gold2:#E8C97A;--gold3:#F5E4B0;--gold4:#FBF5E6;',
  '--white:#FDFCF8;--border:#E8DFC8;--border2:#D4C8A8;',
  '--dn:#E85D5D;--up:#4CAF7C;',
  '}',
  "body{font-family:'DM Sans',sans-serif;background:var(--white);color:var(--ink);min-height:100vh;display:flex;align-items:center;justify-content:center}",
  'a{text-decoration:none;color:inherit}',
  "button{cursor:pointer;font-family:'DM Sans',sans-serif}",
].join('')

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const from = (router.query.from as string) || '/admin/tarifs'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (res.ok) {
        router.replace(from)
      } else {
        setAttempts(a => a + 1)
        setError(data.error || 'Mot de passe incorrect.')
        setPassword('')
      }
    } catch {
      setError('Erreur réseau. Vérifiez votre connexion.')
    }
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Acces Administration — Douane.ia</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap" />
      </Head>

      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />

      <div style={{ width: '100%', maxWidth: 420, padding: '2rem' }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, fontWeight: 600, letterSpacing: '-.02em', marginBottom: '.5rem' }}>
            Douane<span style={{ color: 'var(--gold)' }}>.</span>ia
            <sup style={{ fontSize: 10, fontWeight: 300, color: 'var(--ink3)', verticalAlign: 'super', letterSpacing: '.06em' }}> MAROC</sup>
          </div>
          <div style={{ fontSize: 11, letterSpacing: '.14em', color: 'var(--ink3)' }}>
            ACCES ADMINISTRATION
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ border: '1px solid var(--border2)', background: 'var(--white)', padding: '2rem' }}>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 600, color: 'var(--ink)', marginBottom: '.375rem' }}>
                Connexion securisee
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink3)', lineHeight: 1.6 }}>
                Acces reserve aux administrateurs. Cette page n'est pas indexee.
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: 9, letterSpacing: '.14em', color: 'var(--ink3)', fontWeight: 600, marginBottom: '.5rem' }}>
                MOT DE PASSE ADMINISTRATEUR
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="············"
                autoFocus
                autoComplete="current-password"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '.875rem 1rem',
                  border: error ? '1px solid var(--dn)' : '1px solid var(--border2)',
                  background: 'var(--white)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 14,
                  color: 'var(--ink)',
                  outline: 'none',
                  letterSpacing: '.1em',
                  transition: 'border-color .15s',
                }}
              />
            </div>

            {error && (
              <div style={{ padding: '.625rem .875rem', background: 'rgba(232,93,93,.08)', border: '1px solid rgba(232,93,93,.3)', color: 'var(--dn)', fontSize: 12, marginBottom: '1rem', lineHeight: 1.5 }}>
                {error}
                {attempts >= 3 && (
                  <div style={{ marginTop: '.375rem', fontSize: 11, color: 'var(--ink3)' }}>
                    {5 - attempts} tentative(s) restante(s) avant blocage.
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password.trim()}
              style={{
                width: '100%',
                padding: '.875rem',
                background: loading ? 'var(--border)' : 'var(--ink)',
                color: loading ? 'var(--ink3)' : 'var(--gold2)',
                border: 'none',
                fontSize: 11,
                letterSpacing: '.12em',
                fontWeight: 500,
                cursor: loading || !password.trim() ? 'not-allowed' : 'pointer',
                transition: 'all .15s',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {loading ? 'VERIFICATION...' : 'ACCEDER AU BACKOFFICE →'}
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href="/" style={{ fontSize: 11, color: 'var(--ink3)', letterSpacing: '.08em' }}>
            ← Retour au site
          </a>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: 10, color: 'var(--ink3)', lineHeight: 1.5 }}>
          Session valide 24h · Cookie HttpOnly securise
        </div>
      </div>
    </>
  )
}
