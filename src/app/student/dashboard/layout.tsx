"use client";
import { useUserContext } from "@/components/provider/user-provider";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useUserContext();
  useEffect(() => {
    if (user?.uid == 0) {
      window.location.href = "/login";
    } else if (
      user?.role === "ADMIN" ||
      user?.role === "SUPER_ADMIN" ||
      user?.role === "USER"
    ) {
      window.location.href = "/dashboard";
    }
  }, [user]);

  return <div>{children}</div>;
}
