"use client";
import { useAlertContext } from "@/components/provider/alert-provider";
import { useFullLoadingContext } from "@/components/provider/full-loading-provider";
import { useNavigateContext } from "@/components/provider/navigation-provider";
import { useUserContext } from "@/components/provider/user-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackendClient } from "@/lib/request";
import { isErrorResponse } from "@/types/request";
import React, { FormEvent, useEffect, useRef } from "react";

export default function Page() {
  const client = new BackendClient();
  const user = useUserContext();
  const setAlert = useAlertContext();
  const setNavigation = useNavigateContext();
  const setFullLoading = useFullLoadingContext();
  const formRef = useRef<HTMLFormElement | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFullLoading(true);
    const form = formRef.current;
    const firstname = form?.firstname?.value ?? "";
    const lastname = form?.lastname?.value ?? "";
    const code = form?.code?.value ?? "";

    const response = await client.addNewSalePerson({
      firstname: firstname,
      lastname: lastname,
      code: code,
    });

    if (isErrorResponse(response)) {
      setFullLoading(false);
      setAlert("ผิดพลาด", response.message, 0, true);
      return;
    }

    setAlert(
      "เพิ่มข้อมูลสำเร็จ",
      "ระบบเพิ่มข้อมูลให้คุณเรียบร้อยแล้ว",
      () => {
        window.location.href = "/dashboard/sale-person";
      },
      false
    );
  };

  useEffect(() => {
    setNavigation(
      [
        {
          name: "พนักงานขาย",
          path: "/dashboard/sale-person",
        },
      ],
      "เพิ่มพนักงานขาย"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form ref={formRef} onSubmit={onSubmit} className="m-6">
      <div className="flex justify-between items-center mb-6 ">
        <div className="ml-4">เพิ่มพนักงานขาย</div>
      </div>
      <div className="p-6 border rounded-lg">
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="firstname">ชื่อ</Label>
            <Input
              id="firstname"
              name="firstname"
              type="text"
              placeholder="ชื่อ"
              disabled={!user?.permissions?.includes("modify-sale-person-data")}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastname">นามสกุล</Label>
            <Input
              id="lastname"
              name="lastname"
              type="text"
              placeholder="นามสกุล"
              disabled={!user?.permissions?.includes("modify-sale-person-data")}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="code">รหัสผู้ขาย</Label>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="รหัสผู้ขาย"
              disabled={!user?.permissions?.includes("modify-sale-person-data")}
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <div className=""></div>
            <div className="">
              {user?.permissions?.includes("modify-sale-person-data") && (
                <Button type="submit" className="w-full">
                  เพิ่มพนักงานขาย
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
