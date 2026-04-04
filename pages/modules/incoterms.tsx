import { useState, useMemo } from 'react'
import Layout from '../../components/Layout'

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const ELEMENTS = [
  { n: 'Emballage & conditionnement',       c: 'Préparation' },
  { n: "Chargement à l'usine",              c: 'Départ' },
  { n: 'Transport intérieur départ',        c: 'Départ' },
  { n: 'Formalités douanières export',      c: 'Export' },
  { n: 'Frais portuaires export',           c: 'Export' },
  { n: 'Chargement navire / véhicule',      c: 'Principal' },
  { n: 'Fret — transport principal',        c: 'Principal' },
  { n: 'Assurance transport',               c: 'Principal' },
  { n: 'Frais portuaires import',           c: 'Import' },
  { n: 'Formalités douanières import',      c: 'Import' },
  { n: "Transport intérieur arrivée",       c: 'Arrivée' },
  { n: 'Déchargement à destination',        c: 'Arrivée' },
]

type Resp = 'S' | 'B' | 'N'
type Mode = 'any' | 'sea'
type Grp  = 'e' | 'f' | 'c' | 'd'

interface IncotermData {
  n:      string
  grp:    Grp
  mode:   Mode
  tr:     number
  rpt:    string
  bf:     string
  sresp:  string[]
  bresp:  string[]
  resp:   Resp[]
  cexp:   'S' | 'B'
  cfrt:   'S' | 'B'
  cins:   'S' | 'B' | 'N'
  cimp:   'S' | 'B'
}

