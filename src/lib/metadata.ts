import { Metadata } from "next";

export function constructMetaData({
  title = "BlinkEscrow",
  description = "Web3 Escrow Service with latest Solana Blinks.",
  image = "/thumbnail.png",
  authors = { name: "Manice18", url: "https://blink-escrow.vercel.app/" },
  creator = "Manice18",
  generator = "Next.js",
  publisher = "Manice18",
  robots = "index, follow",
}: {
  title?: string;
  description?: string;
  image?: string;
  authors?: { name: string; url: string };
  creator?: string;
  generator?: string;
  publisher?: string;
  robots?: string;
} = {}): Metadata {
  return {
    title,
    description,
    authors,
    creator,
    generator,
    publisher,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Manice18heree",
      creator: "@Manice18heree",
      creatorId: "@Manice18heree",
      title,
      description,
      images: [image],
    },
    icons: {
      icon: [
        {
          media: "(prefers-color-scheme: light)",
          url: "/assets/brand-icons/favicon.ico",
          href: "/assets/brand-icons/favicon.ico",
        },
        {
          media: "(prefers-color-scheme: dark)",
          url: "/assets/brand-icons/favicon.ico",
          href: "/assets/brand-icons/favicon.ico",
        },
      ],
    },
    metadataBase: new URL("https://blink-escrow.vercel.app/"),
    robots,
  };
}
