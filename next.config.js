/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
      }
    }
    return config;
  },
  // Remove standalone output as it might interfere with file operations
  // output: 'standalone',
}

module.exports = nextConfig 