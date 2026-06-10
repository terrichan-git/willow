import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Willow design system fonts: Fraunces (display serif) + Inter (body sans).
const fraunces = localFont({
  src: [
    { path: "./fonts/Fraunces-Variable.woff2", weight: "300 700", style: "normal" },
    { path: "./fonts/Fraunces-Italic-Variable.woff2", weight: "300 700", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = localFont({
  src: [{ path: "./fonts/Inter-Variable.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Willow — your voice, after you're gone",
  description:
    "Prepare your digital estate while you're alive, then leave behind a companion that speaks in your own voice to guide the people you love through everything that comes next.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
