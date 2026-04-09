// components/Layout.tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface LayoutProps {
  children: React.ReactNode
  variant?: 'landing' | 'inner'
}

// ─── MODULES ─────────────────────────────────────────────────────────────────
const MODULES_MAIN = [
  { num: '00',  label: 'FAQ Douanière',           href: '/modules/faq' },
  { num: '05',  label: 'Audit Douanier',          href: '/modules/audit' },
  { num: '12',  label: 'Contrôle des Risques',    href: '/modules/risques' },
  { num: 'CLT', label: 'Décisions de Classement', href: '/modules/classement' },
  { num: 'ANA', label: 'Analyses Stratégiques',   href: '/modules/analyses' },
]

const MODULES_TOOLS = [
  { num: 'TRK', label: 'Tracking & Intelligence',      href: '/modules/tracking',              badge: 'NEW' },
  { num: 'CAL', label: 'Simulateur Droits & Taxes',    href: '/modules/simulateur',            badge: '↗'   },
  { num: 'CMP', label: 'Comparateur Régimes',          href: '/modules/comparateur',           badge: '↗'   },
  { num: 'ORI', label: 'Origine ALECA / UE',           href: '/modules/origine-aleca',         badge: 'NEW' },
  // FIX-1 : slug corrigé logistique2 → reference-logistique
  { num: 'REF', label: 'Référence Logistique',         href: '/modules/reference-logistique',  badge: 'NEW' },
  { num: '15',  label: 'Incoterms × Shipping Terms',   href: '/modules/incoterms-shipping',    badge: 'NEW' },
  // FIX-2 : modules standalone — les pages wrapper Next.js doivent exister dans pages/modules/
  { num: 'REC', label: 'Régimes Économiques',          href: '/modules/regimes-economiques',   badge: 'NEW' },
  { num: 'DOC', label: 'Documents par Code SH',        href: '/modules/documents-sh',          badge: 'NEW' },
  { num: 'DUM', label: 'Vérificateur DUM',             href: '/modules/verificateur-dum',      badge: 'NEW' },
  { num: 'SIM', label: 'Simulateur Fiscal Import',     href: '/modules/simulateur-fiscal',     badge: 'NEW' },
  { num: 'GEN', label: 'Générateur Documents',         href: '/modules/generateur-docs',       badge: 'NEW' },
  { num: 'GLO', label: 'Glossaire Douanier FR/AR',     href: '/modules/glossaire-douanier',    badge: 'NEW' },
  { num: 'PRT', label: 'PortNet & Tanger Med',         href: '/modules/portnet-tanger',        badge: 'NEW' },
  { num: 'PRO', label: 'Procédures Douanières',        href: '/modules/procedures',            badge: 'NEW' },
  // FIX-3 : slug corrigé procedures-process → procedures-regimes (route canonique)
  { num: 'RGM', label: 'Procédures & Régimes',         href: '/modules/procedures-regimes',    badge: 'NEW' },
  { num: 'ICI', label: 'Index Commerce Intl.',         href: '/modules/index-commerce',        badge: 'NEW' },
  { num: 'CFH', label: 'Facilitation Douanière',       href: '/modules/facilitation',          badge: 'NEW' },
  // FIX-4 : page orpheline arborescence enregistrée dans la navigation
  { num: 'ARB', label: 'Arborescence',                 href: '/modules/arborescence',          badge: 'NEW' },
]

const MODULES_COMM = [
  { num: 'COM', label: 'Espace Communautaire', href: '/community', badge: '↗' },
]

