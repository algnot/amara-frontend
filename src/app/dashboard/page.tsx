"use client"
import { DataTable } from '@/components/datatable/datatable';
import { useFullLoadingContext } from '@/components/provider/full-loading-provider';
import { useNavigateContext } from '@/components/provider/navigation-provider';
import { BackendClient } from '@/lib/request';
import React, { useEffect } from 'react'

export default function Page() {
  const setLoading = useFullLoadingContext();
  const setNavigation = useNavigateContext();
  const client = new BackendClient();

  useEffect(() => {
    setLoading(false);
    setNavigation([], "นักเรียน");
  }, [setLoading, setNavigation]);

  return (
    <div className="container mx-auto py-10 px-5">
      <DataTable
        fetchData={client.listStudent}
        columns={[
          { key: "student_id", label: "รหัสนักเรียน" },
          { key: "firstname_th", label: "ชื่อ (ไทย)" },
          { key: "lastname_th", label: "นามสกุล (ไทย)" },
          { key: "firstname_en", label: "ชื่อ (อังกฤษ)" },
          { key: "lastname_en", label: "นามสกุล (อังกฤษ)" },
        ]}
        href="/dashboard/student/edit/"
        navigateKey="student_id"
      />
    </div>
  )
}
