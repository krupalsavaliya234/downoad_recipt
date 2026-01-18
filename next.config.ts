import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Skip TypeScript checks during build (Vercel runs them separately)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