const INCS: Record<string, IncotermData> = {
  EXW: {
    n: 'Ex Works', grp: 'e', mode: 'any', tr: 3,
    rpt: "À l'usine du vendeur",
    bf: "Idéal pour une vente départ usine. L'acheteur maîtrise toute la chaîne logistique. Utilisé fréquemment entre groupes industriels ou lorsque l'acheteur dispose d'un réseau logistique propre.",
    sresp: ["Mettre la marchandise à disposition à l'usine", 'Fournir la facture commerciale', "Assister l'acheteur pour les formalités (à ses frais)"],
    bresp: ["Chargement à l'usine", 'Transport intérieur départ', 'Dédouanement export + import', 'Fret principal + assurance', 'Transport livraison finale'],
    resp:  ['S','N','B','B','B','B','B','B','B','B','B','B'],
    cexp: 'B', cfrt: 'B', cins: 'B', cimp: 'B',
  },
  FCA: {
    n: 'Free Carrier', grp: 'f', mode: 'any', tr: 30,
    rpt: "Remise au transporteur désigné par l'acheteur",
    bf: "Solution moderne recommandée par l'ICC pour le transport conteneurisé. Permet le crédit documentaire. Remplace avantageusement FOB dans de nombreux cas, notamment pour le conteneur FCL/LCL.",
    sresp: ["Emballage et chargement à l'usine", 'Transport intérieur jusqu\'au transporteur', 'Dédouanement export'],
    bresp: ['Fret principal', 'Assurance transport', 'Frais portuaires import', 'Dédouanement import', 'Livraison finale'],
    resp:  ['S','S','S','S','N','B','B','B','B','B','B','B'],
    cexp: 'S', cfrt: 'B', cins: 'B', cimp: 'B',
  },
  FAS: {
    n: 'Free Alongside Ship', grp: 'f', mode: 'sea', tr: 35,
    rpt: "Le long du navire, port d'embarquement",
    bf: "Utilisé pour marchandises en vrac (céréales, minerais, engrais) placées le long du navire. Peu adapté aux conteneurs standard. Courant dans le commerce de matières premières Maroc–Europe.",
    sresp: ["Emballage + transport jusqu'au port", 'Dédouanement export', 'Placement marchandise le long du navire'],
    bresp: ["Chargement à bord du navire", 'Fret maritime', 'Assurance', 'Dédouanement import + livraison'],
    resp:  ['S','S','S','S','S','N','B','B','B','B','B','B'],
    cexp: 'S', cfrt: 'B', cins: 'B', cimp: 'B',
  },
  FOB: {
    n: 'Free On Board', grp: 'f', mode: 'sea', tr: 42,
    rpt: "À bord du navire, port d'embarquement",
    bf: "Incoterm le plus utilisé au monde pour le commerce maritime (Maroc–Asie, Maroc–UE). À éviter pour le transport aérien (préférer FCA). Base de calcul fréquente pour les prix de négoce internationaux.",
    sresp: ["Emballage + chargement usine", 'Transport intérieur au port', 'Dédouanement export', "Chargement à bord du navire"],
    bresp: ['Fret maritime principal', 'Assurance transport', 'Frais portuaires import', 'Dédouanement import', 'Livraison finale'],
    resp:  ['S','S','S','S','S','S','B','B','B','B','B','B'],
    cexp: 'S', cfrt: 'B', cins: 'B', cimp: 'B',
  },
  CFR: {
    n: 'Cost & Freight', grp: 'c', mode: 'sea', tr: 42,
    rpt: "À bord du navire, port d'embarquement",
    bf: "Le vendeur paie le fret jusqu'au port de destination, mais le risque passe dès l'embarquement. L'acheteur doit impérativement souscrire une assurance. Courant dans les importations marocaines de céréales et sucre.",
    sresp: ["Tout jusqu'à l'embarquement (comme FOB)", 'Fret maritime jusqu\'au port de destination'],
    bresp: ['Assurance transport (obligatoire)', 'Frais portuaires import', 'Dédouanement import', 'Livraison finale'],
    resp:  ['S','S','S','S','S','S','S','N','B','B','B','B'],
    cexp: 'S', cfrt: 'S', cins: 'B', cimp: 'B',
  },
  CIF: {
    n: 'Cost, Insurance & Freight', grp: 'c', mode: 'sea', tr: 42,
    rpt: "À bord du navire, port d'embarquement",
    bf: "Comme CFR + assurance minimale (110% valeur CIF) à la charge du vendeur. Très utilisé dans les importations marocaines et la documentation bancaire. La valeur CIF est la base de calcul de la valeur en douane marocaine.",
    sresp: ["Tout jusqu'à l'embarquement (comme FOB)", 'Fret maritime + assurance minimale ICC C (110% valeur)'],
    bresp: ['Frais portuaires import', 'Dédouanement import', 'Transport livraison finale'],
    resp:  ['S','S','S','S','S','S','S','S','B','B','B','B'],
    cexp: 'S', cfrt: 'S', cins: 'S', cimp: 'B',
  },
  CPT: {
    n: 'Carriage Paid To', grp: 'c', mode: 'any', tr: 30,
    rpt: 'Remise au premier transporteur',
    bf: "Équivalent multimodal de CFR. Recommandé pour transport aérien, ferroviaire ou routier. Le risque passe dès la remise au premier transporteur, même si le vendeur paye le fret jusqu'à destination.",
    sresp: ["Emballage + chargement usine", 'Transport intérieur + dédouanement export', 'Fret principal jusqu\'à destination convenue'],
    bresp: ['Assurance (non obligatoire sous CPT)', 'Frais portuaires import', 'Dédouanement import', 'Livraison finale'],
    resp:  ['S','S','S','S','N','S','S','N','B','B','B','B'],
    cexp: 'S', cfrt: 'S', cins: 'B', cimp: 'B',
  },
  CIP: {
    n: 'Carriage & Insurance Paid To', grp: 'c', mode: 'any', tr: 30,
    rpt: 'Remise au premier transporteur',
    bf: "Comme CPT + assurance étendue (ICC A, 110% valeur). Recommandé pour marchandises de haute valeur ou transport aérien. Offre une meilleure couverture que CIF (assurance tous risques vs assurance minimale).",
    sresp: ["Emballage + chargement usine", 'Transport + dédouanement export', 'Fret principal + assurance étendue ICC A (110%)'],
    bresp: ['Frais portuaires import', 'Dédouanement import', 'Transport livraison finale'],
    resp:  ['S','S','S','S','N','S','S','S','B','B','B','B'],
    cexp: 'S', cfrt: 'S', cins: 'S', cimp: 'B',
  },
  DAP: {
    n: 'Delivered At Place', grp: 'd', mode: 'any', tr: 83,
    rpt: 'À destination, avant déchargement',
    bf: "Vendeur gère tout jusqu'à la destination, sauf le dédouanement import. Pratique pour les acheteurs qui maîtrisent leur propre dédouanement marocain. Courant dans les ventes e-commerce B2B et les livraisons door-to-door.",
    sresp: ['Tout le trajet jusqu\'à la destination convenue', 'Transport intérieur dans le pays de destination'],
    bresp: ['Déchargement à destination', 'Dédouanement import + droits et taxes'],
    resp:  ['S','S','S','S','S','S','S','S','S','B','S','B'],
    cexp: 'S', cfrt: 'S', cins: 'S', cimp: 'B',
  },
  DPU: {
    n: 'Delivered at Place Unloaded', grp: 'd', mode: 'any', tr: 88,
    rpt: 'À destination, après déchargement',
    bf: "Seul Incoterm où le vendeur assure le déchargement à destination. Idéal pour vrac ou marchandises nécessitant un équipement spécifique à l'arrivée (grue, chariot élévateur). Renommé de DAT en Incoterms 2020.",
    sresp: ['Tout le trajet jusqu\'à la destination', 'Déchargement de la marchandise à destination'],
    bresp: ['Dédouanement import + droits et taxes'],
    resp:  ['S','S','S','S','S','S','S','S','S','B','S','S'],
    cexp: 'S', cfrt: 'S', cins: 'S', cimp: 'B',
  },
  DDP: {
    n: 'Delivered Duty Paid', grp: 'd', mode: 'any', tr: 95,
    rpt: 'À destination, droits de douane acquittés',
    bf: "Maximum de responsabilité pour le vendeur. Le vendeur paie les droits d'importation et taxes dans le pays de l'acheteur (DI, TVA, TIC au Maroc). Utilisé dans les grands comptes et le e-commerce B2C.",
    sresp: ['Toute la chaîne logistique de bout en bout', 'Dédouanement import + droits et taxes marocains (DI, TVA, TIC)', 'Livraison finale à destination'],
    bresp: ['Déchargement à destination (si non convenu autrement)'],
    resp:  ['S','S','S','S','S','S','S','S','S','S','S','B'],
    cexp: 'S', cfrt: 'S', cins: 'S', cimp: 'S',
  },
}

