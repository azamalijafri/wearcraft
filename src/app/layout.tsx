import type { Metadata } from "next";
import { Inter, Poppins, Recursive } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/Providers";
const recursive = Recursive({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});
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
      <Providers>
        <body className={poppins.className}>
          <Navbar />
          <main className="flex grainy-light flex-col min-h-[calc(100vh-3.5rem-1px)] h-[calc(100vh-3.5rem-1px)]">
            <div className="flex-1 flex flex-col h-full">{children}</div>
          </main>
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}
