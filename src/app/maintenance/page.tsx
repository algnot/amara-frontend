/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import React, { useEffect } from "react";
import { BackendClient } from "@/lib/request";

export default function Page() {
  const isMobile = useIsMobile();
  const client = new BackendClient();

  useEffect(() => {
    client.healthCheck().then((res) => {
      if (res) {
        window.location.href = "/login";
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-10 md:flex-row md:gap-20">
      <Image
        src="/maintenance.png"
        alt="Maintenance"
        width={isMobile ? 250 : 300}
        height={isMobile ? 250 : 300}
      />
      <div>
        <div className="text-5xl font-bold mb-4">Oops!</div>
        <div className="text-xl text-gray-500">
          เกิดข้อผิดพลาดในการเข้าถึงหน้านี้
        </div>
      </div>
    </div>
  );
}
