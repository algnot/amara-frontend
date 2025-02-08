"use client";
import { DataTable } from "@/components/datatable/datatable";
import { useFullLoadingContext } from "@/components/provider/full-loading-provider";
import { useNavigateContext } from "@/components/provider/navigation-provider";
import { Button } from "@/components/ui/button";
import { BackendClient } from "@/lib/request";
import Link from "next/link";
import React, { useEffect } from "react";

export default function Page() {
  const setLoading = useFullLoadingContext();
  const setNavigation = useNavigateContext();
  const client = new BackendClient();

  useEffect(() => {
    setLoading(false);
    setNavigation([], "หลักสูตร");
  }, [setLoading, setNavigation]);

  return (
    <div className="container mx-auto py-10 px-5">
      <div className="flex justify-end">
        <Link href="/dashboard/course/add">
          <Button>เพิ่มหลักสูตร</Button>
        </Link>
      </div>
      <DataTable
        fetchData={client.listCourse}
        columns={[
          { key: "course_code", label: "รหัสวิชา" },
          { key: "name_th", label: "ชื่อ (ไทย)" },
          { key: "name_en", label: "ชื่อ (อังกฤษ)" },
        ]}
        href="/dashboard/course/edit/"
        navigateKey="id"
      />
    </div>
  );
}
