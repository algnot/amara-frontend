import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import "./globals.css";
import { AlertDialogProvider } from "@/components/provider/alert-provider";
import { Suspense } from "react";
import { FullLoadingProvider } from "@/components/provider/full-loading-provider";
import { UserProvider } from "@/components/provider/user-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/provider/theme-provider";

export const metadata: Metadata = {
  title: "โรงเรียนอมารา",
  description: "โรงเรียนอมารา นวดเพื่อสุขภาพ เสริมความงาม",
};

const baseFont = Chakra_Petch({
  weight: "400",
  subsets: ["thai", "latin", "latin-ext", "vietnamese"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={baseFont.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Suspense fallback={<div></div>}>
            <UserProvider>
              <AlertDialogProvider>
                <FullLoadingProvider>{children}</FullLoadingProvider>
              </AlertDialogProvider>
            </UserProvider>
          </Suspense>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
