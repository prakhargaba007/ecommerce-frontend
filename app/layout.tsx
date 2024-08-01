// app/layout.tsx
import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { ColorSchemeScript } from "@mantine/core";
import { ClientProviders } from "../components/ClientProviders";

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
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
