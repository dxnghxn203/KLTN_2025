const {isServer} = require("@tanstack/react-query");
/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: false,
    reactStrictMode: false,
    transpilePackages: ['react-quill', 'quill'],
    experimental: {
        esmExternals: 'loose',
    },
    webpack: (config) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                path: false,
                os: false,
            };
        }

        config.experiments = {
            ...config.experiments,
            topLevelAwait: true,
        };
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
        };
        return config;
    },
    images: {
        domains: [
            "kltn2025.s3.ap-southeast-2.amazonaws.com",
            "https://kltn2025.s3.ap-southeast-2.amazonaws.com",
            "cdn.nhathuoclongchau.com.vn",
            "https://medicaretechs3.s3.ap-southeast-2.amazonaws.com",
            "medicaretechs3.s3.ap-southeast-2.amazonaws.com"
        ],
    },
};

module.exports = nextConfig;
