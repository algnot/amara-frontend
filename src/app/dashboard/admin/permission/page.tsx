"use client";
import { useNavigateContext } from "@/components/provider/navigation-provider";
import { useEffect } from "react";
import { BackendClient } from "@/lib/request";
import { useFullLoadingContext } from "@/components/provider/full-loading-provider";
import { DataTable } from "@/components/datatable/datatable";
import { Button } from "@/components/ui/button";

export default function Page() {
  const setLoading = useFullLoadingContext();
  const setNavigation = useNavigateContext();
  const client = new BackendClient();

  useEffect(() => {
    setLoading(false);
    setNavigation([], "สิทธิ์การใช้งาน");
  }, [setLoading, setNavigation]);

  return (
    <div className="container mx-auto py-10 px-5">
      <div className="flex justify-end">
        <Button onClick={() => { window.location.href = "/dashboard/admin/permission/create" }}>เพิ่มสิทธิ์การใช้งาน</Button>
      </div>
      <DataTable
        fetchData={(limit, offset, text) =>
          client.listPermission(limit, offset, text)
        }
        columns={[
          { key: "id", label: "ID" },
          { key: "key", label: "Key" },
          { key: "name", label: "Name" },
        ]}
        href="/dashboard/admin/permission/"
        navigateKey="id"
      />
    </div>
  );
}
