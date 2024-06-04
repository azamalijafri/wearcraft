import type { Metadata } from "next";
import { Recursive } from "next/font/google";
import "./globals.css";

const recursive = Recursive({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "WearCraft",
  description: "Creat custom outfits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={recursive.className}>{children}</body>
    </html>
  );
}
