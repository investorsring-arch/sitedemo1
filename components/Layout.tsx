import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface LayoutProps {
  children: React.ReactNode
  variant?: 'landing' | 'inner'
}

const MODULES = [
  // ── MODULES PRINCIPAUX
  { num: '00',  label: 'FAQ Douanière',              href: '/modules/faq' },
  { num: '05',  label: 'Audit Douanier',             href: '/modules/audit' },
  { num: '12',  label: 'Contrôle des Risques',       href: '/modules/risques' },
  { num: 'CLT', label: 'Décisions de Classement',    href: '/modules/classement' },
  { num: 'ANA', label: 'Analyses Stratégiques',      href: '/modules/analyses' },

  // ── OUTILS INTERACTIFS
  { num: 'SIM', label: 'Simulateur Droits & Taxes',  href: '/modules/simulateur',     badge: '↗' },
  { num: 'CMP', label: 'Comparateur Régimes',        href: '/modules/comparateur',    badge: '↗' },
  { num: 'ORI', label: 'Origine ALECA / UE',         href: '/modules/origine-aleca',  badge: 'NEW' },
  { num: 'INC', label: 'Incoterms 2020', href: '/modules/incoterms', badge: 'NEW' },
  { num: 'ICI', label: 'Index Commerce Intl.',        href: '/modules/index-commerce', badge: 'NEW' },
  { num: 'ARB', label: 'Arborescence Commerce',      href: '/modules/arborescence-',  badge: 'NEW' },

  // ── COMMUNAUTÉ
  { num: 'COM', label: 'Espace Communautaire',       href: '/community',              badge: '↗' },
]

const BACKOFFICE = [
  { num: 'ADM', label: 'Admin — Tarifs',             href: '/admin/tarifs' },
]

