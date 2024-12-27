import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  eslint: {
    ignoreDuringBuilds: true,  
  },
  images: {
    domains: ['fonts.googleapis.com'],  
  },
  typescript: {
    ignoreBuildErrors: true,  
  }
};

export default nextConfig;