/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Handle Node.js polyfills for Solana packages
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: false,
      stream: false,
      buffer: false,
      fs: false,
      path: false,
      os: false,
    };
    return config;
  },
};

export default nextConfig;
