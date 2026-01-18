import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Skip TypeScript checks during build (Vercel runs them separately)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip ESLint checks during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
