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
import {
  CreateUserResponse,
  isErrorResponse,
  ListPermissionResponse,
  UpdateUserRequest,
} from "@/types/request";
import React, { useEffect, useRef, useState } from "react";

export interface Role {
  name: string;
  value: string;
}

type PageProps = {
  params: Promise<{ userId: string[] }>;
};

const renderPermissionCheckbox = (
  value: ListPermissionResponse["datas"][0],
  selected: number[],
  onChange: (checked: boolean) => void
) => {
  const isChecked = selected.includes(value.id);

  return (
    <div key={value.id} className="flex items-center space-x-2">
      <Checkbox
        id={value.id.toString()}
        checked={isChecked}
        onCheckedChange={onChange}
      />
      <label
        htmlFor={value.key}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {value.name} ({value.key})
      </label>
    </div>
  );
};

export default function Page({ params }: PageProps) {
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

  const [isChangePassword, setIsChangePassword] = useState<boolean>(false);
  const [defaultValue, setDefaultValue] = useState<CreateUserResponse>();
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = formRef.current;
    const username = form?.username?.value ?? "";
    const email = form?.email?.value ?? "";
    const password = form?.newPassword?.value ?? "";
    const role = selectedRole?.value ?? "";
    const permissions = selectedPermissions;
    const { userId } = await params;
    const userID = Array.isArray(userId) ? userId[0] : userId;

    setLoading(true);

    const paylaod: UpdateUserRequest = {
      username: username,
      email: email,
      role: role,
      permissions: permissions.map((key) => Number(key)),
    };

    if (isChangePassword) {
      paylaod.password = password;
    }

    const response = await client.updateUserById(userID, paylaod);

    if (isErrorResponse(response)) {
      setAlert("ผิดพลาด", response.message, 0, true);
      setLoading(false);
      return;
    }

    setAlert(
      "อัพเดทข้อมูลผู้ใช้งานสำเร็จ",
      "ระบบได้อัพเดทข้อมูลผู้ใช้งานเรียบร้อยแล้ว",
      () => {
        window.location.href = "/dashboard/admin/users/" + response.user_id;
      },
      false
    );
  };

  const fetchData = async () => {
    setLoading(true);
    const { userId } = await params;
    const userID = Array.isArray(userId) ? userId[0] : userId;

    const response = await client.listPermission(99999, "", "");
    if (isErrorResponse(response)) {
      setAlert("ผิดพลาด", response.message, 0, true);
      setLoading(false);
      return;
    }

    setPermissionDatas(response);
    const userResponse = await client.getUserById(userID);
    if (isErrorResponse(userResponse)) {
      setAlert("ผิดพลาด", userResponse.message, 0, true);
      setLoading(false);
      return;
    }

    setSelectedPermissions(userResponse.permissions);
    setDefaultValue(userResponse);
    setNavigation(
      [
        {
          name: "ผู้ใช้งาน",
          path: "/dashboard/admin/users",
        },
      ],
      userResponse.username
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
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
      <div className="mb-4">{defaultValue?.username ?? ""}</div>
      <form className="p-6 border rounded-lg" ref={formRef} onSubmit={onSubmit}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">อีเมล</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email"
              defaultValue={defaultValue?.email ?? ""}
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
              defaultValue={defaultValue?.username ?? ""}
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
                    <>{defaultValue?.role ?? "เลือกบทบาท"}</>
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
              {permissionDatas?.datas
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((value) => {
                  const handleChange = (checked: boolean) => {
                    setSelectedPermissions((prev) =>
                      checked
                        ? [...prev, Number(value.id)]
                        : prev.filter((id) => id !== Number(value.id))
                    );
                  };

                  return renderPermissionCheckbox(
                    value,
                    selectedPermissions,
                    handleChange
                  );
                })}
            </div>
          </div>
          {isChangePassword && (
            <div className="grid gap-2">
              <Label htmlFor="newPassword">รหัสผ่านใหม่</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="รหัสผ่านใหม่"
                required
              />
            </div>
          )}
          <div className="flex justify-between items-center mt-4">
            <div>
              <Button
                type="button"
                className="w-full"
                variant="outline"
                onClick={() => setIsChangePassword((prev) => !prev)}
              >
                {isChangePassword
                  ? "ยกเลิกการเปลี่ยนรหัสผ่าน"
                  : "เปลี่ยนรหัสผ่าน"}
              </Button>
            </div>
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
