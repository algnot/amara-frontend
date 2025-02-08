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
    title: "ข้อมูลนักเรียน",
    url: "#",
    icon: Table2,
    isActive: true,
    items: [
      {
        title: "นักเรียน",
        url: "/dashboard",
      },
      {
        title: "คำขอใบประกาศ",
        url: "/dashboard/draft-certificate",
      },
      {
        title: "ใบประกาศทั้งหมด",
        url: "/dashboard/certificate",
      },
    ],
  },
  {
    title: "ข้อมูลโรงเรียน",
    url: "#",
    icon: NotebookText,
    isActive: true,
    items: [
      // {
      //   title: "สถาบัน",
      //   url: "/dashboard/school",
      // },
      {
        title: "หลักสูตร",
        url: "/dashboard/course",
      },
      {
        title: "พนักงานขาย",
        url: "/dashboard/sale-person",
      }
    ],
  },
];

const navAdmin = [
  {
    title: "ผู้ใช้งาน",
    url: "/dashboard/admin/users",
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
      <SidebarContent className="pt-5">
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
