import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

// ─── Types ───────────────────────────────────────────────────────────────────
export interface UserProfile {
  profil:    string
  secteurs:  string[]
  codesSH:   string[]
  maturite:  string
  nom?:      string
  createdAt: string
}

// ─── Data ────────────────────────────────────────────────────────────────────
const PROFILS = [
  { id: 'transitaire', label: 'Transitaire',         sub: 'Agent en douane, commissionnaire' },
  { id: 'pme',         label: 'PME importatrice',    sub: 'Directeur achat, supply chain' },
  { id: 'cabinet',     label: 'Cabinet conseil',     sub: 'Consultant douanier, juriste' },
  { id: 'direction',   label: 'Direction logistique', sub: 'Responsable imports/exports' },
  { id: 'autre',       label: 'Autre profil',        sub: 'Étudiant, académique, autre' },
]

const SECTEURS = [
  'Textile & Habillement', 'Agroalimentaire', 'Automobile & Pièces',
  'Pharmacie & Santé', 'Électronique & High-tech', 'BTP & Matériaux',
  'Chimie & Plastiques', 'Commerce général',
]

const MATURITES = [
  { id: 'debutant',     label: 'Débutant',     sub: 'Je découvre les procédures douanières' },
  { id: 'intermediaire', label: 'Intermédiaire', sub: 'Je maîtrise les bases, je cherche à approfondir' },
  { id: 'expert',       label: 'Expert',        sub: 'Professionnel confirmé, je cherche des réponses précises' },
]

