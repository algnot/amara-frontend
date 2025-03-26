"use client";
import { DataTable } from "@/components/datatable/datatable";
import { useAlertContext } from "@/components/provider/alert-provider";
import { useFullLoadingContext } from "@/components/provider/full-loading-provider";
import { useNavigateContext } from "@/components/provider/navigation-provider";
import { Button } from "@/components/ui/button";
import { BackendClient } from "@/lib/request";
import { isErrorResponse } from "@/types/request";
import Link from "next/link";
import React, { useEffect } from "react";

export default function Page() {
  const setLoading = useFullLoadingContext();
  const setNavigation = useNavigateContext();
  const setAlert = useAlertContext();
  const client = new BackendClient();

  useEffect(() => {
    setLoading(false);
    setNavigation([], "หลักสูตร");
  }, [setLoading, setNavigation]);

  const exportPdf = async () => {
    const response = await client.exportCourseCSV();

    if (isErrorResponse(response)) {
      setLoading(false);
      setAlert("ผิดพลาด", response.message, 0, true);
      return;
    }

    const blob = new Blob([response], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "course_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setLoading(false);
  };

  return (
    <div className="container mx-auto py-10 px-5">
      <div className="flex justify-end gap-2">
        <Link href="/dashboard/course/add">
          <Button>เพิ่มหลักสูตร</Button>
        </Link>
        <Button onClick={exportPdf}>Export ข้อมูลหลักสูตร</Button>
      </div>
      <DataTable
        fetchData={(limit, offset, text) =>
          client.listCourse(limit, offset, text)
        }
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
