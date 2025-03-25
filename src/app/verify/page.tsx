"use client";
import { useAlertContext } from "@/components/provider/alert-provider";
import { useFullLoadingContext } from "@/components/provider/full-loading-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackendClient } from "@/lib/request";
import { isErrorResponse } from "@/types/request";
import Image from "next/image";
import React, { useState } from "react";

export default function Page() {
  const client = new BackendClient();
  const setAlert = useAlertContext();
  const setFullLoading = useFullLoadingContext();
  const [certificateName, setCertificateName] = useState<string>("");

  const onSubmit = async () => {
    setFullLoading(true);
    const response = await client.getCertificateById(certificateName);

    if (isErrorResponse(response)) {
      setFullLoading(false);
      setAlert("ผิดพลาด", response.message, 0, true);
      return;
    }

    window.location.href = "/verify/" + response.certificate_number;
  };

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
              <CardTitle className="text-2xl">ระบบตรวจสอบใบประกาศ</CardTitle>
              <CardDescription>
                โรงเรียนอมารา นวดเพื่อสุขภาพ เสริมความงาม
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2 mt-4">
                  <Label>รหัสใบประกาศ</Label>
                  <Input
                    type="text"
                    placeholder="รหัสใบประกาศ"
                    value={certificateName}
                    onChange={(e) => setCertificateName(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full mt-4"
                  onClick={onSubmit}
                >
                  ตรวจสอบข้อมูล
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
