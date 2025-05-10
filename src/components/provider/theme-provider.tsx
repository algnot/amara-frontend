"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <>
      {(process.env.NEXT_PUBLIC_ENV ?? "local") != "production" && (
        <div className="fixed bottom-0 right-0 z-50 m-2 rounded-lg bg-gray-800 p-2 text-white text-sm">
          <p>development Mode</p>
          <p>env: {process.env.NEXT_PUBLIC_ENV}</p>
        </div>
      )}
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </>
  );
}
