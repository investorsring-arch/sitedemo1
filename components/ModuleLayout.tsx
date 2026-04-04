import Layout from './Layout'

interface ModuleLayoutProps {
  kicker: string
  title: string
  sub: string
  children: React.ReactNode
}

export default function ModuleLayout({ kicker, title, sub, children }: ModuleLayoutProps) {
  return (
    <Layout variant="inner">
      <div className="page-wrap">
        <div className="page-header">
          <div className="page-kicker">{kicker}</div>
          <h1 className="page-title">{title}</h1>
          <p className="page-sub">{sub}</p>
        </div>
        {children}
      </div>
    </Layout>
  )
}
