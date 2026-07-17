"use client";
import { useAlertContext } from "@/components/provider/alert-provider";
import { useFullLoadingContext } from "@/components/provider/full-loading-provider";
import { useNavigateContext } from "@/components/provider/navigation-provider";
import { useUserContext } from "@/components/provider/user-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackendClient } from "@/lib/request";
import {isErrorResponse, SalePerson} from "@/types/request";
import React, {FormEvent, useEffect, useRef, useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";


export default function Page() {
    const client = new BackendClient();
    const setAlert = useAlertContext();
    const setNavigation = useNavigateContext();
    const setFullLoading = useFullLoadingContext();
    const setLoading = useFullLoadingContext();
    const user = useUserContext();
    const formRef = useRef<HTMLFormElement | null>(null);
    const [salePersons, setSalePersons] = useState<SalePerson[]>([]);
    const [selectedSalePerson, setSelectedSalePerson] = useState<string>("")

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFullLoading(true);
        const form = formRef.current;
        const firstname_th = form?.firstname_th?.value ?? "";
        const lastname_th = form?.lastname_th?.value ?? "";
        const firstname_en = form?.firstname_en?.value ?? "";
        const lastname_en = form?.lastname_en?.value ?? "";

        const response = await client.addNewStudent({
            firstname_en,
            firstname_th,
            lastname_en,
            lastname_th,
            ref_code: selectedSalePerson,
        });

        if (isErrorResponse(response)) {
            setFullLoading(false);
            setAlert("ผิดพลาด", response.message, 0, true);
            return;
        }

        setAlert(
            "เพิ่มข้อมูลนักเรียนสำเร็จ",
            "ระบบเพิ่มข้อมูลนักเรียนให้คุณเรียบร้อยแล้ว",
            () => {
                window.location.href = "/dashboard/student/edit/" + response.student_id;
            },
            false,
        );
    };

    useEffect(() => {
        fetchData();

        setNavigation(
            [
                {
                    name: "นักเรียน",
                    path: "/dashboard",
                },
            ],
            "เพิ่มข้อมูลนักเรียน"
        );
    }, [])

    const fetchData = async () => {
        setLoading(true);
        const response = await client.listSalePerson(1000, "", "")
        if(isErrorResponse(response)) {
            return;
        }
        setSalePersons(response.datas);
        setLoading(false);
    }

    return (
        <>
            <form ref={formRef} onSubmit={onSubmit} className="mx-6 mt-6">
                <div className="p-6 border rounded-lg">
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="firstname_th">ชื่อ (ไทย)</Label>
                            <Input
                                id="firstname_th"
                                name="firstname_th"
                                type="text"
                                placeholder="ชื่อ (ไทย)"
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
                                placeholder="ชื่อ (อังกฤษ)"
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
                                placeholder="นามสกุล (อังกฤษ)"
                                disabled={!user?.permissions?.includes("modify-student-data")}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>ผู้ขาย</Label>
                            <Select
                                value={selectedSalePerson}
                                onValueChange={(value) => setSelectedSalePerson(value)}
                                required={true}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="เลือกผู้ขาย" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        salePersons.map((salePerson) => {
                                            return (
                                                <SelectItem key={salePerson.id} value={salePerson.reference_code}>{salePerson.reference_code} - {salePerson.firstname} {salePerson.lastname}</SelectItem>
                                            )
                                        })
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end items-center">
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
        </>
    );
}
