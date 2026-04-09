import Link from 'next/link'
import { useRouter } from 'next/router'

const NAV_SECTIONS = [
  {
    section: 'TABLEAU DE BORD',
    items: [
      { href: '/admin',            label: 'Vue d\'ensemble',    icon: '◈' },
    ]
  },
  {
    section: 'DONNÉES & CONTENU',
    items: [
      { href: '/admin/tarifs',     label: 'Codes SH & Tarifs',  icon: '⊞' },
      { href: '/admin/circulaires',label: 'Circulaires ADII',   icon: '≡' },
      { href: '/admin/contenus',   label: 'Contenus modules',   icon: '✦' },
    ]
  },
  {
    section: 'ABONNÉS',
    items: [
      { href: '/admin/utilisateurs',label: 'Utilisateurs',      icon: '◉' },
      { href: '/admin/abonnements', label: 'Abonnements',       icon: '◇' },
    ]
  },
  {
    section: 'COMMUNICATION',
    items: [
      { href: '/admin/alertes',    label: 'Backoffice',         icon: '⚙' },
    ]
  },
]

// Flat list pour la topbar
const NAV_FLAT = NAV_SECTIONS.flatMap(s => s.items)

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", background: 'var(--paper)' }}>

      {/* SIDEBAR */}
      <aside style={{ width: 230, background: 'var(--bd)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: '1.25rem 1rem 1rem', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: 'white', letterSpacing: '-.01em' }}>
            Douane<span style={{ color: 'var(--ba)' }}>.</span>ia
          </div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', marginTop: 2, letterSpacing: '.18em' }}>ADMINISTRATION</div>
        </div>

        {/* Nav par sections */}
        <nav style={{ flex: 1, padding: '.75rem 0', overflowY: 'auto' }}>
          {NAV_SECTIONS.map(section => (
            <div key={section.section} style={{ marginBottom: '.75rem' }}>
              <div style={{ fontSize: 9, letterSpacing: '.18em', color: 'rgba(255,255,255,.22)', padding: '0 1rem .35rem' }}>
                {section.section}
              </div>
              {section.items.map(n => {
                const active = router.pathname === n.href
                return (
                  <Link key={n.href} href={n.href} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '7px 1rem', fontSize: 12.5,
                    color: active ? 'white' : 'rgba(255,255,255,.55)',
                    background: active ? 'rgba(255,255,255,.1)' : 'transparent',
                    borderLeft: active ? '2px solid var(--ba)' : '2px solid transparent',
                    textDecoration: 'none', transition: 'all .13s'
                  }}>
                    <span style={{ fontSize: 13, opacity: .75 }}>{n.icon}</span>
                    {n.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '.875rem 1rem', borderTop: '1px solid rgba(255,255,255,.1)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Link href="/" style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', textDecoration: 'none', letterSpacing: '.04em' }}>
            ← Site public
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
            {NAV_FLAT.find(n => n.href === router.pathname)?.label?.toUpperCase() || 'ADMINISTRATION'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#FEF3C7', color: '#92400E', fontSize: 10, padding: '2px 8px', letterSpacing: '.08em', borderRadius: 2 }}>
              Douane.ia — Admin
            </div>
          </div>
        </div>

        <div style={{ padding: '2rem' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
