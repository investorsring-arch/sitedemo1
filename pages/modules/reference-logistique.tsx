import type { GetServerSideProps } from 'next'
import fs from 'fs'
import path from 'path'

interface Props { html: string }

export default function Page({ html }: Props) {
  return (
    <html lang="fr">
      <head dangerouslySetInnerHTML={{ __html: html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '' }} />
      <body dangerouslySetInnerHTML={{ __html: html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? '' }} />
    </html>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const file = path.join(process.cwd(), 'public', 'tools', 'reference-logistique.html')
  const html = fs.readFileSync(file, 'utf8')
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.write(html)
  res.end()
  return { props: { html: '' } }
}
