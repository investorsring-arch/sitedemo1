import Head from 'next/head'
import { useState, useEffect, useCallback } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'

// Migration de /public/lexique/index.html → composant React natif
// Utilise le client Supabase centralisé (lib/supabase.ts)
// Table : glossaire_douanier (colonnes : titre, definition, categorie)

interface GlossaireItem {
  id: number
  titre: string
  definition: string
  categorie?: string
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const CATEGORIES = [
  { value: '', label: 'Toutes les catégories' },
  { value: 'accord', label: 'Accords commerciaux' },
  { value: 'tarif', label: 'Tarifs & Droits' },
  { value: 'operation', label: 'Opérations douanières' },
]

export default function Lexique() {
  const [items, setItems] = useState<GlossaireItem[]>([])
  const [filtered, setFiltered] = useState<GlossaireItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [categorie, setCategorie] = useState('')
  const [lettre, setLettre] = useState('')
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  // Chargement Supabase
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('glossaire_douanier')
          .select('*')
          .order('titre', { ascending: true })
        if (error) throw error
        setItems(data || [])
        setFiltered(data || [])
      } catch (err: any) {
        console.error('Lexique Supabase:', err)
        setError('Impossible de charger le lexique. Vérifiez votre connexion.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Filtrage
  const applyFilters = useCallback((s: string, l: string, c: string, source: GlossaireItem[]) => {
    let res = source
    if (s.trim()) {
      const t = s.toLowerCase()
      res = res.filter(i => i.titre.toLowerCase().includes(t) || i.definition.toLowerCase().includes(t))
    }
    if (l) {
      res = res.filter(i => i.titre.charAt(0).toUpperCase() === l)
    }
    if (c) {
      res = res.filter(i => i.categorie === c)
    }
    setFiltered(res)
    setExpanded(new Set())
  }, [])

  useEffect(() => { applyFilters(search, lettre, categorie, items) }, [search, lettre, categorie, items, applyFilters])

  const handleReset = () => { setSearch(''); setLettre(''); setCategorie(''); setExpanded(new Set()) }

  const toggleExpand = (id: number) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <>
      <Head>
        <title>Lexique Douanier — Douane.ia</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />
      </Head>
      <Layout>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", background:'linear-gradient(135deg,#f8f6f1 0%,#efefeb 100%)', color:'#2c3e50', minHeight:'100vh', padding:20 }}>
          <div style={{ maxWidth:1000, margin:'0 auto' }}>

            {/* Header */}
            <header style={{ background:'linear-gradient(135deg,#1a3a52 0%,#0f2438 100%)', color:'white', padding:'50px 40px', textAlign:'center', borderRadius:15, marginBottom:40, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 20% 50%,rgba(212,175,55,.1) 0%,transparent 50%)', pointerEvents:'none' }} />
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'3em', marginBottom:8, position:'relative', letterSpacing:'-1px' }}>
                📚 Lexique <span style={{ color:'#f4d03f' }}>Douanier</span>
              </h1>
              <p style={{ fontSize:'1.1em', opacity:.9, position:'relative' }}>
                Glossaire officiel des termes douaniers internationaux
              </p>
              {!loading && !error && (
                <div style={{ marginTop:12, fontSize:'0.9em', opacity:.7 }}>
                  {items.length} termes disponibles
                </div>
              )}
            </header>

            {/* Recherche */}
            <div style={{ background:'white', padding:30, borderRadius:12, marginBottom:30, boxShadow:'0 8px 24px rgba(0,0,0,.08)', borderTop:'3px solid #d4af37' }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.6em', color:'#1a3a52', marginBottom:18 }}>Rechercher</h2>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
                {/* Mot-clé */}
                <div>
                  <label style={{ display:'block', fontWeight:600, color:'#2c3e50', marginBottom:6, fontSize:'.9em', textTransform:'uppercase', letterSpacing:'.5px' }}>
                    🔍 Par mot-clé
                  </label>
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Ex : tarif, douane, commerce…"
                    style={{ width:'100%', padding:'10px 14px', border:'2px solid #e8e3dd', borderRadius:6, fontFamily:"'Cormorant Garamond',serif", fontSize:'1em', color:'#2c3e50', outline:'none', boxSizing:'border-box', transition:'border-color .2s' }}
                    onFocus={e => (e.target.style.borderColor = '#d4af37')}
                    onBlur={e => (e.target.style.borderColor = '#e8e3dd')}
                  />
                </div>
                {/* Catégorie */}
                <div>
                  <label style={{ display:'block', fontWeight:600, color:'#2c3e50', marginBottom:6, fontSize:'.9em', textTransform:'uppercase', letterSpacing:'.5px' }}>
                    📋 Par catégorie
                  </label>
                  <select
                    value={categorie}
                    onChange={e => setCategorie(e.target.value)}
                    style={{ width:'100%', padding:'10px 14px', border:'2px solid #e8e3dd', borderRadius:6, fontFamily:"'Cormorant Garamond',serif", fontSize:'1em', color:'#2c3e50', outline:'none', cursor:'pointer' }}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Alphabet */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontWeight:600, color:'#2c3e50', marginBottom:10, textTransform:'uppercase', fontSize:'.85em', letterSpacing:'.5px' }}>
                  Ou parcourir par lettre
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(38px,1fr))', gap:6 }}>
                  {ALPHABET.map(l => (
                    <button
                      key={l}
                      onClick={() => setLettre(lettre === l ? '' : l)}
                      style={{
                        aspectRatio:'1', border:`2px solid ${lettre === l ? '#1a3a52' : '#e8e3dd'}`,
                        background: lettre === l ? '#1a3a52' : 'white',
                        color: lettre === l ? 'white' : '#2c3e50',
                        borderRadius:6, cursor:'pointer', fontWeight:600, fontSize:'.9em',
                        fontFamily:"'Playfair Display',serif", display:'flex', alignItems:'center', justifyContent:'center',
                        transition:'all .2s', boxShadow: lettre === l ? '0 4px 12px rgba(26,58,82,.3)' : 'none',
                      }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleReset}
                style={{ padding:'10px 24px', background:'#1a3a52', color:'white', border:'none', borderRadius:6, fontFamily:"'Cormorant Garamond',serif", fontSize:'1em', cursor:'pointer', fontWeight:600, transition:'all .2s' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = '#d4af37'; (e.target as HTMLElement).style.color = '#1a3a52' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = '#1a3a52'; (e.target as HTMLElement).style.color = 'white' }}>
                🔄 Réinitialiser
              </button>
            </div>

            {/* Résultats */}
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, paddingBottom:16, borderBottom:'2px solid #e8e3dd' }}>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.8em', color:'#1a3a52' }}>Résultats</h2>
                <div style={{ background:'rgba(212,175,55,.15)', color:'#1a3a52', padding:'6px 14px', borderRadius:20, fontWeight:600, fontSize:'.9em' }}>
                  {loading ? 'Chargement…' : `${filtered.length} résultat${filtered.length > 1 ? 's' : ''}`}
                </div>
              </div>

              {/* États */}
              {loading && (
                <div style={{ textAlign:'center', padding:'50px 0' }}>
                  <div style={{ width:48, height:48, margin:'0 auto 16px', border:'4px solid #e8e3dd', borderTopColor:'#d4af37', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
                  <p style={{ color:'#7f8c8d' }}>Chargement du glossaire…</p>
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
              )}

              {!loading && error && (
                <div style={{ textAlign:'center', padding:'60px 30px', background:'white', borderRadius:12, border:'2px solid #f0b0a8' }}>
                  <div style={{ fontSize:'2em', marginBottom:12 }}>⚠️</div>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", color:'#c0392b', marginBottom:8 }}>Erreur de chargement</h3>
                  <p style={{ color:'#7f8c8d' }}>{error}</p>
                </div>
              )}

              {!loading && !error && filtered.length === 0 && (
                <div style={{ textAlign:'center', padding:'70px 30px', background:'white', borderRadius:12, border:'2px solid #e8e3dd' }}>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.6em', color:'#1a3a52', marginBottom:10 }}>Aucun résultat</h3>
                  <p style={{ color:'#7f8c8d', fontSize:'1.05em' }}>Essayez une autre recherche ou modifiez vos filtres</p>
                </div>
              )}

              {!loading && !error && filtered.length > 0 && (
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {filtered.map(item => {
                    const open = expanded.has(item.id)
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleExpand(item.id)}
                        style={{
                          background:'white', border:`2px solid ${open ? '#d4af37' : '#e8e3dd'}`,
                          borderRadius:8, overflow:'hidden', cursor:'pointer',
                          boxShadow: open ? '0 8px 20px rgba(212,175,55,.1)' : 'none',
                          transition:'all .3s',
                        }}>
                        {/* En-tête */}
                        <div style={{
                          padding:'16px 22px',
                          background: open ? 'linear-gradient(90deg,rgba(212,175,55,.1) 0%,transparent 100%)' : 'linear-gradient(90deg,rgba(26,58,82,.02) 0%,transparent 100%)',
                          display:'flex', justifyContent:'space-between', alignItems:'center',
                          borderBottom: open ? '2px solid #d4af37' : 'none',
                        }}>
                          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.25em', color:'#1a3a52', margin:0, fontWeight:700 }}>
                            {item.titre}
                          </h3>
                          <span style={{ color:'#d4af37', fontSize:'1.2em', transition:'transform .3s', transform: open ? 'rotate(180deg)' : 'none', flexShrink:0, marginLeft:12 }}>▼</span>
                        </div>
                        {/* Définition */}
                        {open && (
                          <div style={{ padding:'18px 22px 22px', fontSize:'1.05em', lineHeight:1.8, color:'#7f8c8d' }}>
                            {item.definition}
                            {item.categorie && (
                              <div style={{ marginTop:12 }}>
                                <span style={{ fontSize:'.8em', padding:'3px 10px', background:'rgba(212,175,55,.15)', color:'#1a3a52', borderRadius:20, fontWeight:600 }}>
                                  {CATEGORIES.find(c => c.value === item.categorie)?.label || item.categorie}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <footer style={{ textAlign:'center', padding:28, color:'#7f8c8d', marginTop:50, borderTop:'1px solid #e8e3dd', fontSize:'.95em' }}>
              © 2026 Lexique Douanier Officiel — Douane.ia · Tous droits réservés
            </footer>
          </div>
        </div>
      </Layout>
    </>
  )
}
