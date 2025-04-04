"use client";
import { useAlertContext } from "@/components/provider/alert-provider";
import { useFullLoadingContext } from "@/components/provider/full-loading-provider";
import { useNavigateContext } from "@/components/provider/navigation-provider";
import { useUserContext } from "@/components/provider/user-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackendClient } from "@/lib/request";
import { isErrorResponse, SalePerson } from "@/types/request";
import React, { FormEvent, useEffect, useRef, useState } from "react";

type PageProps = {
  params: Promise<{ salePersonId: string[] }>;
};

export default function Page({ params }: PageProps) {
  const client = new BackendClient();
  const setAlert = useAlertContext();
  const user = useUserContext();
  const setNavigation = useNavigateContext();
  const setFullLoading = useFullLoadingContext();
  const setLoading = useFullLoadingContext();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [defaultValue, setDefaultValue] = useState<SalePerson>();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFullLoading(true);
    const form = formRef.current;
    const firstname = form?.firstname?.value ?? "";
    const lastname = form?.lastname?.value ?? "";
    const code = form?.code?.value ?? "";

    const { salePersonId } = await params;
    const salePersonID = Array.isArray(salePersonId)
      ? salePersonId[0]
      : salePersonId;
    const response = await client.updateSalePersonById(salePersonID, {
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
      "อัพเดทข้อมูลสำเร็จ",
      "ระบบอัพเดทข้อมูลให้คุณเรียบร้อยแล้ว",
      () => {
        window.location.href = "/dashboard/sale-person";
      },
      false
    );
  };

  const fetchData = async () => {
    const { salePersonId } = await params;
    const salePersonID = Array.isArray(salePersonId)
      ? salePersonId[0]
      : salePersonId;
    const response = await client.getSalePersonById(salePersonID);

    if (isErrorResponse(response)) {
      setAlert("ผิดพลาด", response.message, 0, false);
      setLoading(false);
      return;
    }

    setNavigation(
      [
        {
          name: "พนักงานขาย",
          path: "/dashboard/sale-person",
        },
      ],
      `${response.firstname} ${response.lastname}`
    );
    setDefaultValue(response);
  };

  useEffect(() => {
    if(!defaultValue) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  return (
    <form ref={formRef} onSubmit={onSubmit} className="m-6">
      <div className="flex justify-between items-center mb-6 ">
        <div className="ml-4">{defaultValue?.firstname} {defaultValue?.lastname}</div>
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
              defaultValue={defaultValue?.firstname}
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
              defaultValue={defaultValue?.lastname}
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
              defaultValue={defaultValue?.reference_code}
              disabled={!user?.permissions?.includes("modify-sale-person-data")}
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <div className=""></div>
            <div className="">
              {user?.permissions?.includes("modify-sale-person-data") && (
                <Button type="submit" className="w-full">
                  บันทึกข้อมูล
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
