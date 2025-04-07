"use client";
import { useAlertContext } from "@/components/provider/alert-provider";
import { useFullLoadingContext } from "@/components/provider/full-loading-provider";
import { useNavigateContext } from "@/components/provider/navigation-provider";
import { useUserContext } from "@/components/provider/user-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackendClient } from "@/lib/request";
import { isErrorResponse, StudentResponse } from "@/types/request";
import Link from "next/link";
import React, { FormEvent, useEffect, useRef, useState } from "react";

type PageProps = {
  params: Promise<{ studentId: string[] }>;
};

export default function Page({ params }: PageProps) {
  const client = new BackendClient();
  const setAlert = useAlertContext();
  const setNavigation = useNavigateContext();
  const setFullLoading = useFullLoadingContext();
  const setLoading = useFullLoadingContext();
  const user = useUserContext();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [defaultValue, setDefaultValue] = useState<StudentResponse>();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFullLoading(true);
    const form = formRef.current;
    const firstname_th = form?.firstname_th?.value ?? "";
    const lastname_th = form?.lastname_th?.value ?? "";
    const firstname_en = form?.firstname_en?.value ?? "";
    const lastname_en = form?.lastname_en?.value ?? "";

    const { studentId } = await params;
    const studentID = Array.isArray(studentId) ? studentId[0] : studentId;
    const response = await client.updateStudentById(studentID, {
      firstname_th,
      lastname_th,
      firstname_en,
      lastname_en,
    });

    if (isErrorResponse(response)) {
      setFullLoading(false);
      setAlert("ผิดพลาด", response.message, 0, true);
      return;
    }

    setAlert(
      "อัพเดทข้อมูลสำเร็จ",
      "ระบบอัพเดทข้อมูลให้คุณเรียบร้อยแล้ว",
      () => {
        window.location.href = "/dashboard";
      },
      false
    );
  };

  const fetchData = async () => {
    const { studentId } = await params;
    const studentID = Array.isArray(studentId) ? studentId[0] : studentId;
    const response = await client.getStudentByStudentCode(studentID);

    if (isErrorResponse(response)) {
      setAlert("ผิดพลาด", response.message, 0, false);
      setLoading(false);
      return;
    }

    setNavigation(
      [
        {
          name: "นักเรียน",
          path: "/dashboard",
        },
      ],
      `${response.firstname_th} ${response.lastname_th}`
    );
    setDefaultValue(response);
  };

  const onGenerateStudentUserById = async () => {
    setLoading(true);
    const { studentId } = await params;
    const studentID = Array.isArray(studentId) ? studentId[0] : studentId;
    const response = await client.generateStudentUserById(studentID);

    if (isErrorResponse(response)) {
      setAlert("ผิดพลาด", response.message, 0, false);
      setLoading(false);
      return;
    }

    setLoading(false);
    setAlert(
      "สร้างบัญชีสำหรับนักเรียนเรียบร้อยแล้ว",
      `ผู้ใช้: <b class="text-red-500">${response.login}</b> <br/>รหัสผ่าน: <b class="text-red-500">${response.password}</b><br/>*คุณจะเห็นรหัสผ่านนี้เพียงครั้งเดียวเท่านั้น`,
      () => {
        fetchData();
      },
      false
    );
  };

  useEffect(() => {
    if (!defaultValue) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  return (
    <>
      <div className="flex justify-between items-center p-6">
        <div className="ml-4">
          ({defaultValue?.student_id}) {defaultValue?.firstname_th}{" "}
          {defaultValue?.lastname_th}
        </div>
        <div className="flex gap-2">
          <Link
            target="_blank"
            href={`/certificate/${defaultValue?.student_id}`}
            className="w-full"
          >
            <Button>ออกใบประกาศ</Button>
          </Link>
          <Link
            target="_blank"
            href={`/student/${defaultValue?.student_id}`}
            className="w-full"
          >
            <Button>บัตรนักเรียน</Button>
          </Link>
        </div>
      </div>
      <form ref={formRef} onSubmit={onSubmit} className="mx-6">
        <div className="p-6 border rounded-lg">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label>รหัสนักเรียน</Label>
              <Input
                placeholder="รหัสนักเรียน"
                defaultValue={defaultValue?.student_id}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="firstname_th">ชื่อ (ไทย)</Label>
              <Input
                id="firstname_th"
                name="firstname_th"
                type="text"
                placeholder="ชื่อ (ไทย)"
                defaultValue={defaultValue?.firstname_th}
                disabled={!user?.permissions?.includes("modify-student-data")}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastname_th">นามสกุล (ไทย)</Label>
              <Input
                id="lastname_th"
                name="lastname_th"
                type="text"
                placeholder="นามสกุล (ไทย)"
                defaultValue={defaultValue?.lastname_th}
                disabled={!user?.permissions?.includes("modify-student-data")}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="firstname_en">ชื่อ (อังกฤษ)</Label>
              <Input
                id="firstname_en"
                name="firstname_en"
                type="text"
                placeholder="ชื่อ (ไทย)"
                defaultValue={defaultValue?.firstname_en}
                disabled={!user?.permissions?.includes("modify-student-data")}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastname_en">นามสกุล (อังกฤษ)</Label>
              <Input
                id="lastname_en"
                name="lastname_en"
                type="text"
                placeholder="นามสกุล (ไทย)"
                defaultValue={defaultValue?.lastname_en}
                disabled={!user?.permissions?.includes("modify-student-data")}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>ผู้ขาย</Label>
              <Input
                placeholder="รหัสผู้ขาย"
                defaultValue={defaultValue?.sale_person}
                disabled
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="">
                {user?.permissions?.includes("modify-student-data") && (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={onGenerateStudentUserById}
                  >
                    {defaultValue?.user_id != 0
                      ? "สร้างรหัสผ่านใหม่"
                      : "สร้างบัญชีของนักเรียน"}
                  </Button>
                )}
              </div>
              <div className="">
                {user?.permissions?.includes("modify-student-data") && (
                  <Button type="submit" className="w-full">
                    บันทึกข้อมูล
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="p-6 border rounded-lg m-6">
        <div className="flex flex-col gap-3">
          <div>ใบประกาศ</div>
          {defaultValue?.certificate.map((value, index) => {
            return (
              <Link
                key={index}
                className="border rounded-lg p-2 cursor-pointer"
                href={`/dashboard/certificate/edit/${value.certificate_number}`}
              >
                {value.certificate_number} - {value.course.name_th}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
