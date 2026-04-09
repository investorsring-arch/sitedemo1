// pages/admin/alertes.tsx
// Renommée "Backoffice" dans la nav — hub central de gestion du front-office
import { useState } from 'react'
import Link from 'next/link'
import AdminLayout from '../../components/AdminLayout'

// ─── ALERTES (gestion notifications) ────────────────────────────────────────
interface Alerte {
  id: number; titre: string; type: string; cible: string
  statut: string; date: string; destinataires: number; contenu: string
}

const INIT_ALERTES: Alerte[] = [
  { id:1, titre:'Nouvelle circulaire ADII — Médicaments',   type:'Info',        cible:'Tous',          statut:'Envoyée',    date:'15/01/2025', destinataires:248, contenu:'Nouvelle circulaire relative aux procédures de dédouanement des médicaments.' },
  { id:2, titre:'Mise à jour tarif douanier 2025',           type:'Important',   cible:'Pro & Cabinet', statut:'Envoyée',    date:'01/01/2025', destinataires:116, contenu:'Le tarif douanier 2025 est désormais intégré dans la plateforme.' },
  { id:3, titre:'Rappel renouvellement abonnement',          type:'Facturation', cible:'Consultation',  statut:'Programmée', date:'01/04/2025', destinataires:43,  contenu:'Rappel : votre abonnement arrive à échéance prochainement.' },
  { id:4, titre:'Nouvelles procédures ZLECAf',               type:'Info',        cible:'Cabinet',       statut:'Brouillon',  date:'—',          destinataires:0,   contenu:'Mise à jour des procédures liées à la Zone de Libre-Échange Continentale.' },
]

const SC: Record<string,string> = { 'Envoyée':'bg', 'Programmée':'bb', 'Brouillon':'ba' }
const TC: Record<string,string> = { 'Important':'br', 'Info':'bb', 'Facturation':'ba' }
const EMPTY_A: Omit<Alerte,'id'> = { titre:'', type:'Info', cible:'Tous', statut:'Brouillon', date:'—', destinataires:0, contenu:'' }

// ─── HUB SECTIONS ────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    titre: 'Codes SH & Tarifs',
    desc: 'Ajouter, modifier ou supprimer des codes tarifaires. Importer via CSV. Connecté à Supabase en temps réel.',
    href: '/admin/tarifs',
    icon: '⊞',
    couleur: '#2563EB',
    actions: ['Ajouter un code', 'Importer CSV', 'Rechercher'],
  },
  {
    titre: 'Circulaires ADII',
    desc: 'Gérer les circulaires, notes et décrets douaniers. Publier, archiver ou créer de nouveaux documents.',
    href: '/admin/circulaires',
    icon: '≡',
    couleur: '#0891B2',
    actions: ['Ajouter une circulaire', 'Modifier', 'Archiver'],
  },
  {
    titre: 'Contenus modules',
    desc: 'Modifier les textes, guides et procédures affichés dans chaque module du front-office.',
    href: '/admin/contenus',
    icon: '✦',
    couleur: '#7C3AED',
    actions: ['Ajouter un contenu', 'Modifier', 'Supprimer'],
  },
  {
    titre: 'Utilisateurs',
    desc: 'Consulter, modifier et gérer les comptes utilisateurs. Changer le plan, suspendre ou supprimer.',
    href: '/admin/utilisateurs',
    icon: '◉',
    couleur: '#059669',
    actions: ['Ajouter', 'Modifier le plan', 'Suspendre / Supprimer'],
  },
  {
    titre: 'Abonnements',
    desc: 'Gérer les abonnements actifs, modifier les montants, renouvellements et modes de paiement.',
    href: '/admin/abonnements',
    icon: '◇',
    couleur: '#D97706',
    actions: ['Modifier', 'Changer de plan', 'Supprimer'],
  },
]