const KEYS = Object.keys(INCS)
const KEY_IDX: Record<string, number> = {}
KEYS.forEach((k, i) => { KEY_IDX[k] = i })

const GROUPS: { id: Grp; label: string }[] = [
  { id: 'e', label: 'GROUPE E — DÉPART (obligation minimale vendeur)' },
  { id: 'f', label: 'GROUPE F — TRANSPORT PRINCIPAL NON PAYÉ' },
  { id: 'c', label: 'GROUPE C — TRANSPORT PRINCIPAL PAYÉ' },
  { id: 'd', label: 'GROUPE D — ARRIVÉE (obligation maximale vendeur)' },
]

const COST_ITEMS = [
  { lbl: "Valeur marchandise (prix EXW)",                 def: 500000 },
  { lbl: "Chargement usine + transport intérieur départ", def: 8000   },
  { lbl: "Formalités douane export + frais portuaires",   def: 5000   },
  { lbl: "Chargement navire / fret principal",            def: 14000  },
  { lbl: "Assurance transport",                           def: 3500   },
  { lbl: "Frais port import + dédouanement",              def: 18000  },
  { lbl: "Transport livraison finale",                    def: 6000   },
]

// Responsibility per cost item × incoterm [EXW,FCA,FAS,FOB,CFR,CIF,CPT,CIP,DAP,DPU,DDP]
const COST_RESP: Resp[][] = [
  ['S','S','S','S','S','S','S','S','S','S','S'],
  ['N','S','S','S','S','S','S','S','S','S','S'],
  ['N','S','S','S','S','S','S','S','S','S','S'],
  ['B','B','B','S','S','S','S','S','S','S','S'],
  ['B','B','B','B','B','S','B','S','S','S','S'],
  ['B','B','B','B','B','B','B','B','B','B','S'],
  ['B','B','B','B','B','B','B','B','S','S','S'],
]

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const fmtDH = (v: number) => Math.round(v).toLocaleString('fr-FR') + ' DH'

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function Chip({ r }: { r: Resp }) {
  if (r === 'S') return <span className="chip-s">V</span>
  if (r === 'B') return <span className="chip-b">A</span>
  return <span className="chip-n">—</span>
}

function CmpChip({ v }: { v: 'S' | 'B' | 'N' }) {
  if (v === 'S') return <span className="cmp-s">V</span>
  if (v === 'B') return <span className="cmp-b">A</span>
  return <span className="cmp-n">—</span>
}

// ─────────────────────────────────────────────────────────────────────────────
// TABS
// ─────────────────────────────────────────────────────────────────────────────

type Tab = 'detail' | 'costs' | 'compare'
type ModeFilter = 'all' | 'any' | 'sea'

