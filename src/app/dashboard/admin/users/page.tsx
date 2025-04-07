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
    setNavigation([], "Users");
  }, [setLoading, setNavigation]);

  return (
    <div className="container mx-auto py-10 px-5">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            window.location.href = "/dashboard/admin/users/create";
          }}
        >
          เพิ่มผู้ใช้งาน
        </Button>
      </div>
      <DataTable
        fetchData={(limit, offset, text) =>
          client.listUser(limit, offset, text)
        }
        columns={[
          { key: "uid", label: "ID" },
          { key: "email", label: "Login" },
          { key: "username", label: "Name" },
          { key: "role", label: "Role" },
        ]}
        href="/dashboard/admin/users/"
        navigateKey="uid"
      />
    </div>
  );
}
