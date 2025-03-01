/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'encrypted-tbn0.gstatic.com',
      'bcp.cdnchinhphu.vn',
      'data-service.pharmacity.io',
      'suckhoedoisong.qltns.mediacdn.vn',
      'cdn.thegioididong.com',
      'cdn.builder.io'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ]
  },
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
}

module.exports = nextConfig
