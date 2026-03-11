/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_PAGES_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    unoptimized: true, // требуется для static export
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.ebayimg.com' },
      { protocol: 'https', hostname: 'theartfulastronaut.com' },
    ],
  },
};

export default nextConfig;
