/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.amazon.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
