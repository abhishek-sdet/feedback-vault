/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow better-sqlite3 (native Node module) in API routes
  serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;
