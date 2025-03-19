/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useAlertContext } from "@/components/provider/alert-provider";
import { useFullLoadingContext } from "@/components/provider/full-loading-provider";
import { useNavigateContext } from "@/components/provider/navigation-provider";
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
import { CourseResponse, isErrorResponse } from "@/types/request";
import { ChevronDown } from "lucide-react";
import React, { FormEvent, useEffect, useRef, useState } from "react";

type PageProps = {
  params: Promise<{ courseId: string[] }>;
};

export interface Version {
  name: string;
  value: string;
}

export default function Page({ params }: PageProps) {
  const client = new BackendClient();
  const setAlert = useAlertContext();
  const setNavigation = useNavigateContext();
  const setFullLoading = useFullLoadingContext();
  const setLoading = useFullLoadingContext();
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
  const [defaultValue, setDefaultValue] = useState<CourseResponse>();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFullLoading(true);
    const form = formRef.current;
    const course_code = form?.course_code?.value ?? "";
    const name_th = form?.name_th?.value ?? "";
    const name_en = form?.name_en?.value ?? "";

    const { courseId } = await params;
    const courseID = Array.isArray(courseId) ? courseId[0] : courseId;
    const response = await client.updateCourse(courseID, {
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
      "ระบบอัพเดทข้อมูลให้คุณเรียบร้อยแล้ว",
      () => {
        window.location.href = "/dashboard/course/edit/" + courseID;
      },
      false
    );
  };

  const fetchData = async () => {
    const { courseId } = await params;
    const courseID = Array.isArray(courseId) ? courseId[0] : courseId;
    const response = await client.getCourseById(courseID);

    if (isErrorResponse(response)) {
      setAlert("ผิดพลาด", response.message, 0, false);
      setLoading(false);
      return;
    }

    setNavigation(
      [
        {
          name: "หลักสูตร",
          path: "/dashboard/course",
        },
      ],
      `[${response.course_code}] ${response.name_th}`
    );
    if (response.version == "1") {
      setSelectedVersion({
        name: "1.0 (มี รุ่นที่)",
        value: "1",
      });
    } else if (response.version == "2") {
      setSelectedVersion({
        name: "2.0 (ไม่มี รุ่นที่)",
        value: "2",
      });
    }
    setDefaultValue(response);
  };

  useEffect(() => {
    if (!defaultValue) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form ref={formRef} onSubmit={onSubmit} className="m-6">
      <div className="flex justify-between items-center mb-6 ">
        <div className="ml-4">{defaultValue?.name_th}</div>
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
              defaultValue={defaultValue?.course_code}
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
              defaultValue={defaultValue?.name_th}
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
              defaultValue={defaultValue?.name_en}
              required
            />
          </div>
          <div className="grid gap-2 mt-4">
            <Label>Version ใบประกาศ</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
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
            <div className=""></div>
            <div className="">
              <Button type="submit" className="w-full">
                อัพเดทหลักสูตร
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
