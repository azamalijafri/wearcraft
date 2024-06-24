import { Metadata } from "next";

export function constructMetadata({
  title = "WearCraft",
  description = "Create custom high-quality tshirts and hoodies",
  icons = "/favicon.ico",
}: {
  title?: string;
  description?: string;
  icons?: string;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    icons,
    metadataBase: new URL("https://wearcraft.vercel.app/"),
  };
}
