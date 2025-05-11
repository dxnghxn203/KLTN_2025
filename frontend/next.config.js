/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  reactStrictMode: false,
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  images: {
    domains: [
      "kltn2025.s3.ap-southeast-2.amazonaws.com",
      "cdn.nhathuoclongchau.com.vn",
    ],
  },
};

module.exports = nextConfig;
