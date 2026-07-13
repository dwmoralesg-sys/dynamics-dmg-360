/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // URL base de la API del backend (NestJS)
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  },
};
module.exports = nextConfig;
