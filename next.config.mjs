const nextConfig = {
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; img-src 'self' data: https://backend.maktabos.com https://*.maktabos.com https://rixdrbokebnvidwyzvzo.supabase.co;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rixdrbokebnvidwyzvzo.supabase.co',
        pathname: '/storage/v1/object/public/maktab-system/:path*',
      },
      {
        protocol: "https",
        hostname: "backend.maktabos.com",
        pathname: "/:path*",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/:path*",
      },
    ],
  },
}

export default nextConfig;
