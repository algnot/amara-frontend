"use client";
import { useAlertContext } from "@/components/provider/alert-provider";
import { useFullLoadingContext } from "@/components/provider/full-loading-provider";
import { useNavigateContext } from "@/components/provider/navigation-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackendClient } from "@/lib/request";
import { isErrorResponse } from "@/types/request";
import React, { FormEvent, useEffect, useRef } from "react";

export default function Page() {
  const client = new BackendClient();
  const setAlert = useAlertContext();
  const setNavigation = useNavigateContext();
  const setFullLoading = useFullLoadingContext();
  const formRef = useRef<HTMLFormElement | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFullLoading(true);
    const form = formRef.current;
    const course_code = form?.course_code?.value ?? "";
    const name_th = form?.name_th?.value ?? "";
    const name_en = form?.name_en?.value ?? "";

    const response = await client.addNewCourse({
      course_code,
      name_th,
      name_en,
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
          window.location.href = "/dashboard/course";
        },
        false
      );
  };

  useEffect(() => {
    setNavigation(
      [
        {
          name: "หลักสูตร",
          path: "/dashboard/course",
        },
      ],
      "เพิ่มหลักสูตร"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form ref={formRef} onSubmit={onSubmit} className="m-6">
      <div className="flex justify-between items-center mb-6 ">
        <div className="ml-4">เพิ่มหลักสูตร</div>
        {/* <div className="">
          <Button type="submit" className="w-full">
            เพิ่มพนักงานขาย
          </Button>
        </div> */}
      </div>
      <div className="p-6 border rounded-lg">
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="course_code">รหัสวิชา</Label>
            <Input
              id="course_code"
              name="course_code"
              type="text"
              placeholder="รหัสวิชา"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name_th">ชื่อหลักสูตร (ไทย)</Label>
            <Input
              id="name_th"
              name="name_th"
              type="text"
              placeholder="ชื่อหลักสูตร (ไทย)"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name_en">ชื่อหลักสูตร (อังกฤษ)</Label>
            <Input
              id="name_en"
              name="name_en"
              type="text"
              placeholder="ชื่อหลักสูตร (อังกฤษ)"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <div className=""></div>
            <div className="">
              <Button type="submit" className="w-full">
                เพิ่มหลักสูตร
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
