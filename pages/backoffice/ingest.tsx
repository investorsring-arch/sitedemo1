import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import BackofficeLayout from '../../components/BackofficeLayout'

// Reprend pages/admin/ingest.tsx — déplacé dans /backoffice/
// — protégé par sessionStorage bo_auth
// — wrappé dans BackofficeLayout au lieu d'un layout admin

interface IngestResult {
  fichier: string
  status: 'success' | 'error' | 'skipped'
  numero?: string
  chunksInserted?: number
  error?: string
}

interface IngestResponse {
  summary: { total: number; success: number; skipped: number; errors: number }
  results: IngestResult[]
}

export default function BackofficeIngest() {
  const router = useRouter()
  const [auth, setAuth]         = useState(false)
  const [files, setFiles]       = useState<File[]>([])
  const [loading, setLoading]   = useState(false)
  const [response, setResponse] = useState<IngestResponse | null>(null)
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('bo_auth') !== '1') {
        router.replace('/backoffice')
      } else {
        setAuth(true)
      }
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = Array.from(e.dataTransfer.files).filter(f =>
      f.name.toLowerCase().endsWith('.pdf')
    )
    setFiles(p => [...p, ...dropped].slice(0, 20))
  }, [])

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    setFiles(p => [...p, ...selected].slice(0, 20))
  }

  const removeFile = (idx: number) =>
    setFiles(p => p.filter((_, i) => i !== idx))

  const handleUpload = async () => {
    if (!files.length) return
    setLoading(true)
    setResponse(null)
    const form = new FormData()
    files.forEach(f => form.append('files', f))
    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'x-ingest-key': 'une_cle_secrete_123' },
        body: form,
      })
      const data: IngestResponse = await res.json()
      setResponse(data)
      if (data.summary.errors === 0) setFiles([])
    } catch {
      alert('Erreur réseau — vérifiez le terminal.')
    } finally {
      setLoading(false)
    }
  }

  const totalSize = (files.reduce((s, f) => s + f.size, 0) / 1024 / 1024).toFixed(1)

  const statusColor = (r: IngestResult) =>
    r.status === 'success' ? { bg:'#f9fafb', border:'#e5e7eb' }
    : r.status === 'skipped' ? { bg:'#fffbeb', border:'#fcd34d' }
    : { bg:'#fff1f2', border:'#fecaca' }

  const statusIcon = (r: IngestResult) =>
    r.status === 'success' ? '✅' : r.status === 'skipped' ? '⏭' : '❌'

  const summaryBg = () =>
    !response ? '#f0fdf4'
    : response.summary.errors > 0 ? '#fff1f2'
    : response.summary.skipped === response.summary.total ? '#fffbeb'
    : '#f0fdf4'

  if (!auth) return null

  return (
    <>
      <Head><title>Ingestion Circulaires — Backoffice Douane.ia</title></Head>
      <BackofficeLayout title="Ingestion Circulaires ADII">

        <div style={{ maxWidth:700 }}>

          {/* Rappel */}
          <div style={{
            background:'#fffbeb', border:'1px solid #fcd34d',
            padding:'10px 14px', marginBottom:'1.5rem',
            fontSize:12, color:'#92400e', lineHeight:1.6,
          }}>
            <strong>Rappel :</strong> Maximum 15 PDFs par lot · Doublons détectés par numéro (titre uniquement) · Crédits Anthropic rechargés si nécessaire
          </div>

          {/* Zone dépôt */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => document.getElementById('file-input')?.click()}
            style={{
              border: `2px dashed ${dragOver ? '#C9A84C' : '#d1d5db'}`,
              borderRadius:8, padding:'2.5rem', textAlign:'center', cursor:'pointer',
              background: dragOver ? '#fffbeb' : '#fafafa',
              transition:'all .15s', marginBottom:'1rem',
            }}
          >
            <input id="file-input" type="file" accept=".pdf" multiple onChange={onFileInput} style={{ display:'none' }}/>
            <div style={{ fontSize:36, marginBottom:12 }}>📂</div>
            <div style={{ fontSize:15, fontWeight:500, color: dragOver ? '#92400e' : '#6b7280', marginBottom:6 }}>
              Déposez vos PDFs ici
            </div>
            <div style={{ fontSize:12, color:'#9ca3af' }}>
              ou cliquez pour sélectionner · max 20 fichiers · PDF uniquement
            </div>
          </div>

          {/* Liste fichiers */}
          {files.length > 0 && (
            <div style={{ marginBottom:'1.5rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                <span style={{ fontSize:12, color:'#6b7280' }}>
                  {files.length} fichier{files.length > 1 ? 's' : ''} · {totalSize} MB
                </span>
                <button onClick={() => setFiles([])} style={{ fontSize:11, color:'#ef4444', background:'none', border:'none', cursor:'pointer' }}>
                  Tout supprimer
                </button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {files.map((f, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', background:'white', border:'1px solid #e5e7eb', borderRadius:4 }}>
                    <span>📄</span>
                    <span style={{ flex:1, fontSize:12, color:'#374151', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.name}</span>
                    <span style={{ fontSize:11, color:'#9ca3af', flexShrink:0 }}>{(f.size / 1024).toFixed(0)} KB</span>
                    <button onClick={() => removeFile(i)} style={{ color:'#9ca3af', fontSize:12, background:'none', border:'none', cursor:'pointer', padding:'0 4px' }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bouton lancement */}
          <button
            onClick={handleUpload}
            disabled={loading || files.length === 0}
            style={{
              width:'100%', padding:'14px', marginBottom:'2rem', borderRadius:6,
              background: loading || files.length === 0 ? '#d1d5db' : 'var(--bd)',
              color: loading || files.length === 0 ? '#9ca3af' : 'white',
              fontSize:13, letterSpacing:'.04em', border:'none',
              cursor: loading || files.length === 0 ? 'not-allowed' : 'pointer',
              fontFamily:'inherit', fontWeight:500, transition:'all .15s',
            }}
          >
            {loading
              ? '⏳ Traitement en cours… (peut prendre plusieurs minutes)'
              : `🚀 Lancer l'ingestion — ${files.length} fichier${files.length > 1 ? 's' : ''}`}
          </button>

          {/* Résultats */}
          {response && (
            <div>
              {/* Résumé */}
              <div style={{
                background: summaryBg(), border:'1px solid #e5e7eb', borderRadius:6,
                padding:'1rem 1.25rem', marginBottom:'1rem',
                display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12,
              }}>
                {[
                  { label:'Total',    val:response.summary.total,   color:'#374151' },
                  { label:'Succès',   val:response.summary.success,  color:'#059669' },
                  { label:'Doublons', val:response.summary.skipped,  color:'#d97706' },
                  { label:'Erreurs',  val:response.summary.errors,   color:'#dc2626' },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign:'center' }}>
                    <div style={{ fontSize:28, fontWeight:700, color:s.color }}>{s.val}</div>
                    <div style={{ fontSize:11, color:'#6b7280', marginTop:2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Détail */}
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {response.results.map((r, i) => {
                  const c = statusColor(r)
                  return (
                    <div key={i} style={{ display:'grid', gridTemplateColumns:'28px 1fr auto', gap:10, alignItems:'center', padding:'10px 12px', background:c.bg, border:`1px solid ${c.border}`, borderRadius:4 }}>
                      <span style={{ fontSize:16, textAlign:'center' }}>{statusIcon(r)}</span>
                      <div>
                        <div style={{ fontSize:12, color:'#374151', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.fichier}</div>
                        {r.numero && <div style={{ fontSize:11, color:'#6b7280', marginTop:2 }}>N° {r.numero}</div>}
                        {r.error && <div style={{ fontSize:11, color:'#dc2626', marginTop:2 }}>{r.error}</div>}
                      </div>
                      {r.chunksInserted != null && (
                        <div style={{ textAlign:'right', flexShrink:0 }}>
                          <div style={{ fontSize:14, fontWeight:600, color:'#059669' }}>{r.chunksInserted}</div>
                          <div style={{ fontSize:10, color:'#9ca3af' }}>chunks</div>
                        </div>
                      )}
                      {r.status === 'skipped' && <div style={{ fontSize:11, color:'#d97706', flexShrink:0 }}>DOUBLON</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

      </BackofficeLayout>
    </>
  )
}