export default function Layout({ children, variant = 'inner' }: LayoutProps) {
  const router = useRouter()
  const [loginOpen, setLoginOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState('')
  const [toast, setToast] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [mastDate, setMastDate] = useState('')

  const isLanding = variant === 'landing'

  useEffect(() => {
    const days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
    const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
    const now = new Date()
    setMastDate(`${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`)
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3200)
  }

  const doLogin = () => {
    if (!email) { showToast('Veuillez saisir votre email.'); return }
    setUser(email.split('@')[0])
    setLoginOpen(false)
    showToast(`Connecté en tant que ${email.split('@')[0]} — bienvenue !`)
    router.push('/dashboard')
  }

  // Séparer modules principaux (index 0–4) des outils (5–9) et communauté (10)
  const MAIN_MODULES   = MODULES.slice(0, 5)
  const TOOL_MODULES   = MODULES.slice(5, 10)
  const COMM_MODULES   = MODULES.slice(10)

  return (
    <>
      {/* ── MASTHEAD (landing only) ── */}
      {isLanding && (
        <header>
          <div className="masthead">
            <div className="mast-top">
              <span>PLATEFORME DOUANIÈRE — DÉMONSTRATION INTERNE</span>
              <span>{mastDate}</span>
            </div>
            <div className="mast-main">
              <Link href="/" className="mast-logo">DAS</Link>
              <div className="mast-tagline">Démo interne — Phase de développement</div>
            </div>
            <div className="mast-nav">
              <Link href="/modules/simulateur"    className="mast-nav-item">SIMULATEUR</Link>
              <Link href="/modules/comparateur"   className="mast-nav-item">COMPARATEUR</Link>
              <Link href="/modules/analyses"      className="mast-nav-item">ANALYSES</Link>
              <Link href="/community"             className="mast-nav-item">COMMUNAUTÉ</Link>
              <Link href="/abonnements"           className="mast-nav-item">ABONNEMENTS</Link>
              <Link href="/lexique/"              className="mast-nav-item">📚 LEXIQUE</Link>
              <button className="mast-nav-cta" onClick={() => setLoginOpen(true)}>ESSAYER GRATUITEMENT</button>
            </div>
          </div>
        </header>
      )}

      {/* ── TOPNAV (inner pages) ── */}
      {!isLanding && (
        <nav className="topnav">
          <Link href="/" className="topnav-logo">DAS</Link>
          <div className="topnav-links">
            <Link href="/"                        className={`topnav-link ${router.pathname === '/' ? 'active' : ''}`}>ACCUEIL</Link>
            <Link href="/modules/simulateur"      className={`topnav-link ${router.pathname.includes('simulateur') ? 'active' : ''}`}>SIMULATEUR</Link>
            <Link href="/modules/comparateur"     className={`topnav-link ${router.pathname.includes('comparateur') ? 'active' : ''}`}>COMPARATEUR</Link>
            <Link href="/modules/analyses"        className={`topnav-link ${router.pathname.includes('analyses') ? 'active' : ''}`}>ANALYSES</Link>
            <Link href="/community"               className={`topnav-link ${router.pathname.startsWith('/community') ? 'active' : ''}`}>COMMUNAUTÉ</Link>
            <Link href="/abonnements"             className={`topnav-link ${router.pathname === '/abonnements' ? 'active' : ''}`}>ABONNEMENTS</Link>
            <Link href="/lexique/"                className={`topnav-link ${router.pathname === '/lexique' ? 'active' : ''}`}>📚 LEXIQUE</Link>
          </div>
          <div className="topnav-right">
            <span className="topnav-user">{user || 'Non connecté'}</span>
            <button className="topnav-btn outline" onClick={() => setLoginOpen(true)}>Connexion</button>
            <Link href="/abonnements"><button className="topnav-btn">Essayer</button></Link>
          </div>
        </nav>
      )}

      {/* ── MAIN WRAP ── */}
      <div className="main-wrap">

        {/* ── SIDEBAR (inner only) ── */}
        {!isLanding && (
          <aside className="sidebar">

            <div className="sidebar-section">
              <div className="sidebar-label">MODULES PRINCIPAUX</div>
              {MAIN_MODULES.map(m => (
                <Link key={m.href} href={m.href}
                  className={`sidebar-item ${router.pathname === m.href ? 'active' : ''}`}>
                  <span className="sidebar-num">{m.num}</span>
                  {m.label}
                  {m.badge && <span className="sidebar-badge">{m.badge}</span>}
                </Link>
              ))}
            </div>

            <div className="sidebar-divider" />

            <div className="sidebar-section">
              <div className="sidebar-label">OUTILS INTERACTIFS</div>
              {TOOL_MODULES.map(m => (
                <Link key={m.href} href={m.href}
                  className={`sidebar-item ${router.pathname.startsWith(m.href) ? 'active' : ''}`}>
                  <span className="sidebar-num">{m.num}</span>
                  {m.label}
                  {m.badge && (
                    <span className="sidebar-badge"
                      style={{ background: 'var(--ba)', color: 'white', fontSize: 9, padding: '1px 5px' }}>
                      {m.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="sidebar-divider" />

            <div className="sidebar-section">
              <div className="sidebar-label">COMMUNAUTÉ & COMPTE</div>
              {COMM_MODULES.map(m => (
                <Link key={m.href} href={m.href}
                  className={`sidebar-item ${router.pathname.startsWith(m.href) ? 'active' : ''}`}>
                  <span className="sidebar-num">{m.num}</span>
                  {m.label}
                  {m.badge && (
                    <span className="sidebar-badge"
                      style={{ background: 'var(--ba)', color: 'white', fontSize: 9, padding: '1px 5px' }}>
                      {m.badge}
                    </span>
                  )}
                </Link>
              ))}
              <Link href="/dashboard"   className={`sidebar-item ${router.pathname === '/dashboard' ? 'active' : ''}`}>
                <span className="sidebar-num">↗</span>Mon Dashboard
              </Link>
              <Link href="/mon-compte"  className={`sidebar-item ${router.pathname.startsWith('/mon-compte') ? 'active' : ''}`}>
                <span className="sidebar-num">↗</span>Mon Compte
              </Link>
              <Link href="/abonnements" className={`sidebar-item ${router.pathname === '/abonnements' ? 'active' : ''}`}>
                <span className="sidebar-num">↗</span>Abonnements
              </Link>
              <Link href="/lexique/"    className={`sidebar-item ${router.pathname === '/lexique' ? 'active' : ''}`}>
                <span className="sidebar-num">↗</span>📚 Lexique
              </Link>
            </div>

            <div className="sidebar-divider" />

            <div className="sidebar-section">
              <div className="sidebar-label">BACKOFFICE</div>
              {BACKOFFICE.map(m => (
                <Link key={m.href} href={m.href}
                  className={`sidebar-item ${router.pathname.startsWith(m.href) ? 'active' : ''}`}
                  style={{ opacity: 0.75 }}>
                  <span className="sidebar-num">{m.num}</span>
                  {m.label}
                </Link>
              ))}
            </div>

          </aside>
        )}

        <main className="content-area">
          {children}
        </main>
      </div>

      {/* ── LOGIN MODAL ── */}
      <div className={`modal-overlay ${loginOpen ? 'open' : ''}`}
        onClick={e => { if (e.target === e.currentTarget) setLoginOpen(false) }}>
        <div className="modal">
          <div className="modal-header">
            <div className="modal-title">Connexion à DAS</div>
            <button className="modal-close" onClick={() => setLoginOpen(false)}>✕</button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">EMAIL</label>
              <input className="form-input" type="email" placeholder="email@societe.ma"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">MOT DE PASSE</label>
              <input className="form-input" type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doLogin()} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '.5rem' }}>
              <span style={{ color: 'var(--inkm)' }}>Pas de compte ? <Link href="#" style={{ color: 'var(--ba)' }}>S'inscrire</Link></span>
              <Link href="#" style={{ color: 'var(--ba)' }}>Mot de passe oublié</Link>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={() => setLoginOpen(false)}>Annuler</button>
            <button className="btn btn-primary" onClick={doLogin}>Se connecter</button>
          </div>
        </div>
      </div>

      {/* ── TOAST ── */}
      <div className={`toast ${toastVisible ? 'show' : ''}`}>{toast}</div>
    </>
  )
}