// ─── Component ───────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep]       = useState(1)
  const [profil, setProfil]   = useState('')
  const [secteurs, setSecteurs] = useState<string[]>([])
  const [codesSH, setCodesSH] = useState(['', '', ''])
  const [maturite, setMaturite] = useState('')
  const [nom, setNom]         = useState('')

  const toggleSecteur = (s: string) => {
    setSecteurs(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : prev.length < 3 ? [...prev, s] : prev
    )
  }

  const updateCode = (i: number, v: string) => {
    const next = [...codesSH]
    next[i] = v.replace(/\D/g, '').slice(0, 10)
    setCodesSH(next)
  }

  const finish = () => {
    const profile: UserProfile = {
      profil, secteurs,
      codesSH: codesSH.filter(Boolean),
      maturite, nom,
      createdAt: new Date().toISOString(),
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('douane_profile', JSON.stringify(profile))
    }
    router.push('/dashboard')
  }

  const canNext = () => {
    if (step === 1) return !!profil
    if (step === 2) return secteurs.length > 0
    if (step === 3) return codesSH.some(Boolean)
    if (step === 4) return !!maturite
    return false
  }

  return (
    <>
      <Head>
        <title>Douane.ia — Personnalisez votre espace</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>
      <style dangerouslySetInnerHTML={{ __html: OB_CSS }} />

      <div className="ob-wrap">
        {/* Header */}
        <div className="ob-header">
          <div className="ob-logo">Douane<span className="ob-dot">.</span>ia</div>
          <div className="ob-step-label">{step} / 4</div>
        </div>

        {/* Progress */}
        <div className="ob-progress">
          {[1,2,3,4].map(s => (
            <div key={s} className={`ob-pip${s <= step ? ' on' : ''}`} />
          ))}
        </div>

        {/* Card */}
        <div className="ob-card">

          {/* STEP 1 — Profil */}
          {step === 1 && (
            <div>
              <div className="ob-q-num">Question 1 sur 4</div>
              <div className="ob-q-title">Quel est votre profil métier ?</div>
              <div className="ob-q-sub">Votre dashboard sera adapté à vos besoins spécifiques.</div>
              <div className="ob-name-row">
                <input
                  className="ob-input"
                  type="text"
                  placeholder="Votre prénom (optionnel)"
                  value={nom}
                  onChange={e => setNom(e.target.value)}
                />
              </div>
              <div className="ob-options">
                {PROFILS.map(p => (
                  <button
                    key={p.id}
                    className={`ob-option${profil === p.id ? ' on' : ''}`}
                    onClick={() => setProfil(p.id)}
                  >
                    <div className="ob-opt-radio">
                      {profil === p.id && <div className="ob-opt-dot" />}
                    </div>
                    <div>
                      <div className="ob-opt-label">{p.label}</div>
                      <div className="ob-opt-sub">{p.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 — Secteurs */}
          {step === 2 && (
            <div>
              <div className="ob-q-num">Question 2 sur 4</div>
              <div className="ob-q-title">Vos secteurs d'activité principaux ?</div>
              <div className="ob-q-sub">Sélectionnez jusqu'à 3 secteurs. Vos alertes réglementaires seront filtrées en conséquence.</div>
              <div className="ob-chips">
                {SECTEURS.map(s => (
                  <button
                    key={s}
                    className={`ob-chip${secteurs.includes(s) ? ' on' : ''}${!secteurs.includes(s) && secteurs.length >= 3 ? ' disabled' : ''}`}
                    onClick={() => toggleSecteur(s)}
                    disabled={!secteurs.includes(s) && secteurs.length >= 3}
                  >
                    {s}
                    {secteurs.includes(s) && <span className="ob-chip-x">✓</span>}
                  </button>
                ))}
              </div>
              <div className="ob-hint">{secteurs.length}/3 sélectionnés</div>
            </div>
          )}

          {/* STEP 3 — Codes SH */}
          {step === 3 && (
            <div>
              <div className="ob-q-num">Question 3 sur 4</div>
              <div className="ob-q-title">Vos codes SH principaux ?</div>
              <div className="ob-q-sub">
                Entrez jusqu'à 3 codes SH (positions tarifaires à 4–10 chiffres). Vous serez alerté dès qu'une circulaire ou modification tarifaire les concerne.
              </div>
              <div className="ob-sh-rows">
                {codesSH.map((c, i) => (
                  <div key={i} className="ob-sh-row">
                    <div className="ob-sh-num">{i + 1}</div>
                    <input
                      className="ob-input ob-sh-input"
                      type="text"
                      inputMode="numeric"
                      placeholder={`Ex : ${['8703.10', '6109.10', '3004.90'][i]}`}
                      value={c}
                      onChange={e => updateCode(i, e.target.value)}
                    />
                    {c && (
                      <span className="ob-sh-valid">✓</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="ob-hint">
                Pas encore de codes définis ? Saisissez au moins un code pour continuer. Vous pourrez en ajouter d'autres depuis votre dashboard.
              </div>
            </div>
          )}

          {/* STEP 4 — Maturité */}
          {step === 4 && (
            <div>
              <div className="ob-q-num">Question 4 sur 4</div>
              <div className="ob-q-title">Votre niveau en réglementation douanière ?</div>
              <div className="ob-q-sub">L'IA adapte la profondeur et le vocabulaire de ses réponses à votre niveau.</div>
              <div className="ob-options">
                {MATURITES.map(m => (
                  <button
                    key={m.id}
                    className={`ob-option${maturite === m.id ? ' on' : ''}`}
                    onClick={() => setMaturite(m.id)}
                  >
                    <div className="ob-opt-radio">
                      {maturite === m.id && <div className="ob-opt-dot" />}
                    </div>
                    <div>
                      <div className="ob-opt-label">{m.label}</div>
                      <div className="ob-opt-sub">{m.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="ob-footer">
            {step > 1 && (
              <button className="ob-btn-back" onClick={() => setStep(s => s - 1)}>
                ← Retour
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < 4 ? (
              <button
                className={`ob-btn-next${canNext() ? '' : ' disabled'}`}
                onClick={() => canNext() && setStep(s => s + 1)}
                disabled={!canNext()}
              >
                Continuer →
              </button>
            ) : (
              <button
                className={`ob-btn-next${canNext() ? '' : ' disabled'}`}
                onClick={() => canNext() && finish()}
                disabled={!canNext()}
              >
                Accéder à mon dashboard →
              </button>
            )}
          </div>
        </div>

        <div className="ob-footer-note">
          Vos préférences sont sauvegardées localement · Modifiables depuis Mon Compte
        </div>
      </div>
    </>
  )
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const OB_CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#0A0A0A;--ink2:#3A3530;--ink3:#8A8078;--ink4:#B0A89E;
  --gold:#C9A84C;--gold2:#E8C97A;--gold3:#F5E4B0;--gold4:#FBF5E6;
  --white:#FDFCF8;--border:#E8DFC8;--border2:#D4C8A8;
}
body{font-family:'DM Sans',sans-serif;background:var(--gold4);color:var(--ink);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem 1rem}
.ob-wrap{width:100%;max-width:520px;display:flex;flex-direction:column;gap:1.25rem}
.ob-header{display:flex;align-items:center;justify-content:space-between}
.ob-logo{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--ink)}
.ob-dot{color:var(--gold)}
.ob-step-label{font-size:11px;letter-spacing:.14em;color:var(--ink3)}
.ob-progress{display:flex;gap:6px}
.ob-pip{height:3px;flex:1;background:var(--border);border-radius:2px;transition:background .3s}
.ob-pip.on{background:var(--gold)}
.ob-card{background:var(--white);border:1px solid var(--border);padding:2rem;display:flex;flex-direction:column;gap:1.5rem}
.ob-q-num{font-size:10px;letter-spacing:.16em;color:var(--gold)}
.ob-q-title{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:400;color:var(--ink);line-height:1.2;margin-top:-.25rem}
.ob-q-sub{font-size:13px;color:var(--ink3);line-height:1.65;margin-top:-.5rem}
.ob-name-row{margin-top:-.5rem}
.ob-input{width:100%;padding:.75rem 1rem;border:1px solid var(--border2);background:var(--white);font-family:'DM Sans',sans-serif;font-size:13px;color:var(--ink);outline:none;transition:border-color .15s}
.ob-input:focus{border-color:var(--gold)}
.ob-options{display:flex;flex-direction:column;gap:.5rem}
.ob-option{display:flex;align-items:center;gap:.875rem;padding:.875rem 1rem;border:1px solid var(--border);background:var(--white);cursor:pointer;text-align:left;transition:all .15s;font-family:'DM Sans',sans-serif;width:100%}
.ob-option:hover{border-color:var(--gold3);background:var(--gold4)}
.ob-option.on{border-color:var(--gold);background:var(--gold4)}
.ob-opt-radio{width:18px;height:18px;border-radius:50%;border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:border-color .15s}
.ob-option.on .ob-opt-radio{border-color:var(--gold)}
.ob-opt-dot{width:8px;height:8px;border-radius:50%;background:var(--gold)}
.ob-opt-label{font-size:13px;font-weight:500;color:var(--ink)}
.ob-opt-sub{font-size:11px;color:var(--ink3);margin-top:1px}
.ob-chips{display:flex;flex-wrap:wrap;gap:.5rem}
.ob-chip{padding:7px 14px;font-size:12px;border:1px solid var(--border2);background:var(--white);color:var(--ink2);cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:6px}
.ob-chip:hover{border-color:var(--gold3);background:var(--gold4)}
.ob-chip.on{border-color:var(--gold);background:var(--gold4);color:var(--ink);font-weight:500}
.ob-chip.disabled{opacity:.4;cursor:not-allowed}
.ob-chip-x{font-size:11px;color:var(--gold)}
.ob-hint{font-size:11px;color:var(--ink3);line-height:1.55}
.ob-sh-rows{display:flex;flex-direction:column;gap:.625rem}
.ob-sh-row{display:flex;align-items:center;gap:.625rem}
.ob-sh-num{width:20px;height:20px;border-radius:50%;background:var(--gold4);border:1px solid var(--gold3);display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--ink3);flex-shrink:0}
.ob-sh-input{flex:1;font-family:'DM Mono',monospace!important;letter-spacing:.06em}
.ob-sh-valid{color:var(--gold);font-size:14px;flex-shrink:0}
.ob-footer{display:flex;align-items:center;gap:.75rem;padding-top:.5rem;border-top:1px solid var(--border)}
.ob-btn-back{padding:9px 18px;font-size:12px;letter-spacing:.06em;color:var(--ink3);border:1px solid var(--border2);background:transparent;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}
.ob-btn-back:hover{border-color:var(--gold);color:var(--gold)}
.ob-btn-next{padding:9px 22px;font-size:12px;letter-spacing:.08em;background:var(--ink);color:var(--gold2);cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s;border:none}
.ob-btn-next:hover:not(.disabled){background:var(--gold);color:var(--ink)}
.ob-btn-next.disabled{opacity:.4;cursor:not-allowed}
.ob-footer-note{font-size:10px;letter-spacing:.06em;color:var(--ink3);text-align:center}
`
