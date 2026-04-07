import type { GetServerSideProps } from 'next'

export default function Page() { return null }

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.writeHead(302, { Location: '/tools/logistique2.html' })
  res.end()
  return { props: {} }
}
