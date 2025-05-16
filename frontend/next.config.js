/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack: (config) => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
        };

        // Thêm hỗ trợ alias paths
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': require('path').resolve(__dirname, 'src'),
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