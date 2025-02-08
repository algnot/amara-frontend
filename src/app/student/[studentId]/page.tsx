"use client";
import { useAlertContext } from "@/components/provider/alert-provider";
import { useFullLoadingContext } from "@/components/provider/full-loading-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BackendClient } from "@/lib/request";
import { isErrorResponse, StudentResponse } from "@/types/request";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type PageProps = {
  params: Promise<{ studentId: string[] }>;
};

export default function Page({ params }: PageProps) {
  const client = new BackendClient();
  const setAlert = useAlertContext();
  const setLoading = useFullLoadingContext();
  const [studentData, setStudentData] = useState<StudentResponse>();

  const fetchData = async () => {
    const { studentId } = await params;
    const studentID = Array.isArray(studentId) ? studentId[0] : studentId;
    const response = await client.getStudentByStudentCode(studentID);

    if (isErrorResponse(response)) {
      setAlert("ผิดพลาด", response.message, 0, false);
      setLoading(false);
      return;
    }
    setStudentData(response);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-blue-300">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <div className="flex justify-center mt-4">
              <Image
                src="/logo-th.jpg"
                alt="logo-th"
                width={180}
                height={180}
              />
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">บัตรนักเรียน</CardTitle>
              <CardDescription>
                โรงเรียนอมารา นวดเพื่อสุขภาพ เสริมความงาม
              </CardDescription>
              <CardContent className="p-0">
                <div className="flex flex-col gap-6 mt-6">
                  <div className="grid gap-2">
                    <Label>รหัสนักเรียน</Label>
                    <div className="text-xl">{studentData?.student_id}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-6 mt-6">
                  <div className="grid gap-2">
                    <Label>ชื่อ - นามสกุล (ภาษาไทย)</Label>
                    <div className="text-xl">
                      {studentData?.firstname_th} {studentData?.lastname_th}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-6 mt-6">
                  <div className="grid gap-2">
                    <Label>ชื่อ - นามสกุล (ภาษาอังกฤษ)</Label>
                    <div className="text-xl">
                      {studentData?.firstname_en} {studentData?.lastname_en}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-6 mt-6">
                  <div className="grid gap-2">
                    <Label>ผู้ดูแล</Label>
                    <div className="text-xl">
                      {studentData?.sale_person}
                    </div>
                  </div>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
