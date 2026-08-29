import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // 🔽 টাইপস্ক্রিপ্ট এররগুলোকে বিল্ডের সময় ইগনোর করবে
    ignoreBuildErrors: true,
  },
  eslint: {
    // 🔽 ESLint এররগুলোকেও ইগনোর করবে
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
