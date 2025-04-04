"use client";
import { LucideIcon, Table2, User2 } from "lucide-react";
import { useEffect, useState } from "react";

import { NavMain } from "@/components/navbar/nav-main";
import { NavUser } from "@/components/navbar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUserContext } from "../provider/user-provider";

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUserContext();
  const [navUser, setNavUser] = useState<NavItem[]>([]);
  const [navAdmin, setNavAdmin] = useState<NavItem[]>([]);

  const buildUserNav = () => {
    if (!user) return;

    const navs: NavItem[] = [];
    const studentItems: NavItem[] = [];
    const courseItems: NavItem[] = [];

    if (user.permissions.includes("read-student-data")) {
      studentItems.push({ title: "นักเรียน", url: "/dashboard" });
    }

    if (user.permissions.includes("read-certificate-data")) {
      studentItems.push({
        title: "คำขอใบประกาศ",
        url: "/dashboard/draft-certificate",
      });
    }

    if (user.permissions.includes("read-certificate-data")) {
      studentItems.push({
        title: "ใบประกาศทั้งหมด",
        url: "/dashboard/certificate",
      });
    }

    if (user.permissions.includes("read-course-data")) {
      courseItems.push({ title: "หลักสูตร", url: "/dashboard/course" });
    }

    if (user.permissions.includes("read-sale-person-data")) {
      courseItems.push({ title: "พนักงานขาย", url: "/dashboard/sale-person" });
    }

    if (studentItems.length > 0) {
      navs.push({
        title: "ข้อมูลนักเรียน",
        url: "#",
        icon: Table2,
        isActive: true,
        items: studentItems,
      });
    }

    if (courseItems.length > 0) {
      navs.push({
        title: "ข้อมูลหลักสูตร",
        url: "#",
        icon: Table2,
        isActive: true,
        items: courseItems,
      });
    }

    setNavUser(navs);
  };

  const buildAdminNav = () => {
    if (!user) return;

    const items: NavItem[] = [];

    if (["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      items.push({ title: "ผู้ใช้งานทั้งหมด", url: "/dashboard/admin/users" });

      if (user.role === "SUPER_ADMIN") {
        items.push({
          title: "สิทธิ์การเข้าถึง",
          url: "/dashboard/admin/permission",
        });
      }

      setNavAdmin([
        {
          title: "ผู้ดูแลระบบ",
          url: "#",
          icon: User2,
          isActive: true,
          items,
        },
      ]);
    }
  };

  useEffect(() => {
    buildUserNav();
    buildAdminNav();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent className="pt-5">
        <NavMain items={navUser} title={navUser.length > 0 ? "แดชบอร์ด" : ""} />
        <NavMain
          items={navAdmin}
          title={navAdmin.length > 0 ? "สำหรับผู้ดูแลระบบ" : ""}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
