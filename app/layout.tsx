import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import { getSiteUrlObject, toAbsoluteUrl } from "@/lib/seo/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrlObject();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Otsu Labs | Anime-Style Animation Studio",
    template: "%s | Otsu Labs",
  },
  description:
    "Otsu Labs is an animation studio specialized in anime-style production for games, startups, and brands.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Otsu Labs | Anime-Style Animation Studio",
    description:
      "Anime-style animation studio for product animation, game trailers, and anime commercials.",
    siteName: "Otsu Labs",
    images: [
      {
        url: toAbsoluteUrl("/og-image.png"),
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Otsu Labs | Anime-Style Animation Studio",
    description:
      "Anime-style animation studio for product animation, game trailers, and anime commercials.",
    images: [toAbsoluteUrl("/og-image.png")],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl.toString()}#organization`,
        name: "Otsu Labs",
        url: siteUrl.toString(),
        email: "contact@otsulabs.com",
        sameAs: [
          "https://www.instagram.com/otsulabs/",
          "https://www.linkedin.com/company/otsulabs/",
          "https://x.com/OtsuLabs",
          "https://vimeo.com/otsulabs",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl.toString()}#website`,
        url: siteUrl.toString(),
        name: "Otsu Labs",
        publisher: {
          "@id": `${siteUrl.toString()}#organization`,
        },
      },
    ],
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <Header />
        {children}
      </body>
    </html>
  );
}
