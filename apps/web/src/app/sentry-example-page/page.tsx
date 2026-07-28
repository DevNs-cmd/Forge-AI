"use client";

import * as Sentry from "@sentry/nextjs";

export default function SentryExamplePage() {
  const triggerError = () => {
    throw new Error("Sentry Test Error from Next.js Application!");
  };

  const triggerHandledException = () => {
    try {
      // @ts-expect-error - deliberate undefined function call for Sentry testing
      myUndefinedFunction();
    } catch (error) {
      Sentry.captureException(error);
      alert("Captured handled exception and sent to Sentry!");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
        Sentry Monitoring Test Page
      </h1>
      <p style={{ marginBottom: "24px", color: "#666" }}>
        Click a button below to trigger a test error and verify your Sentry setup for project:
        <strong> javascript-nextjs</strong>.
      </p>

      <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
        <button
          onClick={triggerError}
          style={{
            padding: "12px 24px",
            backgroundColor: "#e53e3e",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Throw Uncaught Exception
        </button>

        <button
          onClick={triggerHandledException}
          style={{
            padding: "12px 24px",
            backgroundColor: "#3182ce",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Capture Handled Exception
        </button>
      </div>
    </div>
  );
}
