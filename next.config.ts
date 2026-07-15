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
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        // Replace this string with your exact live Render backend URL endpoint
        destination: 'https://dishmarket-backend.onrender.com/api/auth/:path*',
      },
    ];
  },
};

export default nextConfig;
