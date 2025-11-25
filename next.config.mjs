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
    ],
  },
}

export default nextConfig