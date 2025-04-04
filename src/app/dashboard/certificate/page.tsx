"use client";
import { DataTable } from "@/components/datatable/datatable";
import { useAlertContext } from "@/components/provider/alert-provider";
import { useFullLoadingContext } from "@/components/provider/full-loading-provider";
import { useNavigateContext } from "@/components/provider/navigation-provider";
import { useUserContext } from "@/components/provider/user-provider";
import { Button } from "@/components/ui/button";
import { BackendClient } from "@/lib/request";
import { isErrorResponse } from "@/types/request";
import React, { useEffect } from "react";

export default function Page() {
  const setLoading = useFullLoadingContext();
  const setNavigation = useNavigateContext();
  const setAlert = useAlertContext();
  const client = new BackendClient();
  const user = useUserContext();

  useEffect(() => {
    setLoading(false);
    setNavigation([], "ใบประกาศทั้งหมด");
  }, [setLoading, setNavigation]);

  const exportPdf = async () => {
    const response = await client.exportCertificateCSV();

    if (isErrorResponse(response)) {
      setLoading(false);
      setAlert("ผิดพลาด", response.message, 0, true);
      return;
    }

    const blob = new Blob([response], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "certificate_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setLoading(false);
  };

  return (
    <div className="container mx-auto py-10 px-5">
      {user?.permissions?.includes("export-certificate-data") && (
        <div className="flex justify-end">
          <Button onClick={exportPdf}>Export ข้อมูลใบประกาศ</Button>
        </div>
      )}
      <DataTable
        fetchData={(limit, offset, text) =>
          client.listCertificate(limit, offset, text)
        }
        columns={[
          { key: "certificate_number", label: "เลขที่ใบประกาศ" },
          { key: "batch", label: "รุ่นที่" },
          { key: "start_date", label: "วันที่เริ่มเรียน" },
          { key: "end_date", label: "วันที่เรียนจบ" },
        ]}
        href="/dashboard/certificate/edit/"
        navigateKey="certificate_number"
      />
    </div>
  );
}
