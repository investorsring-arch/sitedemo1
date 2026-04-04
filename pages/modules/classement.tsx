import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import ModuleLayout from '../../components/ModuleLayout'

interface Tarif {
  code_sh: string
  chapitre: string
  designation_clean: string
  taux_droit: number | null
  taux_raw: string | null
  unite_norm: string | null
  est_hierarchique: boolean
  est_feuille: boolean
}

// ===== LISTE COMPLÈTE DES 97 CHAPITRES =====
const CHAPITRES = [
  { code: '', label: 'Tous les chapitres' },
  { code: '01', label: '01 — Animaux vivants' },
  { code: '02', label: '02 — Viandes et abats comestibles' },
  { code: '03', label: '03 — Poissons et crustacés' },
  { code: '04', label: '04 — Lait, œufs, miel' },
  { code: '05', label: '05 — Autres produits d\'origine animale' },
  { code: '06', label: '06 — Plantes vivantes et fleurs' },
  { code: '07', label: '07 — Légumes' },
  { code: '08', label: '08 — Fruits comestibles' },
  { code: '09', label: '09 — Café, thé, cacao, épices' },
  { code: '10', label: '10 — Céréales' },
  { code: '11', label: '11 — Produits de la minoterie' },
  { code: '12', label: '12 — Graines et fruits oléagineux' },
  { code: '13', label: '13 — Gommes, résines, extraits végétaux' },
  { code: '14', label: '14 — Matières à tresser' },
  { code: '15', label: '15 — Graisses et huiles animales/végétales' },
  { code: '16', label: '16 — Viandes et poissons transformés' },
  { code: '17', label: '17 — Sucres et sucreries' },
  { code: '18', label: '18 — Cacao et préparations' },
  { code: '19', label: '19 — Produits de la boulangerie' },
  { code: '20', label: '20 — Légumes, fruits transformés' },
  { code: '21', label: '21 — Préparations alimentaires diverses' },
  { code: '22', label: '22 — Boissons, vinaigres' },
  { code: '23', label: '23 — Résidus alimentaires' },
  { code: '24', label: '24 — Tabacs et substituts' },
  { code: '25', label: '25 — Sel, souffre, chaux, ciment' },
  { code: '26', label: '26 — Minerais, scories, cendres' },
  { code: '27', label: '27 — Combustibles minéraux, huiles' },
  { code: '28', label: '28 — Produits chimiques inorganiques' },
  { code: '29', label: '29 — Produits chimiques organiques' },
  { code: '30', label: '30 — Produits pharmaceutiques' },
  { code: '31', label: '31 — Engrais' },
  { code: '32', label: '32 — Extraits tannants, colorants' },
  { code: '33', label: '33 — Huiles essentielles, parfums' },
  { code: '34', label: '34 — Savons, détergents, cires' },
  { code: '35', label: '35 — Matières protéiques, colles' },
  { code: '36', label: '36 — Poudres de projection, feux' },
  { code: '37', label: '37 — Produits photographiques' },
  { code: '38', label: '38 — Produits chimiques divers' },
  { code: '39', label: '39 — Matières plastiques' },
  { code: '40', label: '40 — Caoutchouc et ouvrages' },
  { code: '41', label: '41 — Peaux et cuirs' },
  { code: '42', label: '42 — Ouvrages en cuir' },
  { code: '43', label: '43 — Fourrures et pelleteries' },
  { code: '44', label: '44 — Bois et ouvrages en bois' },
  { code: '45', label: '45 — Liège et ouvrages en liège' },
  { code: '46', label: '46 — Ouvrages en paille, alfa, jonc' },
  { code: '47', label: '47 — Pâtes de bois, papier' },
  { code: '48', label: '48 — Papier et carton' },
  { code: '49', label: '49 — Livres et imprimés' },
  { code: '50', label: '50 — Soie' },
  { code: '51', label: '51 — Laine et poils fins' },
  { code: '52', label: '52 — Coton' },
  { code: '53', label: '53 — Fibres textiles végétales' },
  { code: '54', label: '54 — Filés, fils, cordes synthétiques' },
  { code: '55', label: '55 — Filés, fils de coton' },
  { code: '56', label: '56 — Fils, cordes de matières textiles' },
  { code: '57', label: '57 — Tapis et couvertures' },
  { code: '58', label: '58 — Tissus spéciaux, dentelle' },
  { code: '59', label: '59 — Tissus imprégnés, enduits' },
  { code: '60', label: '60 — Tissus de velours, chaîne' },
  { code: '61', label: '61 — Vêtements et accessoires' },
  { code: '62', label: '62 — Vêtements confectionnés' },
  { code: '63', label: '63 — Autres ouvrages textiles' },
  { code: '64', label: '64 — Chaussures' },
  { code: '65', label: '65 — Chapeaux et coiffures' },
  { code: '66', label: '66 — Parapluies et parasols' },
  { code: '67', label: '67 — Plumes, duvet, fleurs' },
  { code: '68', label: '68 — Pierre, plâtre, ciment' },
  { code: '69', label: '69 — Produits céramiques' },
  { code: '70', label: '70 — Verre et ouvrages en verre' },
  { code: '71', label: '71 — Perles, métaux précieux' },
  { code: '72', label: '72 — Fer et acier' },
  { code: '73', label: '73 — Ouvrages en fer ou acier' },
  { code: '74', label: '74 — Cuivre et ouvrages' },
  { code: '75', label: '75 — Nickel et ouvrages' },
  { code: '76', label: '76 — Aluminium et ouvrages' },
  { code: '77', label: '77 — Métaux précieux non ferreux' },
  { code: '78', label: '78 — Plomb et ouvrages' },
  { code: '79', label: '79 — Zinc et ouvrages' },
  { code: '80', label: '80 — Étain et ouvrages' },
  { code: '81', label: '81 — Autres métaux communs' },
  { code: '82', label: '82 — Outils et articles en métaux' },
  { code: '83', label: '83 — Ouvrages divers en métaux' },
  { code: '84', label: '84 — Réacteurs nucléaires, machines' },
  { code: '85', label: '85 — Machines électriques et appareils' },
  { code: '86', label: '86 — Matériel de transport ferroviaire' },
  { code: '87', label: '87 — Véhicules automobiles' },
  { code: '88', label: '88 — Aéronefs et engins spatiaux' },
  { code: '89', label: '89 — Navires et structures flottantes' },
  { code: '90', label: '90 — Instruments optiques, médicaux' },
  { code: '91', label: '91 — Montres, horlogerie' },
  { code: '92', label: '92 — Instruments de musique' },
  { code: '93', label: '93 — Armes et munitions' },
  { code: '94', label: '94 — Meubles, literie' },
  { code: '95', label: '95 — Jouets, jeux, articles de sport' },
  { code: '96', label: '96 — Articles divers' },
  { code: '97', label: '97 — Objets d\'art, antiquités' },
]

