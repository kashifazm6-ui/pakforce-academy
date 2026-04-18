import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

export const metadata: Metadata = {
  title: "PakForce Academy — AMC Initial Test Preparation",
  description:
    "Official AMC Initial Test Preparation Platform. Verbal, Non-Verbal, and Academic assessments powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