function TabDetail() {
  const [cur,    setCur]    = useState<string>('FOB')
  const [modeF,  setModeF]  = useState<ModeFilter>('all')

  const d = INCS[cur]
  const sc = d.resp.filter(x => x === 'S').length
  const bc = d.resp.filter(x => x === 'B').length

  return (
    <div>
      {/* Mode filter */}
      <div className="mf">
        {(['all','any','sea'] as ModeFilter[]).map(m => (
          <button key={m} className={`mfb${modeF === m ? ' on' : ''}`} onClick={() => setModeF(m)}>
            {m === 'all' ? 'Tous (11)' : m === 'any' ? '🚛 Tous modes (7)' : '⚓ Maritime seul (4)'}
          </button>
        ))}
      </div>

      {/* Grouped selectors */}
      {GROUPS.map(g => {
        const keys = KEYS.filter(k => INCS[k].grp === g.id && (modeF === 'all' || INCS[k].mode === modeF))
        if (!keys.length) return null
        return (
          <div key={g.id}>
            <div className="grp-label">{g.label}</div>
            <div className="sel-row">
              {keys.map(k => (
                <button key={k} className={`sb${k === cur ? ' on' : ''}`} onClick={() => setCur(k)}>
                  {k}
                  <span className={`dot ${INCS[k].mode === 'sea' ? 'dot-sea' : 'dot-any'}`} />
                </button>
              ))}
            </div>
          </div>
        )
      })}

      {/* Hero cards */}
      <div className="hero">
        <div className="hc">
          <div className="hc-lbl">INCOTERM</div>
          <div className="hc-val">{cur} — {d.n}</div>
          <div className="hc-sub">Groupe {d.grp.toUpperCase()}</div>
        </div>
        <div className="hc">
          <div className="hc-lbl">POINT DE TRANSFERT</div>
          <div className="hc-val" style={{ fontSize: 13 }}>{d.rpt}</div>
          <div className="hc-sub">{d.mode === 'sea' ? '⚓ Maritime uniquement' : '🚛 Tous modes de transport'}</div>
        </div>
        <div className="hc">
          <div className="hc-lbl">RÉPARTITION</div>
          <div className="hc-val">{sc} vendeur · {bc} acheteur</div>
          <div className="hc-sub">Risque transféré à {d.tr}% du trajet</div>
        </div>
      </div>

      {/* Transfer bar */}
      <div className="bar-section">
        <div className="bar-lbl">TRANSFERT DES RISQUES — VENDEUR → ACHETEUR</div>
        <div className="bar-track">
          <div className="bar-s" style={{ width: `${d.tr}%` }}>{d.tr > 14 ? 'VENDEUR' : ''}</div>
          <div className="bar-sep" />
          <div className="bar-b" style={{ width: `${100 - d.tr - 0.3}%` }}>{100 - d.tr > 14 ? 'ACHETEUR' : ''}</div>
        </div>
      </div>

      {/* Best for */}
      <div className="bestfor">
        <strong>Recommandé pour :</strong> {d.bf}
      </div>

      {/* Responsibilities */}
      <div className="resp-2col">
        <div className="resp-box">
          <div className="rb-title rb-s">RESPONSABILITÉS VENDEUR</div>
          <ul className="rb-list">
            {d.sresp.map((r, i) => <li key={i} className="rb-s-li">→ {r}</li>)}
          </ul>
        </div>
        <div className="resp-box">
          <div className="rb-title rb-b">RESPONSABILITÉS ACHETEUR</div>
          <ul className="rb-list">
            {d.bresp.map((r, i) => <li key={i} className="rb-b-li">→ {r}</li>)}
          </ul>
        </div>
      </div>

      {/* Legend */}
      <div className="legend">
        <span><span className="chip-s">V</span> Vendeur (Seller)</span>
        <span><span className="chip-b">A</span> Acheteur (Buyer)</span>
        <span><span className="chip-n">—</span> Non applicable</span>
      </div>

      {/* Matrix table */}
      <table className="mt">
        <thead>
          <tr>
            <th>ÉLÉMENT</th>
            <th style={{ textAlign: 'center' }}>VENDEUR</th>
            <th style={{ textAlign: 'center' }}>ACHETEUR</th>
          </tr>
        </thead>
        <tbody>
          {ELEMENTS.map((el, i) => (
            <tr key={i}>
              <td>
                <div className="el-name">{el.n}</div>
                <div className="el-cat">{el.c}</div>
              </td>
              <td style={{ textAlign: 'center' }}><Chip r={d.resp[i] === 'S' ? 'S' : 'N'} /></td>
              <td style={{ textAlign: 'center' }}><Chip r={d.resp[i] === 'B' ? 'B' : 'N'} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TabCosts() {
  const [inc, setInc]       = useState<string>('FOB')
  const [vals, setVals]     = useState<number[]>(COST_ITEMS.map(c => c.def))

  const idx = KEY_IDX[inc]

  const rows = useMemo(() => {
    return COST_ITEMS.map((ci, i) => ({
      lbl: ci.lbl,
      v:   vals[i],
      r:   COST_RESP[i][idx],
    }))
  }, [inc, vals, idx])

  const sv = rows.filter(r => r.r === 'S').reduce((a, r) => a + r.v, 0)
  const bv = rows.filter(r => r.r === 'B').reduce((a, r) => a + r.v, 0)
  const tot = sv + bv

  return (
    <div>
      <div className="cost-header">
        <span className="cost-header-lbl">Incoterm :</span>
        <select value={inc} onChange={e => setInc(e.target.value)} className="cost-sel">
          {KEYS.map(k => <option key={k} value={k}>{k} — {INCS[k].n}</option>)}
        </select>
        <span className="cost-header-hint">Saisissez vos coûts en DH — la répartition vendeur / acheteur est calculée automatiquement.</span>
      </div>

      <div className="cost-fields">
        {COST_ITEMS.map((ci, i) => (
          <div key={i} className="cost-row">
            <span className="cost-lbl">{ci.lbl}</span>
            <div className="cost-inp-wrap">
              <input
                type="number"
                className="cost-inp"
                value={vals[i]}
                min={0}
                step={500}
                onChange={e => {
                  const next = [...vals]
                  next[i] = parseFloat(e.target.value) || 0
                  setVals(next)
                }}
              />
              <span className="cost-dh">DH</span>
            </div>
          </div>
        ))}
      </div>

      <div className="cost-result">
        <div className="cr-header">RÉPARTITION DES COÛTS — {inc}</div>
        {rows.map((row, i) => (
          <div key={i} className="cr-row">
            <span className="cr-lbl">{row.lbl}</span>
            {row.r === 'S' && <span className="who-s">VENDEUR</span>}
            {row.r === 'B' && <span className="who-b">ACHETEUR</span>}
            {row.r === 'N' && <span className="who-n">N/A</span>}
            <span className="cr-amt">{row.r !== 'N' ? fmtDH(row.v) : '—'}</span>
          </div>
        ))}
        <div className="cr-row cr-total">
          <span><strong>Total flux logistique</strong></span>
          <span />
          <strong className="cr-amt">{fmtDH(tot)}</strong>
        </div>
      </div>

      <div className="summary-2">
        <div className="sum-card">
          <div className="sum-lbl">CHARGE VENDEUR</div>
          <div className="sum-val sum-blue">{fmtDH(sv)}</div>
          <div className="sum-pct">{tot ? Math.round(sv / tot * 100) : 0}% du flux total</div>
        </div>
        <div className="sum-card">
          <div className="sum-lbl">CHARGE ACHETEUR</div>
          <div className="sum-val sum-green">{fmtDH(bv)}</div>
          <div className="sum-pct">{tot ? Math.round(bv / tot * 100) : 0}% du flux total</div>
        </div>
      </div>
    </div>
  )
}

function TabCompare() {
  return (
    <div>
      <p className="cmp-intro">
        Vue synthétique des 11 Incoterms sur les 4 critères clés. <span className="tag-s">V</span> = Vendeur · <span className="tag-b">A</span> = Acheteur
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table className="cmp-t">
          <thead>
            <tr>
              <th>INCOTERM</th>
              <th>POINT TRANSFERT RISQUE</th>
              <th>DOUANE EXPORT</th>
              <th>FRET</th>
              <th>ASSURANCE</th>
              <th>DOUANE IMPORT</th>
              <th>MODE</th>
            </tr>
          </thead>
          <tbody>
            {KEYS.map(k => {
              const d = INCS[k]
              return (
                <tr key={k}>
                  <td>
                    <span className="cmp-key">{k}</span>
                    <br />
                    <span className="cmp-name">{d.n}</span>
                  </td>
                  <td className="cmp-rpt">{d.rpt}</td>
                  <td style={{ textAlign: 'center' }}><CmpChip v={d.cexp} /></td>
                  <td style={{ textAlign: 'center' }}><CmpChip v={d.cfrt} /></td>
                  <td style={{ textAlign: 'center' }}><CmpChip v={d.cins as any} /></td>
                  <td style={{ textAlign: 'center' }}><CmpChip v={d.cimp} /></td>
                  <td style={{ textAlign: 'center', fontSize: 12 }}>
                    {d.mode === 'sea' ? '⚓ Maritime' : '🚛 Tout mode'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

// CSS extracted to avoid SSR hydration mismatch (single quotes in content:'')
const INC_CSS = `
        /* ── PAGE HEADER ── */
        .inc-header{background:var(--ink,#0A0A0A);padding:1.75rem 2rem 1.5rem;margin:-1.5rem -1.5rem 2rem;position:relative;overflow:hidden}
        .inc-header::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(201,168,76,.05) 39px,rgba(201,168,76,.05) 40px)}
        .inc-tag{font-size:9px;letter-spacing:.2em;color:var(--gold,#C9A84C);margin-bottom:.4rem;position:relative}
        .inc-title{font-family:'Cormorant Garamond',serif;font-size:clamp(22px,3vw,34px);font-weight:300;color:#FDFCF9;line-height:1.15;position:relative}
        .inc-title strong{color:#E8C97A;font-weight:600}
        .inc-sub{font-size:12px;color:#6B6259;margin-top:.4rem;position:relative}

        /* ── TABS ── */
        .tabs{display:flex;border-bottom:1px solid var(--border,#E5DDD0);margin-bottom:1.75rem;gap:0;overflow-x:auto}
        .tab{padding:.6rem 1.25rem;font-size:12px;letter-spacing:.05em;color:var(--ink3,#6B6259);border:none;background:transparent;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap;transition:all .15s}
        .tab.on{color:var(--ink,#0A0A0A);border-bottom-color:var(--gold,#C9A84C)}
        .tab:hover:not(.on){color:var(--ink2,#2C2825)}

        /* ── MODE FILTER ── */
        .mf{display:flex;gap:6px;margin-bottom:1.25rem;flex-wrap:wrap}
        .mfb{padding:5px 14px;font-size:11px;border:1px solid var(--border2,#D0C5B0);border-radius:20px;background:transparent;color:var(--ink3,#6B6259);cursor:pointer;transition:all .15s}
        .mfb.on{border-color:var(--ink,#0A0A0A);color:var(--ink,#0A0A0A);background:var(--gold4,#FBF7EE)}

        /* ── GROUP LABEL ── */
        .grp-label{font-size:9px;letter-spacing:.16em;color:var(--ink3,#6B6259);padding:.4rem 0;margin-top:1rem;border-bottom:1px solid var(--gold4,#FBF7EE);display:flex;align-items:center;gap:.5rem}
        .grp-label::before{content:'';display:inline-block;width:12px;height:1px;background:var(--gold,#C9A84C);flex-shrink:0}

        /* ── SELECTOR ── */
        .sel-row{display:flex;flex-wrap:wrap;gap:5px;margin:.5rem 0 0}
        .sb{padding:5px 12px;font-size:12px;border:1px solid var(--border,#E5DDD0);background:var(--white,#FDFCF9);color:var(--ink3,#6B6259);border-radius:4px;cursor:pointer;display:flex;align-items:center;gap:6px;transition:all .15s}
        .sb:hover{background:var(--gold4,#FBF7EE);border-color:var(--gold3,#F5E4B0)}
        .sb.on{background:var(--ink,#0A0A0A);color:var(--gold2,#E8C97A);border-color:var(--ink,#0A0A0A)}
        .dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
        .dot-sea{background:#378ADD}.dot-any{background:#639922}

        /* ── HERO ── */
        .hero{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin:1.5rem 0 1rem}
        @media(max-width:550px){.hero{grid-template-columns:1fr 1fr}}
        .hc{background:var(--gold4,#FBF7EE);border:1px solid var(--gold3,#F5E4B0);padding:1rem 1.25rem}
        .hc-lbl{font-size:9px;letter-spacing:.14em;color:var(--ink3,#6B6259);margin-bottom:.3rem}
        .hc-val{font-size:14px;font-weight:500;color:var(--ink,#0A0A0A);line-height:1.3}
        .hc-sub{font-size:11px;color:var(--ink3,#6B6259);margin-top:.2rem}

        /* ── TRANSFER BAR ── */
        .bar-section{margin-bottom:1.25rem}
        .bar-lbl{font-size:9px;letter-spacing:.14em;color:var(--ink3,#6B6259);margin-bottom:.5rem}
        .bar-track{display:flex;height:30px;overflow:hidden;border:1px solid var(--border,#E5DDD0)}
        .bar-s{background:#E6F1FB;display:flex;align-items:center;justify-content:flex-end;padding:0 10px;font-size:10px;color:#0C447C;font-weight:500;transition:width .3s;overflow:hidden;white-space:nowrap;min-width:0}
        .bar-sep{width:2px;background:var(--ink,#0A0A0A);flex-shrink:0}
        .bar-b{background:#EAF3DE;display:flex;align-items:center;padding:0 10px;font-size:10px;color:#27500A;font-weight:500;transition:width .3s;overflow:hidden;white-space:nowrap;min-width:0}

        /* ── BEST FOR ── */
        .bestfor{background:var(--gold4,#FBF7EE);border-left:3px solid var(--gold,#C9A84C);padding:.875rem 1.25rem;margin-bottom:1.25rem;font-size:13px;color:var(--ink2,#2C2825);line-height:1.7}

        /* ── RESP BOXES ── */
        .resp-2col{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem}
        @media(max-width:500px){.resp-2col{grid-template-columns:1fr}}
        .resp-box{border:1px solid var(--border,#E5DDD0);padding:1rem}
        .rb-title{font-size:9px;letter-spacing:.12em;margin-bottom:.75rem;padding-bottom:.4rem;border-bottom:1px solid var(--border,#E5DDD0)}
        .rb-s{color:#0C447C}.rb-b{color:#27500A}
        .rb-list{list-style:none;display:flex;flex-direction:column;gap:.3rem}
        .rb-s-li,.rb-b-li{font-size:12px;color:var(--ink2,#2C2825)}
        .rb-s-li{color:#185FA5}.rb-b-li{color:#3B6D11}

        /* ── CHIPS ── */
        .chip-s,.chip-b,.chip-n{width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:500}
        .chip-s{background:#E6F1FB;color:#0C447C}
        .chip-b{background:#EAF3DE;color:#27500A}
        .chip-n{background:var(--border,#E5DDD0);color:var(--ink3,#6B6259)}

        /* ── LEGEND ── */
        .legend{display:flex;gap:16px;font-size:11px;color:var(--ink3,#6B6259);margin:1rem 0;flex-wrap:wrap;align-items:center}
        .legend span{display:flex;align-items:center;gap:6px}

        /* ── MATRIX TABLE ── */
        .mt{width:100%;border-collapse:collapse;font-size:12px;border:1px solid var(--border,#E5DDD0)}
        .mt th{background:var(--ink,#0A0A0A);color:var(--gold2,#E8C97A);padding:.5rem .75rem;text-align:left;font-size:9px;letter-spacing:.12em}
        .mt td{padding:.5rem .75rem;border-bottom:1px solid var(--gold4,#FBF7EE);vertical-align:middle}
        .mt tr:last-child td{border-bottom:none}
        .mt tr:hover td{background:var(--gold4,#FBF7EE)}
        .el-name{font-size:12px;color:var(--ink,#0A0A0A)}
        .el-cat{font-size:10px;color:var(--ink3,#6B6259)}

        /* ── COSTS TAB ── */
        .cost-header{display:flex;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:.5rem}
        .cost-header-lbl{font-size:13px;color:var(--ink2,#2C2825)}
        .cost-sel{padding:6px 10px;font-size:12px;border:1px solid var(--border2,#D0C5B0);background:var(--white,#FDFCF9);color:var(--ink,#0A0A0A);outline:none;margin-left:.5rem}
        .cost-sel:focus{border-color:var(--gold,#C9A84C)}
        .cost-header-hint{font-size:11px;color:var(--ink3,#6B6259)}
        .cost-fields{border:1px solid var(--border,#E5DDD0);padding:1rem;margin-bottom:1.5rem}
        .cost-row{display:grid;grid-template-columns:1fr auto;align-items:center;gap:.5rem;padding:.4rem 0;border-bottom:1px solid var(--gold4,#FBF7EE)}
        .cost-row:last-child{border-bottom:none}
        .cost-lbl{font-size:12px;color:var(--ink2,#2C2825)}
        .cost-inp-wrap{display:flex;align-items:center;gap:4px}
        .cost-inp{width:120px;padding:5px 8px;font-size:12px;border:1px solid var(--border2,#D0C5B0);background:var(--white,#FDFCF9);color:var(--ink,#0A0A0A);text-align:right;outline:none}
        .cost-inp:focus{border-color:var(--gold,#C9A84C)}
        .cost-dh{font-size:11px;color:var(--ink3,#6B6259)}
        .cost-result{border:1px solid var(--border,#E5DDD0);padding:1rem;margin-bottom:1.5rem}
        .cr-header{font-size:9px;letter-spacing:.14em;color:var(--ink3,#6B6259);margin-bottom:.75rem;padding-bottom:.4rem;border-bottom:1px solid var(--border,#E5DDD0)}
        .cr-row{display:grid;grid-template-columns:1fr auto auto;gap:6px;align-items:center;padding:.4rem 0;border-bottom:1px solid var(--gold4,#FBF7EE);font-size:12px}
        .cr-row:last-child{border-bottom:none}
        .cr-lbl{color:var(--ink2,#2C2825)}
        .cr-total{border-top:1px solid var(--border2,#D0C5B0);margin-top:.4rem;padding-top:.6rem;font-size:13px}
        .cr-amt{font-variant-numeric:tabular-nums;color:var(--ink,#0A0A0A);text-align:right;white-space:nowrap}
        .who-s{font-size:10px;letter-spacing:.08em;background:#E6F1FB;color:#0C447C;padding:2px 8px;white-space:nowrap}
        .who-b{font-size:10px;letter-spacing:.08em;background:#EAF3DE;color:#27500A;padding:2px 8px;white-space:nowrap}
        .who-n{font-size:10px;color:var(--ink3,#6B6259)}
        .summary-2{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
        .sum-card{padding:1rem 1.25rem;border:1px solid var(--border,#E5DDD0)}
        .sum-lbl{font-size:9px;letter-spacing:.14em;color:var(--ink3,#6B6259);margin-bottom:.35rem}
        .sum-val{font-size:24px;font-weight:300;font-family:'Cormorant Garamond',serif}
        .sum-blue{color:#0C447C}.sum-green{color:#27500A}
        .sum-pct{font-size:11px;color:var(--ink3,#6B6259);margin-top:.15rem}

        /* ── COMPARE TAB ── */
        .cmp-intro{font-size:13px;color:var(--ink2,#2C2825);margin-bottom:1.25rem}
        .tag-s{background:#E6F1FB;color:#0C447C;font-size:10px;padding:1px 7px}
        .tag-b{background:#EAF3DE;color:#27500A;font-size:10px;padding:1px 7px}
        .cmp-t{width:100%;border-collapse:collapse;font-size:12px;border:1px solid var(--border,#E5DDD0);min-width:640px}
        .cmp-t th{background:var(--ink,#0A0A0A);color:var(--gold2,#E8C97A);padding:.5rem .75rem;font-size:9px;letter-spacing:.1em;text-align:center;white-space:nowrap}
        .cmp-t th:first-child,.cmp-t th:nth-child(2){text-align:left}
        .cmp-t td{padding:.45rem .75rem;border-bottom:1px solid var(--gold4,#FBF7EE);text-align:center;vertical-align:middle}
        .cmp-t td:first-child,.cmp-t td:nth-child(2){text-align:left}
        .cmp-t tr:last-child td{border-bottom:none}
        .cmp-t tr:hover td{background:var(--gold4,#FBF7EE)}
        .cmp-key{font-weight:500;color:var(--ink,#0A0A0A);font-size:13px}
        .cmp-name{font-size:10px;color:var(--ink3,#6B6259)}
        .cmp-rpt{font-size:11px;color:var(--ink3,#6B6259)}
        .cmp-s{background:#E6F1FB;color:#0C447C;font-size:10px;padding:2px 8px;display:inline-block}
        .cmp-b{background:#EAF3DE;color:#27500A;font-size:10px;padding:2px 8px;display:inline-block}
        .cmp-n{color:var(--ink4,#B0A89E);font-size:11px}
      `

export default function IncotermsPage() {
  const [tab, setTab] = useState<Tab>('detail')

  return (
    <Layout variant="inner">
      <style dangerouslySetInnerHTML={{ __html: INC_CSS }} />

      {/* Page header */}
      <div className="inc-header">
        <div className="inc-tag">DOUANE.IA — OUTILS INTERACTIFS</div>
        <div className="inc-title">Calculateur <strong>Incoterms 2020</strong></div>
        <div className="inc-sub">11 termes · Responsabilités vendeur / acheteur · Calculateur de coûts en DH · Comparaison rapide</div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {([
          { id: 'detail',  label: 'Détail par Incoterm' },
          { id: 'costs',   label: 'Calculateur de coûts' },
          { id: 'compare', label: 'Tableau comparatif' },
        ] as { id: Tab; label: string }[]).map(t => (
          <button key={t.id} className={`tab${tab === t.id ? ' on' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'detail'  && <TabDetail />}
      {tab === 'costs'   && <TabCosts />}
      {tab === 'compare' && <TabCompare />}
    </Layout>
  )
}