const PAGE_SIZE = 30

export default function Classement() {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [chapitre, setChapitre] = useState('')
  const [results, setResults] = useState<Tarif[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [searched, setSearched] = useState(false)
  const [stats, setStats] = useState({ total: 0, withTaux: 0 })

  // Load stats on mount
  useEffect(() => {
    async function loadStats() {
      const [{ count: total }, { count: withTaux }] = await Promise.all([
        supabase.from('tarifs').select('*', { count: 'exact', head: true }),
        supabase.from('tarifs').select('*', { count: 'exact', head: true }).not('taux_droit', 'is', null),
      ])
      setStats({ total: total || 0, withTaux: withTaux || 0 })
    }
    loadStats()
  }, [])

  const search = useCallback(async (newPage = 0) => {
    if (!q.trim() && !chapitre) return
    setLoading(true)
    setSearched(true)

    const from = newPage * PAGE_SIZE
    const to   = from + PAGE_SIZE - 1

    let query = supabase
      .from('tarifs')
      .select('code_sh,chapitre,designation_clean,taux_droit,taux_raw,unite_norm,est_hierarchique,est_feuille', { count: 'exact' })
      .order('code_sh', { ascending: true })
      .range(from, to)

    // Search by SH code prefix
    if (/^\d+$/.test(q.trim())) {
      query = query.like('code_sh', `${q.trim()}%`)
    }
    // Search by keyword in designation
    else if (q.trim().length >= 2) {
      query = query.ilike('designation_clean', `%${q.trim()}%`)
    }

    // Filter by chapitre
    if (chapitre) {
      query = query.eq('chapitre', chapitre)
    }

    const { data, count, error } = await query

    if (error) {
      console.error('Search error:', error)
    } else {
      setResults(data || [])
      setTotal(count || 0)
      setPage(newPage)
    }

    setLoading(false)
  }, [q, chapitre])

  // Debounced search on input change
  useEffect(() => {
    if (!q && !chapitre) return
    const t = setTimeout(() => search(0), 400)
    return () => clearTimeout(t)
  }, [q, chapitre])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <ModuleLayout
      kicker="MODULE 05"
      title="Décisions de Classement"
      sub="Recherche dans les codes tarifaires SH du tarif douanier marocain 2025.">

      {/* STATS */}
      <div className="info-grid">
        <div className="istat">
          <div className="istat-n">{stats.total.toLocaleString('fr-MA')}</div>
          <div className="istat-l">Codes SH indexés</div>
        </div>
        <div className="istat">
          <div className="istat-n">{stats.withTaux.toLocaleString('fr-MA')}</div>
          <div className="istat-l">Codes avec taux de droit</div>
        </div>
        <div className="istat">
          <div className="istat-n">97</div>
          <div className="istat-l">Chapitres couverts</div>
        </div>
      </div>

      {/* SEARCH */}
      <div style={{ display: 'flex', gap: '.75rem', margin: '1.5rem 0', flexWrap: 'wrap' }}>
        <input
          className="search-input"
          style={{ flex: 2, minWidth: '200px' }}
          placeholder="Code SH (ex: 8703) ou mot-clé (ex: voiture, textile, acier…)"
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search(0)}
        />
        <select
          className="form-select"
          style={{ flex: 1, minWidth: '180px', maxWidth: '280px' }}
          value={chapitre}
          onChange={e => setChapitre(e.target.value)}>
          {CHAPITRES.map(c => (
            <option key={c.code} value={c.code}>{c.label}</option>
          ))}
        </select>
        <button
          className="btn btn-primary"
          onClick={() => search(0)}
          disabled={loading}>
          {loading ? 'Recherche…' : 'Rechercher'}
        </button>
      </div>

      {/* PLACEHOLDER */}
      {!searched && (
        <div style={{ color: 'var(--inkm)', fontSize: '13px', padding: '2rem 0', textAlign: 'center', border: '.5px solid var(--rule)' }}>
          Saisissez un code SH ou un mot-clé pour rechercher dans le tarif douanier marocain 2025.
        </div>
      )}

      {/* RESULTS */}
      {searched && (
        <>
          <div style={{ fontSize: '12px', color: 'var(--inkm)', marginBottom: '.75rem' }}>
            {loading
              ? 'Recherche en cours…'
              : `${total.toLocaleString('fr-MA')} résultat${total > 1 ? 's' : ''} — page ${page + 1}/${totalPages || 1}`}
          </div>

          {results.length > 0 && (
            <>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '120px' }}>Code SH</th>
                    <th style={{ width: '50px' }}>Chap.</th>
                    <th>Désignation</th>
                    <th style={{ width: '80px' }}>Taux</th>
                    <th style={{ width: '60px' }}>Unité</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(r => (
                    <tr
                      key={r.code_sh}
                      style={r.est_hierarchique ? { background: 'var(--bl)', opacity: .8 } : {}}>
                      <td style={{ fontFamily: 'monospace', fontWeight: r.est_feuille ? 500 : 400, fontSize: '12px' }}>
                        {r.code_sh}
                      </td>
                      <td style={{ fontSize: '11px', color: 'var(--inkm)' }}>{r.chapitre}</td>
                      <td style={{ fontSize: '12px', fontWeight: r.est_hierarchique ? 500 : 400 }}>
                        {r.designation_clean}
                      </td>
                      <td>
                        {r.taux_droit !== null
                          ? <span className="badge bb">{r.taux_droit}%</span>
                          : <span style={{ color: 'var(--inkm)', fontSize: '11px' }}>—</span>}
                      </td>
                      <td style={{ fontSize: '11px', color: 'var(--inkm)' }}>
                        {r.unite_norm || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', gap: '.75rem', marginTop: '1rem', alignItems: 'center' }}>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={page === 0 || loading}
                    onClick={() => search(page - 1)}>
                    ← Précédent
                  </button>
                  <span style={{ fontSize: '12px', color: 'var(--inkm)', flex: 1, textAlign: 'center' }}>
                    Page {page + 1} / {totalPages} &nbsp;·&nbsp; {total.toLocaleString('fr-MA')} résultats
                  </span>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={page >= totalPages - 1 || loading}
                    onClick={() => search(page + 1)}>
                    Suivant →
                  </button>
                </div>
              )}
            </>
          )}

          {results.length === 0 && !loading && (
            <div style={{ color: 'var(--inkm)', padding: '2rem', textAlign: 'center', border: '.5px solid var(--rule)' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: 'var(--bd)', marginBottom: '.5rem' }}>
                Aucun résultat
              </div>
              Essayez un code SH différent ou un autre mot-clé.
            </div>
          )}
        </>
      )}
    </ModuleLayout>
  )
}