export default function AdminBackoffice() {
  const [alertes, setAlertes] = useState<Alerte[]>(INIT_ALERTES)
  const [modal, setModal] = useState<'new' | 'edit' | 'delete' | null>(null)
  const [selected, setSelected] = useState<Alerte | null>(null)
  const [form, setForm] = useState<Omit<Alerte,'id'>>({ ...EMPTY_A })
  const [toast, setToast] = useState('')

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000) }

  const openNew  = () => { setForm({ ...EMPTY_A }); setSelected(null); setModal('new') }
  const openEdit = (a: Alerte) => { setSelected(a); setForm({ titre:a.titre, type:a.type, cible:a.cible, statut:a.statut, date:a.date, destinataires:a.destinataires, contenu:a.contenu }); setModal('edit') }
  const openDel  = (a: Alerte) => { setSelected(a); setModal('delete') }

  const save = () => {
    if (!form.titre.trim()) { showToast('Le titre est obligatoire'); return }
    if (modal === 'edit' && selected) {
      setAlertes(d => d.map(r => r.id === selected.id ? { ...r, ...form } : r))
      showToast(`✓ "${form.titre}" mis à jour`)
    } else {
      setAlertes(d => [...d, { ...form, id: Date.now() }])
      showToast(`✓ "${form.titre}" créée`)
    }
    setModal(null)
  }

  const envoyer = (id: number) => {
    setAlertes(d => d.map(r => r.id === id
      ? { ...r, statut: 'Envoyée', date: new Date().toLocaleDateString('fr-MA'), destinataires: 248 }
      : r
    ))
    showToast('✓ Notification envoyée')
  }

  const supprimer = () => {
    if (!selected) return
    setAlertes(d => d.filter(r => r.id !== selected.id))
    showToast(`"${selected.titre}" supprimée`)
    setModal(null)
  }

  const inp = (f: keyof typeof form) => ({
    className: 'form-input',
    value: (form as any)[f] || '',
    onChange: (e: any) => setForm(x => ({ ...x, [f]: e.target.value })),
  })

  return (
    <AdminLayout>

      {/* ── TITRE ── */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: 'var(--bd)', marginBottom: 4 }}>
          Backoffice
        </h1>
        <p style={{ fontSize: 13, color: 'var(--inkm)' }}>
          Centre de gestion du contenu — modifiez les données de chaque section du front-office sans requête SQL.
        </p>
      </div>

      {/* ── SECTIONS DE GESTION ── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '.1em', color: 'var(--inkm)', marginBottom: '1rem' }}>
          SECTIONS GÉRABLES
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {SECTIONS.map(s => (
            <Link key={s.href} href={s.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--white)', border: '.5px solid var(--rule)',
                borderTop: `3px solid ${s.couleur}`, padding: '1.25rem',
                cursor: 'pointer', transition: 'box-shadow .15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.08)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 20, color: s.couleur }}>{s.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--bd)' }}>{s.titre}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--inkm)', lineHeight: 1.6, marginBottom: 10 }}>{s.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {s.actions.map(a => (
                    <span key={a} style={{ fontSize: 10, padding: '2px 7px', background: 'var(--bl)', color: 'var(--inks)', border: '.5px solid var(--rule)' }}>
                      {a}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: 12, fontSize: 11, color: s.couleur, fontWeight: 500 }}>
                  Gérer →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── GESTION DES NOTIFICATIONS / ALERTES ── */}
      <div style={{ borderTop: '.5px solid var(--rule)', paddingTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--bd)', fontFamily: "'Playfair Display',serif" }}>
              Notifications & Alertes
            </div>
            <p style={{ fontSize: 12, color: 'var(--inkm)', marginTop: 2 }}>
              Gérez les notifications envoyées aux abonnés
            </p>
          </div>
          <button className="btn btn-primary" onClick={openNew}>+ Nouvelle notification</button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Titre</th><th>Type</th><th>Cible</th><th>Statut</th>
              <th>Date envoi</th><th>Destinataires</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {alertes.map(a => (
              <tr key={a.id}>
                <td style={{ fontWeight: 500, fontSize: 13 }}>{a.titre}</td>
                <td><span className={`badge ${TC[a.type] || 'bb'}`}>{a.type}</span></td>
                <td style={{ fontSize: 12 }}>{a.cible}</td>
                <td><span className={`badge ${SC[a.statut] || 'ba'}`}>{a.statut}</span></td>
                <td style={{ fontSize: 11, color: 'var(--inkm)' }}>{a.date}</td>
                <td style={{ fontSize: 12 }}>{a.destinataires > 0 ? a.destinataires.toLocaleString('fr') : '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(a)}>Modifier</button>
                    {a.statut === 'Brouillon' && (
                      <button className="btn btn-primary btn-sm" onClick={() => envoyer(a.id)}>Envoyer</button>
                    )}
                    <button
                      style={{ padding: '3px 8px', fontSize: 10, background: 'transparent', border: '.5px solid var(--red)', color: 'var(--red)', cursor: 'pointer', fontFamily: 'inherit' }}
                      onClick={() => openDel(a)}>
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── MODAL NOUVEAU / ÉDITION ── */}
      {(modal === 'new' || modal === 'edit') && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
          <div style={{ background: 'var(--white)', width: 520, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.2rem 1.5rem', borderBottom: '.5px solid var(--rule)', position: 'sticky', top: 0, background: 'var(--white)', zIndex: 1 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, color: 'var(--bd)' }}>
                {modal === 'edit' ? 'Modifier la notification' : 'Nouvelle notification'}
              </div>
              <button style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }} onClick={() => setModal(null)}>✕</button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: 11, letterSpacing: '.07em', color: 'var(--inks)', marginBottom: 4 }}>TITRE *</label>
                <input className="form-input" {...inp('titre')} placeholder="Titre de la notification" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: '.07em', color: 'var(--inks)', marginBottom: 4 }}>TYPE</label>
                  <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    <option>Info</option><option>Important</option><option>Facturation</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: '.07em', color: 'var(--inks)', marginBottom: 4 }}>CIBLE</label>
                  <select className="form-select" value={form.cible} onChange={e => setForm(f => ({ ...f, cible: e.target.value }))}>
                    <option value="Tous">Tous les abonnés</option>
                    <option value="Pro & Cabinet">Pro & Cabinet</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Cabinet">Cabinet</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: 11, letterSpacing: '.07em', color: 'var(--inks)', marginBottom: 4 }}>STATUT</label>
                <select className="form-select" value={form.statut} onChange={e => setForm(f => ({ ...f, statut: e.target.value }))}>
                  <option>Brouillon</option><option>Programmée</option><option>Envoyée</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, letterSpacing: '.07em', color: 'var(--inks)', marginBottom: 4 }}>MESSAGE</label>
                <textarea className="form-textarea" {...inp('contenu')} placeholder="Contenu de la notification…" />
              </div>
            </div>
            <div style={{ padding: '1rem 1.5rem', borderTop: '.5px solid var(--rule)', display: 'flex', justifyContent: 'flex-end', gap: '.75rem', position: 'sticky', bottom: 0, background: 'var(--white)' }}>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn btn-primary" onClick={save}>
                {modal === 'edit' ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL SUPPRESSION ── */}
      {modal === 'delete' && selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
          <div style={{ background: 'var(--white)', width: 420, padding: '2rem' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: 'var(--bd)', marginBottom: '.75rem' }}>
              Supprimer la notification ?
            </div>
            <p style={{ fontSize: 13, color: 'var(--inkm)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              <strong>"{selected.titre}"</strong> sera définitivement supprimée. Cette action est irréversible.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.75rem' }}>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn btn-danger" onClick={supprimer}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', background: 'var(--bd)', color: 'white', padding: '.7rem 1.2rem', fontSize: 13, zIndex: 999 }}>
          {toast}
        </div>
      )}
    </AdminLayout>
  )
}
