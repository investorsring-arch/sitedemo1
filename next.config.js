const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/modules/reference-logistique',
        destination: '/api/ref-log',
      },
    ]
  },
}

module.exports = nextConfig
