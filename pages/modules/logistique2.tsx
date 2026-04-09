import Head from 'next/head'
import Layout from '../../components/Layout'
import ModuleLayout from '../../components/ModuleLayout'

// Migration : remplace l'ancien redirect → /tools/logistique2.html
// La ressource HTML est servie via /public/tools/logistique2.html
// Intégrée en iframe pour garder la navigation React et le layout cohérent

export default function Logistique2() {
  return (
    <>
      <Head>
        <title>Référence Logistique — Douane.ia</title>
        <meta name="description" content="Référence logistique complète : conteneurs, Incoterms, IMDG, documents de transport" />
      </Head>
      <Layout>
        <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 60px)' }}>

          {/* Barre titre */}
          <div style={{
            background:'#FDFCF8', borderBottom:'1px solid #E8DFC8',
            padding:'.75rem 2rem', display:'flex', alignItems:'center', gap:'1rem', flexShrink:0,
          }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600, color:'#0A0A0A' }}>
              Référence <strong style={{ color:'#C9A84C' }}>Logistique</strong>
            </div>
            <span style={{ fontSize:10, padding:'2px 8px', background:'#F5E4B0', color:'#8A6A10', letterSpacing:'.08em' }}>
              OUTIL INTERACTIF
            </span>
            <div style={{ marginLeft:'auto', fontSize:11, color:'#8A8078' }}>
              Conteneurs · IMDG · ISO 6346 · Documents de transport
            </div>
            <a
              href="/tools/logistique2.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize:11, padding:'4px 12px', border:'1px solid #E8DFC8', color:'#3A3530', textDecoration:'none', transition:'all .15s' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = '#C9A84C'; (e.target as HTMLElement).style.color = '#C9A84C' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = '#E8DFC8'; (e.target as HTMLElement).style.color = '#3A3530' }}>
              ↗ Plein écran
            </a>
          </div>

          {/* iframe */}
          <iframe
            src="/tools/logistique2.html"
            title="Référence Logistique — Douane.ia"
            style={{ flex:1, border:'none', width:'100%', display:'block' }}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </Layout>
    </>
  )
}
