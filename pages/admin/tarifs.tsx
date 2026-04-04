import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/AdminLayout'
import { supabase } from '../../lib/supabase'

interface Tarif {
  id: number
  code_sh: string
  chapitre: string
  designation_clean: string
  taux_droit: number | null
  taux_raw: string | null
  unite_norm: string | null
  est_hierarchique: boolean
  est_feuille: boolean
}

const EMPTY_TARIF = {
  code_sh: '', chapitre: '', designation_clean: '',
  taux_droit: null as number | null, taux_raw: '', unite_norm: '',
  est_hierarchique: false, est_feuille: true
}

export default function AdminTarifs() {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [results, setResults] = useState<Tarif[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const PAGE = 25

  // Modal states
  const [modal, setModal] = useState<'edit' | 'new' | 'delete' | 'import' | null>(null)
  const [selected, setSelected] = useState<Tarif | null>(null)
  const [form, setForm] = useState({ ...EMPTY_TARIF })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importProgress, setImportProgress] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  // Open modal based on URL param
  useEffect(() => {
    if (router.query.action === 'new') { setForm({ ...EMPTY_TARIF }); setModal('new') }
    if (router.query.action === 'import') setModal('import')
  }, [router.query])

  const search = useCallback(async (p = 0) => {
    setLoading(true)
    const from = p * PAGE
    const to = from + PAGE - 1

    let query = supabase
      .from('tarifs')
      .select('id,code_sh,chapitre,designation_clean,taux_droit,taux_raw,unite_norm,est_hierarchique,est_feuille', { count: 'exact' })
      .order('code_sh')
      .range(from, to)

    if (/^\d+$/.test(q.trim())) query = query.like('code_sh', `${q.trim()}%`)
    else if (q.trim().length >= 2) query = query.ilike('designation_clean', `%${q.trim()}%`)

    const { data, count } = await query
    setResults(data || [])
    setTotal(count || 0)
    setPage(p)
    setLoading(false)
  }, [q])

  useEffect(() => {
    const t = setTimeout(() => search(0), 350)
    return () => clearTimeout(t)
  }, [q])

  useEffect(() => { search(0) }, [])

  // SAVE (create or update)
  const save = async () => {
    setSaving(true)
    const payload = {
      code_sh: form.code_sh.trim(),
      chapitre: form.code_sh.trim().slice(0, 2),
      position: form.code_sh.trim().slice(0, 4),
      sous_position: form.code_sh.trim().slice(0, 6),
      subdivision: form.code_sh.trim().slice(0, 8),
      code_complet: form.code_sh.trim(),
      designation: form.designation_clean.trim(),
      designation_clean: form.designation_clean.trim(),
      taux_droit: form.taux_droit,
      taux_raw: form.taux_raw || null,
      unite: form.unite_norm || null,
      unite_norm: form.unite_norm || null,
      est_hierarchique: form.est_hierarchique,
      est_feuille: form.est_feuille,
      texte_rag: `Code SH: ${form.code_sh} | Chapitre: ${form.code_sh.slice(0,2)} | Désignation: ${form.designation_clean}${form.taux_droit != null ? ` | Taux de droit: ${form.taux_droit}%` : ''}`,
    }

    if (modal === 'edit' && selected) {
      const { error } = await supabase.from('tarifs').update(payload).eq('id', selected.id)
      if (error) { showToast('Erreur : ' + error.message) }
      else { showToast(`✓ Code ${form.code_sh} mis à jour`); setModal(null); search(page) }
    } else {
      const { error } = await supabase.from('tarifs').insert(payload)
      if (error) { showToast('Erreur : ' + error.message) }
      else { showToast(`✓ Code ${form.code_sh} ajouté`); setModal(null); search(0) }
    }
    setSaving(false)
  }

  // DELETE
  const deleteTarif = async () => {
    if (!selected) return
    setSaving(true)
    const { error } = await supabase.from('tarifs').delete().eq('id', selected.id)
    if (error) { showToast('Erreur : ' + error.message) }
    else { showToast(`✓ Code ${selected.code_sh} supprimé`); setModal(null); search(page) }
    setSaving(false)
  }

  const openEdit = (t: Tarif) => {
    setSelected(t)
    setForm({ code_sh: t.code_sh, chapitre: t.chapitre, designation_clean: t.designation_clean,
      taux_droit: t.taux_droit, taux_raw: t.taux_raw || '', unite_norm: t.unite_norm || '',
      est_hierarchique: t.est_hierarchique, est_feuille: t.est_feuille })
    setModal('edit')
  }

  const totalPages = Math.ceil(total / PAGE)

  const inp = (field: string) => ({
    className: 'form-input',
    value: (form as any)[field] ?? '',
    onChange: (e: any) => setForm(f => ({ ...f, [field]: e.target.value }))
  })

  return (
    <AdminLayout>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: 'var(--bd)', marginBottom: 4 }}>
            Codes SH & Tarifs
          </h1>
          <p style={{ fontSize: 13, color: 'var(--inkm)' }}>{total.toLocaleString('fr')} codes dans la base</p>
        </div>
        <div style={{ display: 'flex', gap: '.75rem' }}>
          <button className="btn btn-outline btn-sm" onClick={() => setModal('import')}>↑ Importer Excel</button>
          <button className="btn btn-primary" onClick={() => { setForm({ ...EMPTY_TARIF }); setModal('new') }}>+ Nouveau code</button>
        </div>
      </div>

      {/* SEARCH */}
      <div style={{ marginBottom: '1rem' }}>
        <input className="search-input" placeholder="Rechercher par code SH ou mot-clé…" value={q} onChange={e => setQ(e.target.value)} />
      </div>

      {/* TABLE */}
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: 110 }}>Code SH</th>
            <th style={{ width: 50 }}>Chap.</th>
            <th>Désignation</th>
            <th style={{ width: 80 }}>Taux</th>
            <th style={{ width: 60 }}>Unité</th>
            <th style={{ width: 50 }}>Type</th>
            <th style={{ width: 100 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--inkm)', padding: '2rem' }}>Chargement…</td></tr>}
          {!loading && results.map(r => (
            <tr key={r.id} style={r.est_hierarchique ? { background: 'var(--bl)' } : {}}>
              <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{r.code_sh}</td>
              <td style={{ fontSize: 11, color: 'var(--inkm)' }}>{r.chapitre}</td>
              <td style={{ fontSize: 12 }}>{r.designation_clean}</td>
              <td>{r.taux_droit != null ? <span className="badge bb">{r.taux_droit}%</span> : <span style={{ color: 'var(--inkm)', fontSize: 11 }}>—</span>}</td>
              <td style={{ fontSize: 11, color: 'var(--inkm)' }}>{r.unite_norm || '—'}</td>
              <td>{r.est_hierarchique ? <span className="badge ba">Titre</span> : <span className="badge bg">Code</span>}</td>
              <td>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(r)}>Éditer</button>
                  <button style={{ padding: '3px 8px', fontSize: 11, background: 'transparent', border: '.5px solid var(--red)', color: 'var(--red)', cursor: 'pointer' }}
                    onClick={() => { setSelected(r); setModal('delete') }}>✕</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '.75rem', marginTop: '1rem', alignItems: 'center' }}>
          <button className="btn btn-outline btn-sm" disabled={page === 0} onClick={() => search(page - 1)}>← Précédent</button>
          <span style={{ fontSize: 12, color: 'var(--inkm)', flex: 1, textAlign: 'center' }}>
            Page {page + 1} / {totalPages}
          </span>
          <button className="btn btn-outline btn-sm" disabled={page >= totalPages - 1} onClick={() => search(page + 1)}>Suivant →</button>
        </div>
      )}

      {/* MODAL EDIT / NEW */}
      {(modal === 'edit' || modal === 'new') && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
          <div style={{ background: 'var(--white)', width: 540, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 1.5rem', borderBottom: '.5px solid var(--rule)' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: 'var(--bd)' }}>
                {modal === 'edit' ? `Modifier — ${selected?.code_sh}` : 'Ajouter un code SH'}
              </div>
              <button style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--inkm)' }} onClick={() => setModal(null)}>✕</button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: '.07em', color: 'var(--inks)', marginBottom: 4 }}>CODE SH (10 chiffres) *</label>
                  <input {...inp('code_sh')} placeholder="ex: 8703210010" maxLength={10} disabled={modal === 'edit'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: '.07em', color: 'var(--inks)', marginBottom: 4 }}>TAUX DE DROIT (%)</label>
                  <input className="form-input" type="number" min={0} max={500} step={0.5}
                    value={form.taux_droit ?? ''} placeholder="ex: 2.5"
                    onChange={e => setForm(f => ({ ...f, taux_droit: e.target.value ? parseFloat(e.target.value) : null, taux_raw: e.target.value }))} />
                </div>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', fontSize: 11, letterSpacing: '.07em', color: 'var(--inks)', marginBottom: 4 }}>DÉSIGNATION *</label>
                <textarea className="form-textarea" style={{ minHeight: 80 }} {...inp('designation_clean')} placeholder="Description complète de la marchandise" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: '.07em', color: 'var(--inks)', marginBottom: 4 }}>UNITÉ</label>
                  <select className="form-select" value={form.unite_norm || ''} onChange={e => setForm(f => ({ ...f, unite_norm: e.target.value }))}>
                    <option value="">— Aucune —</option>
                    <option value="kg">kg</option>
                    <option value="u">u (unité)</option>
                    <option value="l">l (litre)</option>
                    <option value="m2">m²</option>
                    <option value="m3">m³</option>
                    <option value="m">m (mètre)</option>
                    <option value="kwh">kWh</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: '.07em', color: 'var(--inks)', marginBottom: 4 }}>TYPE DE LIGNE</label>
                  <select className="form-select" value={form.est_hierarchique ? 'hier' : 'feuille'}
                    onChange={e => setForm(f => ({ ...f, est_hierarchique: e.target.value === 'hier', est_feuille: e.target.value !== 'hier' }))}>
                    <option value="feuille">Code terminal (avec taux)</option>
                    <option value="hier">Ligne titre (sans taux)</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ padding: '1rem 1.5rem', borderTop: '.5px solid var(--rule)', display: 'flex', justifyContent: 'flex-end', gap: '.75rem' }}>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn btn-primary" onClick={save} disabled={saving || !form.code_sh || !form.designation_clean}>
                {saving ? 'Enregistrement…' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {modal === 'delete' && selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--white)', width: 420 }}>
            <div style={{ padding: '1.2rem 1.5rem', borderBottom: '.5px solid var(--rule)' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: 'var(--bd)' }}>Confirmer la suppression</div>
            </div>
            <div style={{ padding: '1.5rem', fontSize: 13, color: 'var(--inks)' }}>
              Supprimer le code <strong style={{ fontFamily: 'monospace' }}>{selected.code_sh}</strong> ?<br />
              <span style={{ fontSize: 12, color: 'var(--inkm)' }}>{selected.designation_clean}</span><br /><br />
              <span style={{ color: 'var(--red)', fontSize: 12 }}>Cette action est irréversible.</span>
            </div>
            <div style={{ padding: '1rem 1.5rem', borderTop: '.5px solid var(--rule)', display: 'flex', justifyContent: 'flex-end', gap: '.75rem' }}>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn btn-danger" onClick={deleteTarif} disabled={saving}>{saving ? '…' : 'Supprimer'}</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL IMPORT */}
      {modal === 'import' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--white)', width: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 1.5rem', borderBottom: '.5px solid var(--rule)' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: 'var(--bd)' }}>Import en masse — Excel</div>
              <button style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--inkm)' }} onClick={() => setModal(null)}>✕</button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ background: 'var(--bl)', padding: '1rem', fontSize: 12, color: 'var(--bm)', marginBottom: '1rem', lineHeight: 1.6 }}>
                Format attendu : colonnes <strong>code_sh, designation_clean, taux_droit, unite_norm</strong><br />
                Même structure que RAG_COMPLET.xlsx. Les codes existants seront mis à jour.
              </div>
              <div style={{ border: '2px dashed var(--rule)', padding: '2rem', textAlign: 'center', cursor: 'pointer', background: importFile ? 'var(--bl)' : 'transparent' }}
                onClick={() => document.getElementById('excel-upload')?.click()}>
                <input id="excel-upload" type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }}
                  onChange={e => setImportFile(e.target.files?.[0] || null)} />
                {importFile
                  ? <div style={{ fontSize: 13, color: 'var(--bd)', fontWeight: 500 }}>✓ {importFile.name}</div>
                  : <div style={{ fontSize: 13, color: 'var(--inkm)' }}>Cliquez pour sélectionner un fichier .xlsx ou .csv</div>}
              </div>
              {importProgress && (
                <div style={{ marginTop: '1rem', fontSize: 12, color: 'var(--inks)', padding: '.75rem', background: 'var(--bl)' }}>
                  {importProgress}
                </div>
              )}
            </div>
            <div style={{ padding: '1rem 1.5rem', borderTop: '.5px solid var(--rule)', display: 'flex', justifyContent: 'flex-end', gap: '.75rem' }}>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn btn-primary" disabled={!importFile}
                onClick={() => setImportProgress('Pour importer, utilisez le script import_supabase_v3.py avec votre nouveau fichier. L\'import via navigateur sera disponible en Phase 3.')}>
                Lancer l'import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', background: 'var(--bd)', color: 'white', padding: '.7rem 1.2rem', fontSize: 13, zIndex: 999 }}>
          {toast}
        </div>
      )}
    </AdminLayout>
  )
}
