"use client";
import { DataTable } from "@/components/datatable/datatable";
import { useAlertContext } from "@/components/provider/alert-provider";
import { useFullLoadingContext } from "@/components/provider/full-loading-provider";
import { useNavigateContext } from "@/components/provider/navigation-provider";
import { Button } from "@/components/ui/button";
import { BackendClient } from "@/lib/request";
import { isErrorResponse } from "@/types/request";
import React, { useEffect } from "react";

export default function Page() {
  const setLoading = useFullLoadingContext();
  const setAlert = useAlertContext();
  const setNavigation = useNavigateContext();
  const client = new BackendClient();

  useEffect(() => {
    setLoading(false);
    setNavigation([], "นักเรียน");
  }, [setLoading, setNavigation]);

  const exportPdf = async () => {
    const response = await client.exportStudentCSV();

    if (isErrorResponse(response)) {
      setLoading(false);
      setAlert("ผิดพลาด", response.message, 0, true);
      return;
    }

    const blob = new Blob([response], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "student_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setLoading(false);
  };

  return (
    <div className="container mx-auto py-10 px-5">
      <div className="flex justify-end">
        <Button onClick={exportPdf}>Export ข้อมูลนักเรียน</Button>
      </div>
      <DataTable
        fetchData={(limit, offset, text) =>
          client.listStudent(limit, offset, text)
        }
        columns={[
          { key: "student_id", label: "รหัสนักเรียน" },
          { key: "firstname_th", label: "ชื่อ (ไทย)" },
          { key: "lastname_th", label: "นามสกุล (ไทย)" },
          { key: "firstname_en", label: "ชื่อ (อังกฤษ)" },
          { key: "lastname_en", label: "นามสกุล (อังกฤษ)" },
        ]}
        href="/dashboard/student/edit/"
        navigateKey="student_id"
      />
    </div>
  );
}
