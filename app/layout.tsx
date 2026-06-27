import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { ColorSchemeScript } from "@mantine/core";
import { ClientProviders } from "../components/ClientProviders";

export const metadata: Metadata = {
  title: "ShopHub — Premium Online Shopping",
  description:
    "Discover premium fashion, accessories, and lifestyle products at ShopHub. Enjoy fast shipping, easy returns, and an unmatched shopping experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
