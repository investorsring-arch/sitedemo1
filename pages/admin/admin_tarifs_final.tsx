import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { supabase } from '../../lib/supabase'

interface Tarif {
  id: number
  code_sh: string
  designation_clean: string
  taux_droit: number | null
  taux_raw: string | null
  unite_norm: string | null
  chapitre: string
  est_hierarchique: boolean
  est_feuille: boolean
}

const EMPTY: Omit<Tarif, 'id'> = {
  code_sh: '', designation_clean: '', taux_droit: null,
  taux_raw: '', unite_norm: '', chapitre: '',
  est_hierarchique: false, est_feuille: true
}

type ModalMode = 'edit' | 'new' | 'delete' | null

const UNITES = ['', 'kg', 'u', 'l', 'm2', 'm3', 'm', 'kwh', 'nombre']

export default function AdminTarifs() {
  const [q, setQ]             = useState('')
  const [results, setResults] = useState<Tarif[]>([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage]       = useState(0)
  const PAGE = 20

  const [modal, setModal]     = useState<ModalMode>(null)
  const [selected, setSelected] = useState<Tarif | null>(null)
  const [form, setForm]       = useState<Omit<Tarif,'id'>>({ ...EMPTY })
  const [saving, setSaving]   = useState(false)
  const [toast, setToast]     = useState('')
  const [toastType, setToastType] = useState<'ok'|'err'>('ok')

  const showToast = (msg: string, type: 'ok'|'err' = 'ok') => {
    setToast(msg); setToastType(type)
    setTimeout(() => setToast(''), 3500)
  }

  // ── Recherche ────────────────────────────────────────────────────────────────
  const search = useCallback(async (p = 0) => {
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)

    const from = p * PAGE
    const to   = from + PAGE - 1

    let query = supabase
      .from('tarifs')
      .select('id,code_sh,designation_clean,taux_droit,taux_raw,unite_norm,chapitre,est_hierarchique,est_feuille', { count: 'exact' })
      .order('code_sh', { ascending: true })
      .range(from, to)

    if (/^\d+$/.test(q.trim())) {
      query = query.like('code_sh', `${q.trim()}%`)
    } else {
      query = query.ilike('designation_clean', `%${q.trim()}%`)
    }

    const { data, count } = await query
    setResults(data || [])
    setTotal(count || 0)
    setPage(p)
    setLoading(false)
  }, [q])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') search(0)
  }

  // ── Ouvrir modals ────────────────────────────────────────────────────────────
  const openEdit = (t: Tarif) => {
    setSelected(t)
    setForm({ code_sh: t.code_sh, designation_clean: t.designation_clean,
      taux_droit: t.taux_droit, taux_raw: t.taux_raw || '',
      unite_norm: t.unite_norm || '', chapitre: t.chapitre,
      est_hierarchique: t.est_hierarchique, est_feuille: t.est_feuille })
    setModal('edit')
  }

  const openDuplicate = (t: Tarif) => {
    setSelected(null)
    setForm({ code_sh: '', designation_clean: t.designation_clean,
      taux_droit: t.taux_droit, taux_raw: t.taux_raw || '',
      unite_norm: t.unite_norm || '', chapitre: t.chapitre,
      est_hierarchique: t.est_hierarchique, est_feuille: t.est_feuille })
    setModal('new')
  }

  const openNew = () => {
    setSelected(null)
    setForm({ ...EMPTY })
    setModal('new')
  }

  const openDelete = (t: Tarif) => { setSelected(t); setModal('delete') }

  // ── Sauvegarder ──────────────────────────────────────────────────────────────
  const save = async () => {
    if (!form.code_sh.trim() || form.code_sh.trim().length !== 10) {
      showToast('Le code SH doit contenir exactement 10 chiffres', 'err'); return
    }
    if (!form.designation_clean.trim()) {
      showToast('La désignation est obligatoire', 'err'); return
    }
    setSaving(true)

    const payload = {
      code_sh:          form.code_sh.trim(),
      chapitre:         form.code_sh.trim().slice(0, 2),
      position:         form.code_sh.trim().slice(0, 4),
      sous_position:    form.code_sh.trim().slice(0, 6),
      subdivision:      form.code_sh.trim().slice(0, 8),
      code_complet:     form.code_sh.trim(),
      designation:      form.designation_clean.trim(),
      designation_clean: form.designation_clean.trim(),
      taux_droit:       form.taux_droit,
      taux_raw:         form.taux_raw || null,
      unite:            form.unite_norm || null,
      unite_norm:       form.unite_norm || null,
      est_hierarchique: form.est_hierarchique,
      est_feuille:      form.est_feuille,
      texte_rag: `Code SH: ${form.code_sh.trim()} | Désignation: ${form.designation_clean.trim()}` +
        (form.taux_droit != null ? ` | Taux: ${form.taux_droit}%` : '') +
        (form.unite_norm ? ` | Unité: ${form.unite_norm}` : ''),
    }

    if (modal === 'edit' && selected) {
      const { error } = await supabase.from('tarifs').update(payload).eq('id', selected.id)
      if (error) { showToast('Erreur : ' + error.message, 'err') }
      else { showToast(`✓ Code ${form.code_sh} mis à jour`); setModal(null); search(page) }
    } else {
      const { error } = await supabase.from('tarifs').insert(payload)
      if (error) { showToast('Erreur : ' + error.message, 'err') }
      else { showToast(`✓ Code ${form.code_sh} créé`); setModal(null); search(0) }
    }
    setSaving(false)
  }

  // ── Supprimer ────────────────────────────────────────────────────────────────
  const deleteTarif = async () => {
    if (!selected) return
    setSaving(true)
    const { error } = await supabase.from('tarifs').delete().eq('id', selected.id)
    if (error) { showToast('Erreur : ' + error.message, 'err') }
    else {
      showToast(`✓ Code ${selected.code_sh} supprimé`)
      setModal(null)
      setResults(r => r.filter(x => x.id !== selected.id))
      setTotal(t => t - 1)
    }
    setSaving(false)
  }

  // ── Helpers form ─────────────────────────────────────────────────────────────
  const F = (field: keyof Omit<Tarif,'id'>) => ({
    className: 'form-input' as string,
    value: (form[field] as string) ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  })

  const totalPages = Math.ceil(total / PAGE)

  // ── UI ───────────────────────────────────────────────────────────────────────
  return (
    <AdminLayout>

      {/* ── HEADER ── */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:'var(--bd)', marginBottom:4 }}>
            Codes SH & Tarifs
          </h1>
          <p style={{ fontSize:13, color:'var(--inkm)' }}>
            Recherchez une ligne du tarif pour la modifier, dupliquer ou supprimer
          </p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Nouvelle ligne</button>
      </div>

      {/* ── BARRE DE RECHERCHE ── */}
      <div style={{ display:'flex', gap:'.75rem', marginBottom:'1.5rem' }}>
        <input
          className="search-input"
          style={{ flex:1 }}
          placeholder="Code SH (ex: 8703) ou mot-clé (ex: voiture, acier, textile)…"
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={onKey}
        />
        <button className="btn btn-primary" onClick={() => search(0)} disabled={loading || !q.trim()}>
          {loading ? 'Recherche…' : 'Rechercher'}
        </button>
      </div>

      {/* ── PLACEHOLDER ── */}
      {!searched && (
        <div style={{ textAlign:'center', padding:'3rem 1rem', color:'var(--inkm)', border:'.5px solid var(--rule)' }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:'var(--bd)', marginBottom:8 }}>
            Recherchez une ligne du tarif
          </div>
          Entrez un code SH (partiel ou complet) ou un mot-clé de désignation,<br/>
          puis cliquez <strong>Rechercher</strong> ou appuyez sur <strong>Entrée</strong>.
        </div>
      )}

      {/* ── RÉSULTATS ── */}
      {searched && (
        <>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'.75rem' }}>
            <span style={{ fontSize:12, color:'var(--inkm)' }}>
              {loading ? 'Chargement…' : `${total.toLocaleString('fr')} ligne${total>1?'s':''} trouvée${total>1?'s':''}`}
            </span>
            {total > 0 && (
              <span style={{ fontSize:11, color:'var(--inkm)' }}>
                Page {page+1}/{totalPages} · {PAGE} lignes par page
              </span>
            )}
          </div>

          {results.length > 0 && (
            <>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width:120 }}>Nomenclature SH</th>
                    <th>Désignation</th>
                    <th style={{ width:90 }}>Taux droit</th>
                    <th style={{ width:70 }}>Unité</th>
                    <th style={{ width:130 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(r => (
                    <tr key={r.id}
                      style={r.est_hierarchique
                        ? { background:'var(--bl)', fontWeight:500 }
                        : {}}>

                      {/* Nomenclature */}
                      <td style={{ fontFamily:'monospace', fontSize:13, fontWeight:r.est_feuille?500:400, letterSpacing:'.03em' }}>
                        {r.code_sh}
                        {r.est_hierarchique && (
                          <div style={{ fontSize:10, color:'var(--inkm)', fontFamily:"'DM Sans',sans-serif", fontWeight:400, marginTop:2 }}>titre</div>
                        )}
                      </td>

                      {/* Désignation */}
                      <td style={{ fontSize:12, lineHeight:1.5 }}>
                        {r.designation_clean}
                      </td>

                      {/* Taux */}
                      <td style={{ textAlign:'center' }}>
                        {r.taux_droit != null
                          ? <span className="badge bb" style={{ fontFamily:'monospace' }}>{r.taux_droit}%</span>
                          : <span style={{ color:'var(--inkm)', fontSize:11 }}>—</span>}
                      </td>

                      {/* Unité */}
                      <td style={{ fontSize:11, color:'var(--inkm)', textAlign:'center' }}>
                        {r.unite_norm || '—'}
                      </td>

                      {/* Actions */}
                      <td>
                        <div style={{ display:'flex', gap:3 }}>
                          <button
                            title="Modifier"
                            className="btn btn-outline btn-sm"
                            onClick={() => openEdit(r)}>
                            Éditer
                          </button>
                          <button
                            title="Dupliquer pour réécriture"
                            style={{ padding:'3px 7px', fontSize:11, background:'transparent', border:'.5px solid var(--ba)', color:'var(--ba)', cursor:'pointer' }}
                            onClick={() => openDuplicate(r)}>
                            ⧉
                          </button>
                          <button
                            title="Supprimer"
                            style={{ padding:'3px 7px', fontSize:11, background:'transparent', border:'.5px solid var(--red)', color:'var(--red)', cursor:'pointer' }}
                            onClick={() => openDelete(r)}>
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display:'flex', gap:'.75rem', marginTop:'1rem', alignItems:'center' }}>
                  <button className="btn btn-outline btn-sm" disabled={page===0||loading} onClick={() => search(page-1)}>← Précédent</button>
                  <span style={{ fontSize:12, color:'var(--inkm)', flex:1, textAlign:'center' }}>
                    Page {page+1} / {totalPages}
                  </span>
                  <button className="btn btn-outline btn-sm" disabled={page>=totalPages-1||loading} onClick={() => search(page+1)}>Suivant →</button>
                </div>
              )}
            </>
          )}

          {results.length === 0 && !loading && (
            <div style={{ textAlign:'center', padding:'2.5rem', color:'var(--inkm)', border:'.5px solid var(--rule)' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:'var(--bd)', marginBottom:6 }}>Aucun résultat</div>
              Aucune ligne trouvée pour « {q} ».
              <div style={{ marginTop:'1rem' }}>
                <button className="btn btn-primary" onClick={openNew}>+ Créer une nouvelle ligne</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ══ MODAL ÉDITION / CRÉATION ══ */}
      {(modal==='edit' || modal==='new') && (
        <div
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}
          onClick={e => { if(e.target===e.currentTarget) setModal(null) }}>
          <div style={{ background:'var(--white)', width:560, maxHeight:'92vh', overflow:'auto', boxShadow:'0 8px 32px rgba(0,0,0,.18)' }}>

            {/* Header modal */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1.2rem 1.5rem', borderBottom:'.5px solid var(--rule)', background:'var(--bd)' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:'white' }}>
                {modal==='edit' ? `Modifier — ${selected?.code_sh}` : 'Nouvelle ligne tarifaire'}
              </div>
              <button style={{ background:'none', border:'none', fontSize:18, cursor:'pointer', color:'rgba(255,255,255,.7)' }} onClick={() => setModal(null)}>✕</button>
            </div>

            <div style={{ padding:'1.5rem' }}>

              {/* Nomenclature SH */}
              <div style={{ marginBottom:'1.25rem' }}>
                <label style={{ display:'block', fontSize:11, letterSpacing:'.08em', color:'var(--inks)', marginBottom:5 }}>
                  NOMENCLATURE SH <span style={{ color:'var(--red)' }}>*</span>
                  <span style={{ fontSize:10, color:'var(--inkm)', marginLeft:8, fontWeight:400, letterSpacing:0 }}>10 chiffres exactement</span>
                </label>
                <input
                  {...F('code_sh')}
                  placeholder="ex: 8703210010"
                  maxLength={10}
                  disabled={modal==='edit'}
                  style={{ fontFamily:'monospace', fontSize:16, letterSpacing:'.08em',
                    ...(modal==='edit' ? { background:'var(--bl)', color:'var(--inkm)' } : {}) }}
                />
                {form.code_sh.length > 0 && form.code_sh.length < 10 && (
                  <div style={{ fontSize:11, color:'var(--amber)', marginTop:4 }}>
                    {10 - form.code_sh.length} chiffre{10-form.code_sh.length>1?'s':''} manquant{10-form.code_sh.length>1?'s':''}
                  </div>
                )}
                {form.code_sh.length === 10 && (
                  <div style={{ fontSize:11, color:'var(--green)', marginTop:4 }}>
                    ✓ Chapitre {form.code_sh.slice(0,2)} · Position {form.code_sh.slice(0,4)} · Sous-position {form.code_sh.slice(0,6)}
                  </div>
                )}
              </div>

              {/* Désignation */}
              <div style={{ marginBottom:'1.25rem' }}>
                <label style={{ display:'block', fontSize:11, letterSpacing:'.08em', color:'var(--inks)', marginBottom:5 }}>
                  DÉSIGNATION <span style={{ color:'var(--red)' }}>*</span>
                </label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight:90, fontSize:13, lineHeight:1.6 }}
                  value={form.designation_clean}
                  onChange={e => setForm(f => ({ ...f, designation_clean: e.target.value }))}
                  placeholder="Description complète de la marchandise telle qu'elle apparaît dans le tarif ADII"
                />
              </div>

              {/* Taux + Unité */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.25rem' }}>
                <div>
                  <label style={{ display:'block', fontSize:11, letterSpacing:'.08em', color:'var(--inks)', marginBottom:5 }}>
                    TAUX DE DROIT (%)
                    <span style={{ fontSize:10, color:'var(--inkm)', marginLeft:6 }}>laisser vide si ligne titre</span>
                  </label>
                  <input
                    className="form-input"
                    type="number" min={0} max={500} step={0.5}
                    value={form.taux_droit ?? ''}
                    placeholder="ex: 2.5"
                    onChange={e => {
                      const v = e.target.value
                      setForm(f => ({
                        ...f,
                        taux_droit: v ? parseFloat(v) : null,
                        taux_raw: v || null,
                        est_hierarchique: !v,
                        est_feuille: !!v
                      }))
                    }}
                    style={{ fontFamily:'monospace', fontSize:15 }}
                  />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:11, letterSpacing:'.08em', color:'var(--inks)', marginBottom:5 }}>
                    UNITÉ DE MESURE
                  </label>
                  <select
                    className="form-select"
                    value={form.unite_norm || ''}
                    onChange={e => setForm(f => ({ ...f, unite_norm: e.target.value || null }))}>
                    <option value="">— Aucune —</option>
                    <option value="kg">kg — kilogramme</option>
                    <option value="u">u — unité</option>
                    <option value="l">l — litre</option>
                    <option value="m2">m² — mètre carré</option>
                    <option value="m3">m³ — mètre cube</option>
                    <option value="m">m — mètre</option>
                    <option value="kwh">kWh — kilowattheure</option>
                    <option value="nombre">nombre</option>
                  </select>
                </div>
              </div>

              {/* Aperçu */}
              {form.code_sh.length === 10 && form.designation_clean && (
                <div style={{ background:'var(--bl)', padding:'1rem', fontSize:12, color:'var(--bm)', lineHeight:1.7 }}>
                  <div style={{ fontSize:10, letterSpacing:'.1em', color:'var(--ba)', marginBottom:6 }}>APERÇU DE LA LIGNE</div>
                  <div style={{ display:'grid', gridTemplateColumns:'120px 1fr 80px 60px', gap:'0 1rem', fontFamily:'monospace', fontSize:12 }}>
                    <span style={{ fontWeight:600 }}>{form.code_sh}</span>
                    <span style={{ fontFamily:"'DM Sans',sans-serif" }}>{form.designation_clean}</span>
                    <span>{form.taux_droit != null ? `${form.taux_droit}%` : '—'}</span>
                    <span>{form.unite_norm || '—'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer modal */}
            <div style={{ padding:'1rem 1.5rem', borderTop:'.5px solid var(--rule)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize:11, color:'var(--inkm)' }}>
                {form.taux_droit == null
                  ? <span style={{ color:'var(--amber)' }}>⚠ Sans taux → ligne titre (hiérarchique)</span>
                  : <span style={{ color:'var(--green)' }}>✓ Ligne terminale avec taux</span>}
              </div>
              <div style={{ display:'flex', gap:'.75rem' }}>
                <button className="btn btn-outline" onClick={() => setModal(null)}>Annuler</button>
                <button
                  className="btn btn-primary"
                  onClick={save}
                  disabled={saving || !form.code_sh || form.code_sh.length!==10 || !form.designation_clean}>
                  {saving ? 'Enregistrement…' : modal==='edit' ? 'Sauvegarder les modifications' : 'Créer la ligne'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL SUPPRESSION ══ */}
      {modal==='delete' && selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'var(--white)', width:440, boxShadow:'0 8px 32px rgba(0,0,0,.18)' }}>
            <div style={{ padding:'1.2rem 1.5rem', borderBottom:'.5px solid var(--rule)', background:'#FEE2E2' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:'#991B1B' }}>Confirmer la suppression</div>
            </div>
            <div style={{ padding:'1.5rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'120px 1fr 80px 60px', gap:'0 1rem', padding:'1rem', background:'var(--bl)', fontFamily:'monospace', fontSize:12, marginBottom:'1rem' }}>
                <span style={{ fontWeight:600 }}>{selected.code_sh}</span>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12 }}>{selected.designation_clean}</span>
                <span>{selected.taux_droit != null ? `${selected.taux_droit}%` : '—'}</span>
                <span>{selected.unite_norm || '—'}</span>
              </div>
              <p style={{ fontSize:13, color:'var(--inks)', lineHeight:1.6 }}>
                Cette ligne sera <strong>définitivement supprimée</strong> de la base Supabase.<br/>
                <span style={{ color:'var(--red)', fontSize:12 }}>Cette action est irréversible.</span>
              </p>
            </div>
            <div style={{ padding:'1rem 1.5rem', borderTop:'.5px solid var(--rule)', display:'flex', justifyContent:'flex-end', gap:'.75rem' }}>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn btn-danger" onClick={deleteTarif} disabled={saving}>
                {saving ? 'Suppression…' : 'Supprimer définitivement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position:'fixed', bottom:'1.5rem', right:'1.5rem', zIndex:999,
          background: toastType==='ok' ? 'var(--bd)' : 'var(--red)',
          color:'white', padding:'.7rem 1.25rem', fontSize:13, letterSpacing:'.02em',
          boxShadow:'0 4px 16px rgba(0,0,0,.2)'
        }}>
          {toast}
        </div>
      )}

    </AdminLayout>
  )
}
