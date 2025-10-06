import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8081',
        pathname: '/api/v1/user/file/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8081',
        pathname: '/api/v1/admin/file/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.18.131',
        port: '8081',
        pathname: '/api/v1/user/file/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.18.131',
        port: '8081',
        pathname: '/api/v1/admin/file/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**', // Permite qualquer caminho de imagem nesse hostname
      },

    ],
  },
};

export default nextConfig;