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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackendClient } from "@/lib/request";
import {
  CourseResponse,
  isErrorResponse,
  StudentResponse,
} from "@/types/request";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type PageProps = {
  params: Promise<{ studentId: string[] }>;
};

export default function Page({ params }: PageProps) {
  const client = new BackendClient();
  const setAlert = useAlertContext();
  const setLoading = useFullLoadingContext();
  const [allCouse, setAllCouse] = useState<CourseResponse[]>([]);

  const [studentData, setStudentData] = useState<StudentResponse>();
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(
    null
  );
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const onSubmit = async () => {
    setLoading(true);
    const response = await client.requestCertificate({
      student_id: Number(studentData?.id),
      course_id: selectedCourse?.id ?? 0,
      start_date: startDate,
      end_date: endDate,
    });

    if (isErrorResponse(response)) {
      setLoading(false);
      setAlert("ผิดพลาด", response.message, 0, true);
      return;
    }

    setAlert("ส่งคำขอสำเร็จ", "ระบบได้ส่งคำขอสร้างใบประกาศเรียบร้อยแล้ว", () => {
      window.location.href = "/certificate";
    }, false);
  };

  const fetchData = async () => {
    const { studentId } = await params;
    const studentID = Array.isArray(studentId) ? studentId[0] : studentId;
    const response = await client.getStudentByStudentCode(studentID);

    if (isErrorResponse(response)) {
      setAlert("ผิดพลาด", response.message, 0, true);
      setLoading(false);
      return;
    }
    setStudentData(response);

    const allCouse = await client.listCourse(99999, "", "");
    if (isErrorResponse(allCouse)) {
      setAlert("ผิดพลาด", allCouse.message, 0, true);
      setLoading(false);
      return;
    }
    setAllCouse(allCouse.datas);
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
                    value={studentData?.student_id}
                    disabled
                  />
                </div>
                <div className="grid gap-2 mt-4">
                  <Label>ชื่อนักเรียน (ไทย)</Label>
                  <Input
                    type="text"
                    placeholder="ชื่อนักเรียน (ไทย)"
                    value={`${studentData?.firstname_th} ${studentData?.lastname_th}`}
                    disabled
                  />
                </div>
                <div className="grid gap-2 mt-4">
                  <Label>ชื่อนักเรียน (อังกฤษ)</Label>
                  <Input
                    type="text"
                    placeholder="ชื่อนักเรียน (อังกฤษ)"
                    value={`${studentData?.firstname_en} ${studentData?.lastname_en}`}
                    disabled
                  />
                </div>
                <div className="grid gap-2 mt-4">
                  <Label>หลักสูตรที่ต้องการขอ</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={`flex justify-between ${
                          selectedCourse == null && "text-gray-400"
                        }`}
                      >
                        {selectedCourse == null ? (
                          <>
                            เลือก <ChevronDown className="h-4 w-4" />
                          </>
                        ) : (
                          <>{selectedCourse.name_th}</>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {allCouse.map((value, index) => {
                        return (
                          <DropdownMenuItem
                            key={index}
                            onClick={() => setSelectedCourse(value)}
                          >
                            {value.name_th}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="grid gap-2 mt-4">
                  <Label>วันที่เริ่มเรียน</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="วันที่เริ่มเรียน"
                    max={endDate}
                  />
                </div>
                {startDate && (
                  <div className="grid gap-2 mt-4">
                    <Label>วันที่เรียนจบ</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="วันที่เรียนจบ"
                      min={startDate}
                    />
                  </div>
                )}
                <Button className="w-full mt-4" onClick={onSubmit}>
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
