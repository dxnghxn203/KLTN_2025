/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
  images: {
    domains: [
      'kltn2025.s3.ap-southeast-2.amazonaws.com',
      
      // Giữ lại các domain hiện có nếu có
    ],
  },
}

module.exports = nextConfig
