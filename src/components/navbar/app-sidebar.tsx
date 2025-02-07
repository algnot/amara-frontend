"use client";
import * as React from "react";
import { Table2, User2, NotebookText } from "lucide-react";

import { NavMain } from "@/components/navbar/nav-main";
import { NavUser } from "@/components/navbar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

const navUser = [
  {
    title: "แดชบอร์ด",
    url: "#",
    icon: Table2,
    isActive: true,
    items: [
      {
        title: "ข้อมูลนักเรียน",
        url: "/dashboard/",
      }
    ],
  },
  {
    title: "ข้อมูล",
    url: "#",
    icon: NotebookText,
    isActive: true,
    items: [
      {
        title: "หลังสูตรทั้งหมด",
        url: "/dashboard/problems",
      },
      {
        title: "พนักงานขาย",
        url: "/dashboard/problems",
      }
    ],
  },
];

const navAdmin = [
  {
    title: "ผู้ใช้งาน",
    url: "/dashboard/users",
    icon: User2,
    isActive: true,
    items: [
      {
        title: "ผู้ใช้งานทั้งหมด",
        url: "/dashboard/admin/users",
      }
    ],
  }
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent className="mt-5">
        <NavMain items={navUser} title="แดชบอร์ด" />
        <NavMain items={navAdmin} title="สำหรับผู้ดูแลระบบ" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
