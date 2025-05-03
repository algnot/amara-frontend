"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import { Suspense, useEffect } from "react";
import { AlertDialogProvider } from "@/components/provider/alert-provider";
import { FullLoadingProvider } from "@/components/provider/full-loading-provider";
import { UserProvider } from "@/components/provider/user-provider";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { BackendClient } from "@/lib/request";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = new BackendClient();

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === "/maintenance") return;

    client.healthCheck().then((res) => {
      if (!res) {
        window.location.href = "/maintenance";
      }
    });
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <Suspense fallback={<div></div>}>
        <UserProvider>
          <AlertDialogProvider>
            <FullLoadingProvider>{children}</FullLoadingProvider>
          </AlertDialogProvider>
        </UserProvider>
      </Suspense>
      <SpeedInsights />
    </ThemeProvider>
  );
}
