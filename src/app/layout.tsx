import type { Metadata } from "next";
import { Chakra_Petch } from 'next/font/google'
import "./globals.css";

export const metadata: Metadata = {
  title: "โรงเรียนอมารา",
  description: "โรงเรียนอมารา นวดเพื่อสุขภาพ เสริมความงาม",
};

const baseFont = Chakra_Petch({ weight: "400" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={baseFont.className}>
        {children}
      </body>
    </html>
  );
}
