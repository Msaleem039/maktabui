/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rixdrbokebnvidwyzvzo.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/maktab-system/**',
      },
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/**", 
      },
      {
        protocol: "https",
        hostname: "backend.maktabos.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "backend.maktabos.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/**",
      },
    ],
    unoptimized: false,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox; img-src 'self' data: https://backend.maktabos.com https://*.maktabos.com https://rixdrbokebnvidwyzvzo.supabase.co;",
  },
}

export default nextConfig