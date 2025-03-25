"use client";
import { DataTable } from "@/components/datatable/datatable";
import { useFullLoadingContext } from "@/components/provider/full-loading-provider";
import { useNavigateContext } from "@/components/provider/navigation-provider";
import { BackendClient } from "@/lib/request";
import React, { useEffect } from "react";

export default function Page() {
  const setLoading = useFullLoadingContext();
  const setNavigation = useNavigateContext();
  const client = new BackendClient();

  useEffect(() => {
    setLoading(false);
    setNavigation([], "คำขอใบประกาศ");
  }, [setLoading, setNavigation]);

  return (
    <div className="container mx-auto py-10 px-5">
      <DataTable
        fetchData={(limit, offset, text) => client.listDraftCertificate(limit, offset, text)}
        columns={[
          { key: "certificate_number", label: "เลขที่ใบประกาศ" },
          { key: "batch", label: "รุ่นที่" },
          { key: "start_date", label: "วันที่เริ่มเรียน" },
          { key: "end_date", label: "วันที่เรียนจบ" },
        ]}
        href="/dashboard/certificate/edit/"
        navigateKey="certificate_number"
        hideSearch
      />
    </div>
  );
}
