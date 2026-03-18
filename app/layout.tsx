import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "@/styles/global.css";

export const metadata: Metadata = {
  title: {
    default: "KIJ Studio",
    template: "%s | KIJ Studio",
  },
  description:
    "Bringing your dream spaces to life with creative design and breathtaking visuals.",
  keywords: [
    "KIJ Studio",
    "interior design",
    "architectural visualization",
    "3D rendering",
  ],
  metadataBase: new URL("https://kijstudio.com"),
  openGraph: {
    type: "website",
    siteName: "KIJ Studio",
  },
  icons: {
    icon: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/gzh3byk.css" />
      </head>
      <body>
        {children}
        <GoogleAnalytics gaId="G-086HYGYM9B" />
      </body>
    </html>
  );
}
