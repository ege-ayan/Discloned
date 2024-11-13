import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Discord Clone",
  description: "Open Source Discord Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
