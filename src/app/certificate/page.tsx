"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import React, { useState } from "react";

export default function Page() {
  const [studentNumber, setStudentNumber] = useState<string>("");

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
                <Button type="submit" className="w-full mt-4">
                  ขอใบประกาศ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
