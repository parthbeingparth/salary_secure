import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow opening the site via LAN IP during local testing
  allowedDevOrigins: ["192.168.0.7", "127.0.0.1", "localhost"],
};

export default nextConfig;
