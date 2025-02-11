"use client";
import { useAlertContext } from "@/components/provider/alert-provider";
import { useFullLoadingContext } from "@/components/provider/full-loading-provider";
import { useNavigateContext } from "@/components/provider/navigation-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BackendClient } from "@/lib/request";
import { convertToEngDate, convertToThaiDate } from "@/lib/utils";
import { GetCertificateResponse, isErrorResponse } from "@/types/request";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import React, { FormEvent, useEffect, useRef, useState } from "react";

type PageProps = {
  params: Promise<{ certificateId: string[] }>;
};

export default function Page({ params }: PageProps) {
  const client = new BackendClient();
  const setAlert = useAlertContext();
  const setNavigation = useNavigateContext();
  const setLoading = useFullLoadingContext();
  const [defaultValue, setDefaultValue] = useState<GetCertificateResponse>();

  const formRef = useRef<HTMLFormElement | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const { certificateId } = await params;
    const certificateID = Array.isArray(certificateId)
      ? certificateId[0]
      : certificateId;

    event.preventDefault();
    setLoading(true);
    const form = formRef.current;
    const start_date = form?.start_date?.value ?? "";
    const end_date = form?.end_date?.value ?? "";
    const given_date = form?.given_date?.value ?? "";
    const batch = form?.batch?.value ?? "";

    const response = await client.updateCertificateById(certificateID, {
      start_date,
      end_date,
      given_date,
      batch,
    });

    if (isErrorResponse(response)) {
      setAlert("ผิดพลาด", response.message, 0, false);
      setLoading(false);
      return;
    }

    setAlert(
      "อัพเดทข้อมูลสำเร็จ",
      "ระบบอัพเดทข้อมูลให้คุณเรียบร้อยแล้ว",
      () => {
        window.location.reload();
      },
      false
    );
  };

  const fetchData = async () => {
    const { certificateId } = await params;
    const certificateID = Array.isArray(certificateId)
      ? certificateId[0]
      : certificateId;
    const response = await client.getCertificateById(certificateID);

    if (isErrorResponse(response)) {
      setAlert("ผิดพลาด", response.message, 0, false);
      setLoading(false);
      return;
    }

    setNavigation(
      [
        {
          name: "ใบประกาศ",
          path: "/dashboard/certificate",
        },
      ],
      `${response.certificate_number}`
    );
    setDefaultValue(response);
  };

  const actionPrintCertificateEN = async () => {
    setLoading(true);
    try {
      const response = await client.getCertificatePDF({
        url: window.location.protocol + "//" + window.location.host + "/certificate-1.0-en-fill.pdf",
        params: {
          number: `Certificate No. ${defaultValue?.certificate_number}`,
          name: `${defaultValue?.student.firstname_en} ${defaultValue?.student.lastname_en}`,
          course_name: `${defaultValue?.course.name_en}`,
          certificate_date:
            `Batch ${defaultValue?.batch} between ${convertToEngDate(defaultValue?.start_date ?? "")} and ${convertToEngDate(defaultValue?.end_date ?? "")}`,
          date: `Given on ${convertToEngDate(defaultValue?.given_date ?? "")}`,
        },
        lang: "en"
      });

      if (isErrorResponse(response)) {
        setAlert("ผิดพลาด", response.message, 0, false);
        setLoading(false);
        return;
      }

      const pdfBlob = new Blob([response], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");

      setLoading(false);
    } catch (error) {
      setAlert(
        "ผิดพลาด",
        `ไม่สามารถพิมพ์ใบประกาศได้ error: ${error}`,
        0,
        false
      );
      setLoading(false);
    }
  };

  const actionPrintCertificateTH = async () => {
    setLoading(true);
    try {
      const response = await client.getCertificatePDF({
        url: window.location.protocol + "//" + window.location.host + "/certificate-1.0-th-fill.pdf",
        params: {
          number: `เลขที่ ${defaultValue?.certificate_number}`,
          name: `${defaultValue?.student.firstname_th} ${defaultValue?.student.lastname_th}`,
          course_name: `${defaultValue?.course.name_th}`,
          certificate_date:
            `รุ่นที่ ${defaultValue?.batch} ระหว่างวันที่ ${convertToThaiDate(defaultValue?.start_date ?? "")} ถึงวันที่ ${convertToThaiDate(defaultValue?.end_date ?? "")}`,
          date: `ให้ไว้ ณ วันที่ ${convertToThaiDate(defaultValue?.given_date ?? "")}`,
        },
        lang: "th"
      });

      if (isErrorResponse(response)) {
        setAlert("ผิดพลาด", response.message, 0, false);
        setLoading(false);
        return;
      }

      const pdfBlob = new Blob([response], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");

      setLoading(false);
    } catch (error) {
      setAlert(
        "ผิดพลาด",
        `ไม่สามารถพิมพ์ใบประกาศได้ error: ${error}`,
        0,
        false
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!defaultValue) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  return (
    <div className="m-6">
      <div className="flex justify-between items-center mb-6 ">
        <div className="ml-4">
          เลขที่ใบประกาศ {defaultValue?.certificate_number}
        </div>
        <div className="flex gap-2">
          {defaultValue?.batch !== "draft" && defaultValue?.given_date && (
            <>
              <Button className="w-full" onClick={actionPrintCertificateTH}>
                พิมพ์ใบประกาศ (ไทย)
              </Button>
              <Button className="w-full" onClick={actionPrintCertificateEN}>
                พิมพ์ใบประกาศ (อังกฤษ)
              </Button>
            </>
          )}
        </div>
      </div>
      <form className="p-6 border rounded-lg" ref={formRef} onSubmit={onSubmit}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label>นักเรียน</Label>
            <Link
              className="hover:underline text-blue-800 text-md"
              href={`/dashboard/student/edit/${defaultValue?.student.student_id}`}
            >
              {defaultValue?.student.student_id} -{" "}
              {defaultValue?.student.firstname_th}{" "}
              {defaultValue?.student.lastname_th} (
              {defaultValue?.student.firstname_en}{" "}
              {defaultValue?.student.lastname_en})
            </Link>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastname">หลักสูตร</Label>
            <Link
              className="hover:underline text-blue-800 text-md"
              href={`/dashboard/course/edit/${defaultValue?.course.id}`}
            >
              {defaultValue?.course.course_code} -{" "}
              {defaultValue?.course.name_th} ({defaultValue?.course.name_en})
            </Link>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastname">ผู้ดูแล</Label>
            <div className="text-md">{defaultValue?.student.sale_person}</div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="start_date">วันที่เริ่มเรียน</Label>
            <Input
              id="start_date"
              name="start_date"
              type="date"
              placeholder="วันที่เริ่มเรียน"
              defaultValue={
                defaultValue?.start_date
                  ? new Date(defaultValue.start_date)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="end_date">วันที่เรียนจบ</Label>
            <Input
              id="end_date"
              name="end_date"
              type="date"
              placeholder="วันที่เรียนจบ"
              defaultValue={
                defaultValue?.end_date
                  ? new Date(defaultValue.end_date).toISOString().split("T")[0]
                  : ""
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="given_date">วันที่มอบใบประกาศ</Label>
            <Input
              id="given_date"
              name="given_date"
              type="date"
              placeholder="วันที่มอบใบประกาศ"
              defaultValue={
                defaultValue?.given_date
                  ? new Date(defaultValue.given_date)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="batch">รุ่นที่</Label>
            <Input
              id="batch"
              name="batch"
              type="text"
              placeholder="รุ่นที่"
              defaultValue={defaultValue?.batch}
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <div className=""></div>
            <div className="">
              <Button type="submit" className="w-full">
                บันทึกข้อมูล
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
