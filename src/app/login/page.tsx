/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useAlertContext } from "@/components/provider/alert-provider";
import { useFullLoadingContext } from "@/components/provider/full-loading-provider";
import { useUserContext } from "@/components/provider/user-provider";
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
import React, { FormEvent, useEffect, useRef } from "react";

export default function Page() {
  const client = new BackendClient();
  const setAlert = useAlertContext();
  const setFullLoading = useFullLoadingContext();
  const user = useUserContext();
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFullLoading(true);
    const form = formRef.current;
    const email = form?.email?.value ?? "";
    const password = form?.password?.value ?? "";

    const response = await client.login({
      email,
      password,
    });

    if (isErrorResponse(response)) {
      setFullLoading(false);
      setAlert("Error", response.message, 0, true);
      return;
    }

    setAlert(
      "เข้าสู่ระบบสำเร็จ",
      `ยินดีต้อนรับ ${response.username} :)`,
      () => {
        window.location.href = "/dashboard";
      },
      false
    );
  };

  useEffect(() => {
    if(user !== null) {
      if(user.uid !== 0) {
        window.location.href = "/dashboard";
      }
    }
  },[user])

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
              <CardTitle className="text-2xl">เข้าสู่ระบบ</CardTitle>
              <CardDescription>
                กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">อีเมล</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="amara@amara.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">รหัสผ่าน</Label>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    เข้าสู่ระบบ
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
