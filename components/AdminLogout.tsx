/**
 * Composant bouton de déconnexion admin
 * À placer dans pages/admin/tarifs.tsx (ou tout layout admin)
 *
 * Usage :
 *   import AdminLogout from '../../components/AdminLogout'
 *   <AdminLogout />
 */

import { useRouter } from 'next/router'
import { useState } from 'react'

export default function AdminLogout() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      style={{
        padding: '5px 14px',
        border: '1px solid var(--border2)',
        background: 'var(--white)',
        color: 'var(--ink3)',
        fontSize: 11,
        letterSpacing: '.08em',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontFamily: "'DM Sans', sans-serif",
        transition: 'all .15s',
      }}
      onMouseOver={e => {
        e.currentTarget.style.borderColor = 'var(--dn)'
        e.currentTarget.style.color = 'var(--dn)'
      }}
      onMouseOut={e => {
        e.currentTarget.style.borderColor = 'var(--border2)'
        e.currentTarget.style.color = 'var(--ink3)'
      }}
    >
      {loading ? '⟳' : '↩ Déconnexion'}
    </button>
  )
}
