import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Docker: produces a minimal standalone server
  output: "standalone",
};

export default nextConfig;
