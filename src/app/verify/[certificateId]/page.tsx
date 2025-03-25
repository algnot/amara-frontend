/* eslint-disable react-hooks/exhaustive-deps */
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
import { convertToThaiDate } from "@/lib/utils";
import { GetCertificateResponse, isErrorResponse } from "@/types/request";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type PageProps = {
  params: Promise<{ certificateId: string[] }>;
};

export default function Page({ params }: PageProps) {
  const client = new BackendClient();
  const setAlert = useAlertContext();
  const setLoading = useFullLoadingContext();
  const [defaultValue, setDefaultValue] = useState<GetCertificateResponse>();

  const fetchData = async () => {
    const { certificateId } = await params;
    const certificateID = Array.isArray(certificateId)
      ? certificateId[0]
      : certificateId;
    const response = await client.getPublicCertificateById(certificateID);

    if (isErrorResponse(response)) {
      setAlert("ผิดพลาด", response.message, 0, false);
      setLoading(false);
      return;
    }
    setDefaultValue(response);
  };

  useEffect(() => {
    fetchData();
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
              <CardTitle className="text-2xl">
                {defaultValue?.certificate_number}
              </CardTitle>
              <CardDescription className="text-sm">
                โรงเรียนอมารา นวดเพื่อสุขภาพ เสริมความงาม
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2 mt-4">
                  <Label>ชื่อนักเรียน ภาษาไทย</Label>
                  <div>
                    {defaultValue?.student.firstname_th}{" "}
                    {defaultValue?.student.lastname_th}
                  </div>
                </div>
                <div className="grid gap-2 mt-4">
                  <Label>ชื่อนักเรียน ภาษาอังกฤษ</Label>
                  <div>
                    {defaultValue?.student.firstname_en}{" "}
                    {defaultValue?.student.lastname_en}
                  </div>
                </div>
                <div className="grid gap-2 mt-4">
                  <Label>ชื่อหลักสูตร ภาษาไทย</Label>
                  <div>{defaultValue?.course.name_th}</div>
                </div>
                <div className="grid gap-2 mt-4">
                  <Label>ชื่อหลักสูตร ภาษาอังกฤษ</Label>
                  <div>{defaultValue?.course.name_en}</div>
                </div>
                <div className="grid gap-2 mt-4">
                  <Label>วันที่เรียน</Label>
                  <div>
                    {convertToThaiDate(defaultValue?.start_date ?? "")} -{" "}
                    {convertToThaiDate(defaultValue?.end_date ?? "")}
                  </div>
                </div>
                <div className="grid gap-2 mt-4">
                  <Label>วันที่ออกใบประกาศ</Label>
                  <div>{convertToThaiDate(defaultValue?.given_date ?? "")}</div>
                </div>
              </div>
              <CardDescription className="text-[12px] mt-5">
                โรงเรียนอมารา นวดเพื่อสุขภาพ เสริมความงาม อนุมัติใบประกาศเลขที่{" "}
                {defaultValue?.certificate_number}{" "}
                ด้วยข้อมูลที่ขึ้นอยู่ในระบบเท่านั้น
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
