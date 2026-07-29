import path from "path";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Docker: produces a minimal standalone server
  output: "standalone",
  // In a monorepo, node_modules are hoisted to root. Tell Turbopack where
  // to find the workspace root so it can resolve next/package.json.
  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
};

export default withSentryConfig(nextConfig, {
  org: "manipal-university-jaipur-iq",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
});
