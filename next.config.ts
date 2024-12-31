import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  eslint: {
    ignoreDuringBuilds: true,  
  },
  typescript: {
    ignoreBuildErrors: true,  
  }
};

export default nextConfig;