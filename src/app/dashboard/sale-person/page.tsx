"use client";
import { DataTable } from "@/components/datatable/datatable";
import { useAlertContext } from "@/components/provider/alert-provider";
import { useFullLoadingContext } from "@/components/provider/full-loading-provider";
import { useNavigateContext } from "@/components/provider/navigation-provider";
import { useUserContext } from "@/components/provider/user-provider";
import { Button } from "@/components/ui/button";
import { BackendClient } from "@/lib/request";
import { isErrorResponse } from "@/types/request";
import Link from "next/link";
import React, { useEffect } from "react";

export default function Page() {
  const setLoading = useFullLoadingContext();
  const setNavigation = useNavigateContext();
  const user = useUserContext();
  const setAlert = useAlertContext();
  const client = new BackendClient();

  useEffect(() => {
    setLoading(false);
    setNavigation([], "พนักงานขาย");
  }, [setLoading, setNavigation]);

  const exportPdf = async () => {
    const response = await client.exportSalePersonCSV();

    if (isErrorResponse(response)) {
      setLoading(false);
      setAlert("ผิดพลาด", response.message, 0, true);
      return;
    }

    const blob = new Blob([response], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "sale_person_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setLoading(false);
  };

  return (
    <div className="container mx-auto py-10 px-5">
      <div className="flex justify-end gap-2">
        {user?.permissions?.includes("modify-sale-person-data") && (
          <Link href="/dashboard/sale-person/add">
            <Button>เพิ่มพนักงานขาย</Button>
          </Link>
        )}
        {user?.permissions?.includes("export-certificate-data") && (
          <Button onClick={exportPdf}>Export ข้อมูลพนักงานขาย</Button>
        )}
      </div>
      <DataTable
        fetchData={(limit, offset, text) =>
          client.listSalePerson(limit, offset, text)
        }
        columns={[
          { key: "reference_code", label: "รหัส" },
          { key: "firstname", label: "ชื่อ" },
          { key: "lastname", label: "นามสกุล" },
        ]}
        href="/dashboard/sale-person/edit/"
        navigateKey="id"
      />
    </div>
  );
}
