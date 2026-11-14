import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#234E3D",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "A2ZUK — Every little face has a big story | Online Baby Photo Contest",
  description:
    "Celebrate your little one with A2ZUK. Share a smile, let your community cheer them on, and participate in a joyful online photo contest for families.",
  keywords: [
    "A2ZUK",
    "baby photo contest",
    "photo contest India",
    "baby contest",
    "littlejoy",
    "family contest",
    "baby photography",
  ],
  authors: [{ name: "A2ZUK" }],
  creator: "A2ZUK",
  publisher: "A2ZUK",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://a2zuk.com"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "A2ZUK — Every little face has a big story",
    description:
      "Celebrate your little one. Share a smile. Let your community cheer them on. A joyful photo contest for families.",
    url: "/",
    siteName: "A2ZUK",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "A2ZUK — Every little face has a big story",
    description:
      "Celebrate your little one. Share a smile. Let your community cheer them on.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#FAF8F5] text-[#1E3529] font-sans selection:bg-[#D4E865] selection:text-[#1B382B]">
        {children}
      </body>
    </html>
  );
}
