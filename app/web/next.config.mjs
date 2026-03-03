import { createRequire } from 'module';
const _require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fix: @noble/hashes v2 exports map has ./sha3.js but NOT ./sha3
    // mpl-core does require('@noble/hashes/sha3') — alias intercepts before exports map check
    config.resolve.alias = {
      ...config.resolve.alias,
      '@noble/hashes/sha3': _require.resolve('@noble/hashes/sha3.js'),
    };

    // Handle Node.js polyfills for Solana packages (client bundles only)
    // Skip for edge/middleware runtime — it has native Web Crypto API
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        stream: false,
        buffer: false,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};

export default nextConfig;
