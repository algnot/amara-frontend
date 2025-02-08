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

  const [studentNumber, setStudentNumber] = useState<string>("");

  const onSubmit = async () => {
    setFullLoading(true);
    const response = await client.getStudentByStudentCode(studentNumber);

    if (isErrorResponse(response)) {
      setFullLoading(false);
      setAlert("ผิดพลาด", response.message, 0, true);
      return;
    }

    window.location.href = "/certificate/" + response.student_id
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
              <CardTitle className="text-2xl">ขอใบประกาศ</CardTitle>
              <CardDescription>
                โรงเรียนอมารา นวดเพื่อสุขภาพ เสริมความงาม
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2 mt-4">
                  <Label>รหัสนักเรียน</Label>
                  <Input
                    type="text"
                    placeholder="รหัสนักเรียน"
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full mt-4"
                  onClick={onSubmit}
                >
                  ค้นหารายชื่อนักเรียน
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
