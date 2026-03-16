import type { NextConfig } from "next";

const DEFAULT_MEDIA_MAX_BYTES = 150 * 1024 * 1024;
const mediaMaxBytes = Number(process.env.CMS_MEDIA_MAX_BYTES || DEFAULT_MEDIA_MAX_BYTES);
const proxyClientMaxBodySize = Number.isFinite(mediaMaxBytes) && mediaMaxBytes > 0
  ? mediaMaxBytes
  : DEFAULT_MEDIA_MAX_BYTES;

const nextConfig: NextConfig = {
  experimental: {
    proxyClientMaxBodySize,
  },
  async redirects() {
    return [
      {
        source: "/contacts",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