// ─── Composant Layout ─────────────────────────────────────────────────────────
export default function Layout({ children, variant = 'inner' }: LayoutProps) {
  const router = useRouter()
  const [loginOpen,    setLoginOpen]    = useState(false)
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [user,         setUser]         = useState('')
  const [toast,        setToast]        = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [mastDate,     setMastDate]     = useState('')

  const isLanding = variant === 'landing'

  useEffect(() => {
    const days   = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
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

  // ── Item sidebar générique ─────────────────────────────────────────────────
  const SideItem = ({ href, num, label, badge }: {
    href: string; num: string; label: string; badge?: string
  }) => (
    <Link
      href={href}
      className={`sidebar-item ${router.pathname.startsWith(href) ? 'active' : ''}`}
    >
      <span className="sidebar-num">{num}</span>
      {label}
      {badge && (
        <span className="sidebar-badge" style={{
          background: badge === '↗' ? 'transparent' : 'var(--ba)',
          color:      badge === '↗' ? 'var(--ba)'   : 'white',
          fontSize: 9,
          padding: '1px 5px',
          border: badge === '↗' ? '1px solid var(--ba)' : 'none',
        }}>
          {badge}
        </span>
      )}
    </Link>
  )

  return (
    <>
      {/* ── MASTHEAD — landing uniquement ── */}
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
              <Link href="/modules/simulateur"  className="mast-nav-item">SIMULATEUR</Link>
              <Link href="/modules/comparateur" className="mast-nav-item">COMPARATEUR</Link>
              <Link href="/modules/analyses"    className="mast-nav-item">ANALYSES</Link>
              <Link href="/community"           className="mast-nav-item">COMMUNAUTÉ</Link>
              <Link href="/abonnements"         className="mast-nav-item">ABONNEMENTS</Link>
              {/* FIX-5 : trailing slash supprimé — uniformisation /lexique */}
              <Link href="/lexique"             className="mast-nav-item">📚 LEXIQUE</Link>
              <button className="mast-nav-cta" onClick={() => setLoginOpen(true)}>ESSAYER GRATUITEMENT</button>
            </div>
          </div>
        </header>
      )}

      {/* ── TOPNAV — pages internes ── */}
      {!isLanding && (
        <nav className="topnav">
          <Link href="/" className="topnav-logo">DAS</Link>
          <div className="topnav-links">
            <Link href="/"                    className={`topnav-link ${router.pathname === '/'                         ? 'active' : ''}`}>ACCUEIL</Link>
            <Link href="/modules/simulateur"  className={`topnav-link ${router.pathname.includes('simulateur')          ? 'active' : ''}`}>SIMULATEUR</Link>
            <Link href="/modules/comparateur" className={`topnav-link ${router.pathname.includes('comparateur')         ? 'active' : ''}`}>COMPARATEUR</Link>
            <Link href="/modules/analyses"    className={`topnav-link ${router.pathname.includes('analyses')            ? 'active' : ''}`}>ANALYSES</Link>
            <Link href="/community"           className={`topnav-link ${router.pathname.startsWith('/community')        ? 'active' : ''}`}>COMMUNAUTÉ</Link>
            <Link href="/abonnements"         className={`topnav-link ${router.pathname === '/abonnements'              ? 'active' : ''}`}>ABONNEMENTS</Link>
            {/* FIX-5 : trailing slash supprimé — uniformisation /lexique */}
            <Link href="/lexique"             className={`topnav-link ${router.pathname.startsWith('/lexique')          ? 'active' : ''}`}>📚 LEXIQUE</Link>
          </div>
          <div className="topnav-right">
            <span className="topnav-user">{user || 'Non connecté'}</span>
            <button className="topnav-btn outline" onClick={() => setLoginOpen(true)}>Connexion</button>
            <Link href="/abonnements"><button className="topnav-btn">Essayer</button></Link>
          </div>
        </nav>
      )}

      {/* ── LAYOUT PRINCIPAL ── */}
      <div className="main-wrap">

        {/* ── SIDEBAR — pages internes ── */}
        {!isLanding && (
          <aside className="sidebar">

            <div className="sidebar-section">
              <div className="sidebar-label">MODULES PRINCIPAUX</div>
              {MODULES_MAIN.map(m => (
                <SideItem key={m.href} {...m} />
              ))}
            </div>

            <div className="sidebar-divider" />

            <div className="sidebar-section">
              <div className="sidebar-label">OUTILS INTERACTIFS</div>
              {MODULES_TOOLS.map(m => (
                <SideItem key={m.href} {...m} />
              ))}
            </div>

            <div className="sidebar-divider" />

            <div className="sidebar-section">
              <div className="sidebar-label">COMMUNAUTÉ & COMPTE</div>
              {MODULES_COMM.map(m => (
                <SideItem key={m.href} {...m} />
              ))}
              <Link href="/dashboard"   className={`sidebar-item ${router.pathname === '/dashboard'          ? 'active' : ''}`}><span className="sidebar-num">↗</span>Mon Dashboard</Link>
              <Link href="/mon-compte"  className={`sidebar-item ${router.pathname.startsWith('/mon-compte') ? 'active' : ''}`}><span className="sidebar-num">↗</span>Mon Compte</Link>
              <Link href="/abonnements" className={`sidebar-item ${router.pathname === '/abonnements'        ? 'active' : ''}`}><span className="sidebar-num">↗</span>Abonnements</Link>
              {/* FIX-5 : trailing slash supprimé + condition corrigée en startsWith */}
              <Link href="/lexique"     className={`sidebar-item ${router.pathname.startsWith('/lexique')    ? 'active' : ''}`}><span className="sidebar-num">↗</span>📚 Lexique</Link>
            </div>

          </aside>
        )}

        <main className="content-area">
          {children}
        </main>
      </div>

      {/* ── MODAL CONNEXION ── */}
      <div
        className={`modal-overlay ${loginOpen ? 'open' : ''}`}
        onClick={e => { if (e.target === e.currentTarget) setLoginOpen(false) }}
      >
        <div className="modal">
          <div className="modal-header">
            <div className="modal-title">Connexion à DAS</div>
            <button className="modal-close" onClick={() => setLoginOpen(false)}>✕</button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">EMAIL</label>
              <input
                className="form-input"
                type="email"
                placeholder="email@societe.ma"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">MOT DE PASSE</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doLogin()}
              />
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', marginTop:'.5rem' }}>
              <span style={{ color:'var(--inkm)' }}>
                Pas de compte ?{' '}
                <Link href="#" style={{ color:'var(--ba)' }}>S'inscrire</Link>
              </span>
              <Link href="#" style={{ color:'var(--ba)' }}>Mot de passe oublié</Link>
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
