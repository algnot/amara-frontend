import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "./root-layout-client";

const baseFont = Chakra_Petch({
  weight: "400",
  subsets: ["thai", "latin", "latin-ext", "vietnamese"],
});

export const metadata: Metadata = {
  title: "โรงเรียนอมารา",
  description: "โรงเรียนอมารา นวดเพื่อสุขภาพ เสริมความงาม",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={baseFont.className}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
