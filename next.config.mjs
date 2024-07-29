/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    domains: ['api.screwltd.com'],
    formats: ['image/avif', 'image/webp'],
  }
};

export default nextConfig;
