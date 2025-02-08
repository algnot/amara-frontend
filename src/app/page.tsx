"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import React, { useState } from "react";

export default function Page() {
  const [firstnameTH, setFirstnameTH] = useState<string>("");
  const [lastnameTH, setLastnameTH] = useState<string>("");
  const [firstnameEN, setFirstnameEN] = useState<string>("");
  const [lastnameEN, setLastnameEN] = useState<string>("");
  const [prefix, setPrefix] = useState<"นาย" | "นาง" | "นางสาว" | "">("");
  const [school, setSchool] = useState<"นวดไทย" | "">("");

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
              <CardTitle className="text-2xl">ลงทะเบียนเรียน</CardTitle>
              <CardDescription>
                โรงเรียนอมารา นวดเพื่อสุขภาพ เสริมความงาม
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2 mt-4">
                  <div className="flex items-center">
                    <Label>คำนำหน้าชื่อ*</Label>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-28 flex justify-between ${prefix == "" && "text-gray-400"}`}
                      >
                        {prefix != "" ? (
                          prefix
                        ) : (
                          <>
                            เลือก <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => setPrefix("นาย")}>
                        นาย
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPrefix("นาง")}>
                        นาง
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPrefix("นางสาว")}>
                        นางสาว
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="grid gap-2 mt-4">
                  <Label>ชื่อนักเรียน (ภาษาไทย)*</Label>
                  <Input
                    type="text"
                    placeholder="ชื่อนักเรียน (ภาษาไทย)"
                    value={firstnameTH}
                    onChange={(e) => setFirstnameTH(e.target.value)}
                  />
                </div>
                <div className="grid gap-2 mt-4">
                  <Label>นามสกุลนักเรียน (ภาษาไทย)*</Label>
                  <Input
                    type="text"
                    placeholder="นามสกุลนักเรียน (ภาษาไทย)"
                    value={lastnameTH}
                    onChange={(e) => setLastnameTH(e.target.value)}
                  />
                </div>
                <div className="grid gap-2 mt-4">
                  <Label>ชื่อนักเรียน (ภาษาอังกฤษ)*</Label>
                  <Input
                    type="text"
                    placeholder="ชื่อนักเรียน (ภาษาอังกฤษ)"
                    value={firstnameEN}
                    onChange={(e) => setFirstnameEN(e.target.value)}
                  />
                </div>
                <div className="grid gap-2 mt-4">
                  <Label>นามสกุลนักเรียน (ภาษาอังกฤษ)*</Label>
                  <Input
                    type="text"
                    placeholder="นามสกุลนักเรียน (ภาษาอังกฤษ)"
                    value={lastnameEN}
                    onChange={(e) => setLastnameEN(e.target.value)}
                  />
                </div>
                <div className="grid gap-2 mt-4">
                  <div className="flex items-center">
                    <Label>สถาบันที่ลงทะเบียน*</Label>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={`flex justify-between ${school == "" && "text-gray-400"}`}
                      >
                        {school != "" ? (
                          school
                        ) : (
                          <>
                            เลือก <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => setSchool("นวดไทย")}>นวดไทย</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="grid gap-2 mt-4">
                  <Label>รหัส CS*</Label>
                  <Input type="text" placeholder="รหัส CS" />
                </div>
                <Button type="submit" className="w-full mt-4">
                  ลงทะเบียนเรียน
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
