import type { AppProps } from 'next/app'
import '../styles/globals.css'

const DevBanner = () => (
  <div style={{
    background: '#92400E', color: '#FEF3C7',
    textAlign: 'center', padding: '.4rem 1rem',
    fontSize: '11px', letterSpacing: '.1em',
    position: 'relative', zIndex: 500
  }}>
    VERSION DÉMONSTRATION — USAGE INTERNE — NE PAS DIFFUSER &nbsp;·&nbsp;
    <strong>DAS</strong> — Douane Assist Solutions
  </div>
)

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DevBanner />
      <Component {...pageProps} />
    </>
  )
}
