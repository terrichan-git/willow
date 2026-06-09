import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
