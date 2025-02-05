import type { NextConfig } from "next";

// Define all your allowed origins
const allowedOrigins = [
  'https://taskify-ai-jet.vercel.app',
  'https://taskify-6rkg57ufh-shrekpepsis-projects.vercel.app',
  'http://localhost:3000'
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  eslint: {
    ignoreDuringBuilds: true,  
  },
  typescript: {
    ignoreBuildErrors: true,  
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { 
            key: "Access-Control-Allow-Origin", 
            value: allowedOrigins.join(',') // Allow multiple origins
          },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          { 
            key: "Access-Control-Allow-Headers", 
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
          },
          // Add this header for preflight requests
          { key: "Access-Control-Max-Age", value: "86400" }
        ]
      }
    ];
  },
  // Add this to handle OPTIONS requests properly
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  }
};

export default nextConfig;