/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.meetup.com",
      },
    ],
  },
  // /join is the native BSTC join form, served from the bstc-join project and
  // proxied here so the address stays balistartupandtech.com/join (?src= is kept).
  // It saves each member before showing the community links. Replaces the Tally page.
  rewrites: async () => [
    { source: "/join", destination: "https://bstc-join.vercel.app/join" },
    { source: "/join/:path*", destination: "https://bstc-join.vercel.app/join/:path*" },
  ],
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ],
};

export default nextConfig;
