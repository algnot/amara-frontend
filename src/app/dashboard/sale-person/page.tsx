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
    setNavigation([], "พนักงานขาย");
  }, [setLoading, setNavigation]);

  return (
    <div className="container mx-auto py-10 px-5">
      <div className="flex justify-end">
        <Link href="/dashboard/sale-person/add">
          <Button>เพิ่มพนักงานขาย</Button>
        </Link>
      </div>
      <DataTable
        fetchData={client.listSalePerson}
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
