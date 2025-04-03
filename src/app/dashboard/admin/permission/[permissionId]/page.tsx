"use client";
import { useAlertContext } from "@/components/provider/alert-provider";
import { useFullLoadingContext } from "@/components/provider/full-loading-provider";
import { useNavigateContext } from "@/components/provider/navigation-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackendClient } from "@/lib/request";
import { AddPermissionResponse, isErrorResponse } from "@/types/request";
import React, { useEffect, useRef, useState } from "react";

type PageProps = {
  params: Promise<{ permissionId: string[] }>;
};

export default function Page({ params }: PageProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const setLoading = useFullLoadingContext();
  const setNavigation = useNavigateContext();
  const setAlert = useAlertContext();
  const client = new BackendClient();
  const [permissionData, setPermissionData] = useState<AddPermissionResponse>();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const form = formRef.current;
    const key = form?.key?.value ?? "";
    const name = form?.permissionName?.value ?? "";
    const description = form?.description?.value ?? "";

    const { permissionId } = await params;
    const permissionID = Array.isArray(permissionId)
      ? permissionId[0]
      : permissionId;

    const response = await client.updatePermissionById(permissionID, {
      key: key,
      name: name,
      description: description,
    });

    if (isErrorResponse(response)) {
      setLoading(false);
      setAlert("ผิดพลาด", response.message, 0, true);
      return;
    }

    setAlert(
      "แก้ไขข้อมูลสำเร็จ",
      "ระบบได้แก้ไขข้อมูลของคุณเรียบร้อยแล้ว",
      () => {
        window.location.href = "/dashboard/admin/permission";
      },
      false
    );
  };

  const fetchData = async () => {
    const { permissionId } = await params;
    const permissionID = Array.isArray(permissionId)
      ? permissionId[0]
      : permissionId;
    const response = await client.getPermissionById(permissionID);

    setLoading(false);

    if (isErrorResponse(response)) {
      setAlert("ผิดพลาด", response.message, 0, true);
      setLoading(false);
      return;
    }

    setPermissionData(response);
    setNavigation(
      [
        {
          name: "สิทธิ์การใช้งาน",
          path: "/dashboard/admin/permission",
        },
      ],
      response.name
    );
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="m-6">
      <div className="mb-4">
        {permissionData?.name} ({permissionData?.key})
      </div>
      <form className="p-6 border rounded-lg" ref={formRef} onSubmit={onSubmit}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="batch">Key</Label>
            <Input
              id="key"
              name="key"
              type="text"
              defaultValue={permissionData?.key ?? ""}
              placeholder="key"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="permissionName">Name</Label>
            <Input
              id="permissionName"
              name="permissionName"
              type="text"
              placeholder="name"
              defaultValue={permissionData?.name ?? ""}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="batch">Description</Label>
            <Input
              id="description"
              name="description"
              type="text"
              placeholder="description"
              defaultValue={permissionData?.description ?? ""}
              required
            />
          </div>
          <div className="flex justify-between items-center mt-4">
            <div></div>
            <div>
              <Button type="submit" className="w-full">
                บันทึกข้อมูล
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
