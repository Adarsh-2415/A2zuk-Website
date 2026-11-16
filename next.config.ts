import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/help/faq",
        destination: "/help",
        permanent: false,
      },
      {
        source: "/policies/privacy",
        destination: "/privacy-policy",
        permanent: false,
      },
      {
        source: "/policies/terms",
        destination: "/terms",
        permanent: false,
      },
      {
        source: "/policies/contest-rules",
        destination: "/terms#section-3",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
