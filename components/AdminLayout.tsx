import Link from 'next/link'
import { useRouter } from 'next/router'

const NAV = [
  { href: '/admin', label: 'Tableau de bord', icon: '◈' },
  { href: '/admin/tarifs', label: 'Codes SH & Tarifs', icon: '⊞' },
  { href: '/admin/circulaires', label: 'Circulaires ADII', icon: '≡' },
  { href: '/admin/contenus', label: 'Contenus modules', icon: '✦' },
  { href: '/admin/utilisateurs', label: 'Utilisateurs', icon: '◉' },
  { href: '/admin/abonnements', label: 'Abonnements', icon: '◇' },
  { href: '/admin/alertes', label: 'Alertes', icon: '△' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", background: 'var(--paper)' }}>

      {/* SIDEBAR */}
      <aside style={{ width: 220, background: 'var(--bd)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: 'white' }}>
            DAS <span style={{ color: 'var(--ba)', fontSize: 12, fontWeight: 400, letterSpacing: '.1em' }}>ADMIN</span>
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', marginTop: 4, letterSpacing: '.1em' }}>BACK-OFFICE</div>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {NAV.map(n => {
            const active = router.pathname === n.href
            return (
              <Link key={n.href} href={n.href} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 16px', fontSize: 13,
                color: active ? 'white' : 'rgba(255,255,255,.6)',
                background: active ? 'rgba(255,255,255,.1)' : 'transparent',
                borderLeft: active ? '3px solid var(--ba)' : '3px solid transparent',
                textDecoration: 'none', transition: 'all .13s'
              }}>
                <span style={{ fontSize: 14, opacity: .8 }}>{n.icon}</span>
                {n.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,.1)' }}>
          <Link href="/" style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', textDecoration: 'none', letterSpacing: '.06em' }}>
            ← Retour au site
          </Link>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {/* Top bar */}
        <div style={{
          height: 48, background: 'var(--white)', borderBottom: '1px solid var(--rule)',
          display: 'flex', alignItems: 'center', padding: '0 1.5rem',
          justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10
        }}>
          <div style={{ fontSize: 11, color: 'var(--inkm)', letterSpacing: '.08em' }}>
            {NAV.find(n => n.href === router.pathname)?.label || 'Administration'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 11, color: 'var(--inkm)' }}>MODE DÉMO</span>
            <div style={{
              background: '#FEF3C7', color: '#92400E', fontSize: 10,
              padding: '2px 8px', letterSpacing: '.08em', borderRadius: 2
            }}>DAS — Dev</div>
          </div>
        </div>

        <div style={{ padding: '2rem' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
