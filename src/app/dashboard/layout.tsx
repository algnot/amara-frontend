"use client"
import { AppSidebar } from "@/components/navbar/app-sidebar";
import NavigationProvider from "@/components/provider/navigation-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavigationProvider>
          {children}
        </NavigationProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
