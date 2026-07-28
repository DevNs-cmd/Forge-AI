import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Docker: produces a minimal standalone server
  output: "standalone",
};

export default withSentryConfig(nextConfig, {
  org: "manipal-university-jaipur-iq",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
});
