import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "./root-layout-client";

const baseFont = Noto_Sans_Thai({
  weight: "400",
  subsets: ["thai", "latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "โรงเรียนอมารา",
  description: "โรงเรียนอมารา นวดเพื่อสุขภาพ เสริมความงาม",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={baseFont.className}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
