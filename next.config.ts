import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co" //Allows ImgBB direct image links
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Allows Unsplash template links
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com', // FOR PEXELS
      },
    ],
    // 💡 FIX: Tells Next.js to let the browser download external assets directly 
    // instead of routing them through your local node server optimization pipeline.
    // unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'https://dishmarket-backend.onrender.com/api/auth/:path*',
      },
      {
        // ⚡ NEW: Proxies /api/admin/* and other general resource requests safely under the first-party domain roof
        source: '/api/:path*',
        destination: 'https://dishmarket-backend.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
