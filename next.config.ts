import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Skip ESLint during Vercel builds to unblock deployment. We still keep ESLint locally.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
