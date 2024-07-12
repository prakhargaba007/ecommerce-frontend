import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { Notifications } from "@mantine/notifications";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { HeaderMegaMenu } from "@/components/header/HeaderMegaMenu";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Notes App",
  description:
    "It is an intuitive and powerful note-taking app designed to help you capture and organize your thoughts, ideas, and important information effortlessly.",
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
      </head>
      <body>
        <MantineProvider>
          <Notifications position="bottom-right" />
          <HeaderMegaMenu />
          {children}
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="lazyOnload"
          />
        </MantineProvider>
      </body>
    </html>
  );
}
