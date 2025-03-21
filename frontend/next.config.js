/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    // Tùy chọn: định cấu hình kích thước hình ảnh cho tối ưu hóa
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}

module.exports = nextConfig
