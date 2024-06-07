import type { Metadata } from "next";
import { Recursive } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
const recursive = Recursive({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "WearCraft",
  description: "Creat custom outfits.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={recursive.className}>
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
