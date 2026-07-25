import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PROJECT FORGE - Startup Operating System",
  description: "The premium operating system where companies are born. Transform your raw ideas into validated, funded, and operating enterprises.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-white antialiased">
      <body className="h-full bg-neutral-50/50 text-neutral-900 selection:bg-brand-100 selection:text-brand-800">
        {children}
      </body>
    </html>
  );
}
