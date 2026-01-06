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
    ],
    unoptimized: false,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

export default nextConfig