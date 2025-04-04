"use client";
import { useAlertContext } from "@/components/provider/alert-provider";
import { useFullLoadingContext } from "@/components/provider/full-loading-provider";
import { useNavigateContext } from "@/components/provider/navigation-provider";
import { useUserContext } from "@/components/provider/user-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackendClient } from "@/lib/request";
import { isErrorResponse } from "@/types/request";
import { ChevronDown } from "lucide-react";
import React, { FormEvent, useEffect, useRef, useState } from "react";

export interface Version {
  name: string;
  value: string;
}
export default function Page() {
  const client = new BackendClient();
  const setAlert = useAlertContext();
  const setNavigation = useNavigateContext();
  const setFullLoading = useFullLoadingContext();
  const user = useUserContext();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [allVersion] = useState<Version[]>([
    {
      name: "1.0 (มี รุ่นที่)",
      value: "1",
    },
    {
      name: "2.0 (ไม่มี รุ่นที่)",
      value: "2",
    },
  ]);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);

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
      version: selectedVersion?.value ?? "1",
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
              disabled={!user?.permissions?.includes("modify-course-data")}
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
              disabled={!user?.permissions?.includes("modify-course-data")}
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
              disabled={!user?.permissions?.includes("modify-course-data")}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label>Version ใบประกาศ</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={!user?.permissions?.includes("modify-course-data")}
                  variant="outline"
                  className={`flex justify-between ${
                    selectedVersion == null && "text-gray-400"
                  }`}
                >
                  {selectedVersion == null ? (
                    <>
                      เลือก <ChevronDown className="h-4 w-4" />
                    </>
                  ) : (
                    <>{selectedVersion.name}</>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="max-h-60 overflow-y-auto"
              >
                {allVersion.map((value, index) => {
                  return (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => setSelectedVersion(value)}
                    >
                      {value.name}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex justify-between items-center">
            <div></div>
            <div>
              {user?.permissions?.includes("modify-course-data") && (
                <Button type="submit" className="w-full">
                  เพิ่มหลักสูตร
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
