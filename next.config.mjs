/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["@vectorize-io/hindsight-client"],
  },
};

export default nextConfig;
