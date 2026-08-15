const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  output: isProd ? "export" : undefined,
  trailingSlash: true,

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
