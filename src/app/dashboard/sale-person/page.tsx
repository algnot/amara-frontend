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
    setNavigation([], "พนักงานขาย");
  }, [setLoading, setNavigation]);

  return (
    <div className="container mx-auto py-10 px-5">
      <DataTable
        fetchData={client.listSalePerson}
        columns={[
          { key: "reference_code", label: "Code" },
          { key: "firstname", label: "ชื่อ" },
          { key: "lastname", label: "นามสกุล" },
        ]}
        href="/dashboard/sale-person/"
        navigateKey="reference_code"
      />
    </div>
  )
}
