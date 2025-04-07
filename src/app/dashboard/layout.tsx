"use client";
import { AppSidebar } from "@/components/navbar/app-sidebar";
import NavigationProvider from "@/components/provider/navigation-provider";
import { useUserContext } from "@/components/provider/user-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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
    } else if (user?.role === "STUDENT") {
      window.location.href = "/student/dashboard";
    }
  }, [user]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavigationProvider>{children}</NavigationProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
