"use client";
import { useAlertContext } from "@/components/provider/alert-provider";
import { useFullLoadingContext } from "@/components/provider/full-loading-provider";
import { useNavigateContext } from "@/components/provider/navigation-provider";
import { useUserContext } from "@/components/provider/user-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackendClient } from "@/lib/request";
import { isErrorResponse, ListPermissionResponse } from "@/types/request";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export interface Role {
  name: string;
  value: string;
}

const renderPermissionCheckbox = (
  value: ListPermissionResponse["datas"][0],
  isChecked: boolean,
  onChange: (checked: boolean) => void
) => {
  return (
    <div key={value.key} className="flex items-center space-x-2">
      <Checkbox id={value.key} checked={isChecked} onCheckedChange={onChange} />
      <label
        htmlFor={value.key}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {value.name} ({value.key})
      </label>
    </div>
  );
};

export default function Page() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const setAlert = useAlertContext();
  const setNavigation = useNavigateContext();
  const setLoading = useFullLoadingContext();
  const client = new BackendClient();
  const [permissionDatas, setPermissionDatas] =
    useState<ListPermissionResponse>();
  const [roles, setRoles] = useState<Role[]>([]);
  const userData = useUserContext();

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = formRef.current;
    const username = form?.username?.value ?? "";
    const email = form?.email?.value ?? "";
    const password = form?.password?.value ?? "";
    const confirmPassword = form?.confirmPassword?.value ?? "";
    const role = selectedRole?.value ?? "";
    const permissions = selectedPermissions;

    setLoading(true);
    if (password !== confirmPassword) {
      setAlert("ผิดพลาด", "รหัสผ่านไม่ตรงกัน", 0, true);
      setLoading(false);
      return;
    }

    const response = await client.createUser({
      username: username,
      email: email,
      password: password,
      role: role,
      permissions: permissions.map((key) => Number(key)),
    });

    if (isErrorResponse(response)) {
      setAlert("ผิดพลาด", response.message, 0, true);
      setLoading(false);
      return;
    }

    setAlert(
      "เพิ่มข้อมูลผู้ใช้งานสำเร็จ",
      "ระบบได้เพิ่มข้อมูลผู้ใช้งานเรียบร้อยแล้ว",
      () => {
        window.location.href = "/dashboard/admin/users/" + response.user_id;
      },
      false
    );
  };

  const fetchData = async () => {
    const response = await client.listPermission(99999, "", "");
    if (isErrorResponse(response)) {
      setAlert("ผิดพลาด", response.message, 0, true);
      setLoading(false);
      return;
    }

    setPermissionDatas(response);
  };

  useEffect(() => {
    fetchData();
    setNavigation(
      [
        {
          name: "ผู้ใช้งาน",
          path: "/dashboard/admin/users",
        },
      ],
      "เพิ่มผู้ใช้งาน"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setRoles([
      {
        name: "ผู้ใช้งานทั่วไป (USER)",
        value: "USER",
      },
      {
        name: "ผู้ดูแล (ADMIN)",
        value: "ADMIN",
      },
    ]);

    if (userData?.role === "SUPER_ADMIN") {
      setRoles((prev) => [
        ...prev,
        {
          name: "ผู้ดูแลระบบ (SUPER_ADMIN)",
          value: "SUPER_ADMIN",
        },
      ]);
    }
  }, [userData]);

  return (
    <div className="m-6">
      <div className="mb-4">เพิ่มผู้ใช้งาน</div>
      <form className="p-6 border rounded-lg" ref={formRef} onSubmit={onSubmit}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">อีเมล</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">ชื่อผู้ใช้งาน</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="ชื่อผู้ใช้งาน"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">รหัสผ่าน</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="รหัสผ่าน"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="ยืนยันรหัสผ่าน"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label>บทบาท</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`flex justify-between ${
                    selectedRole == null && "text-gray-400"
                  }`}
                >
                  {selectedRole == null ? (
                    <>
                      เลือก <ChevronDown className="h-4 w-4" />
                    </>
                  ) : (
                    <>{selectedRole.name}</>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="max-h-60 overflow-y-auto"
              >
                {roles.map((value, index) => {
                  return (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => setSelectedRole(value)}
                    >
                      {value.name}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid gap-2">
            <Label className="mb-2">สิทธิ์การใช้งาน</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {permissionDatas?.datas.map((value) => {
                const isChecked = selectedPermissions.includes(value.key);

                const handleChange = (checked: boolean) => {
                  setSelectedPermissions((prev) =>
                    checked
                      ? [...prev, value.key]
                      : prev.filter((key) => key !== value.key)
                  );
                };

                return renderPermissionCheckbox(value, isChecked, handleChange);
              })}
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div></div>
            <div>
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
