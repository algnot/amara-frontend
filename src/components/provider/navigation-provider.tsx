"use client";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { ModeToggle } from "../ui/switch-themes";

interface NavigationItem {
  name: string;
  path: string;
}

const NavigationContext = createContext(
  (items: NavigationItem[], active: string) => {
    return { items, active };
  },
);

export default function NavigationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [navigateItems, setNavigateItems] = useState<NavigationItem[]>([]);
  const [activeNavigate, setActiveNavigate] = useState<string>("");

  const onSetNavigateItems = useCallback(
    (items: NavigationItem[], active: string) => {
      setNavigateItems(items);
      setActiveNavigate(active);
      return { items, active };
    },
    [],
  );

  return (
    <NavigationContext.Provider value={onSetNavigateItems}>
      <header className="sticky top-0 z-10 w-full flex h-[var(--header-height)] items-center gap-2 border-b bg-background/20 backdrop-blur-md transition-all ease-linear rounded-t-xl py-2">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  โรงเรียนอมารา นวดเพื่อสุขภาพ เสริมความงาม
                </BreadcrumbLink>
              </BreadcrumbItem>

              {navigateItems.map((navigateItem) => {
                return (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem
                      key={navigateItem.name}
                      className="hidden md:block"
                    >
                      <BreadcrumbLink href={navigateItem.path}>
                        {navigateItem.name}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                );
              })}

              {activeNavigate != "" && (
                <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{activeNavigate}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </div>
      </header>
      {children}
    </NavigationContext.Provider>
  );
}

export const useNavigateContext = () => useContext(NavigationContext);
