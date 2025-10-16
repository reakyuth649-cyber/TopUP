import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reak Topup",
  description: "Gaming top-up service for Mobile Legends and more",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
