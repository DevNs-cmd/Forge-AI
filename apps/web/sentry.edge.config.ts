import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://a974c95eafe111e60aeb18907123a753@o4511814270124032.ingest.us.sentry.io/4511814298042368",
  tracesSampleRate: 1.0,
  debug: false,
});
