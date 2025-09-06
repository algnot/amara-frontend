/* eslint-disable react-hooks/exhaustive-deps */
import { BackendClient } from "@/lib/request";
import { ActivityLog, isErrorResponse } from "@/types/request";
import React, { useEffect, useState } from "react";

export default function ActivityLogs({
  topic,
  refId,
}: {
  topic: string;
  refId: string;
}) {
  const client = new BackendClient();
  const [datas, setDatas] = useState<ActivityLog[]>([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const resposne = await client.getActivityLogs(topic, refId);

    if (isErrorResponse(resposne)) {
      return;
    }

    setDatas(resposne.datas);
  };

  if (datas.length === 0) {
    return null;
  }

  return (
    <div className="p-6 border rounded-lg mt-4">
      <h2 className="text-lg font-semibold mb-4">ประวัติการทำรายการ</h2>
      <div className="border rounded-lg mt-4 p-4 max-h-80 overflow-y-auto">
        {datas.map((log, index) => (
          <div key={index} className="pb-2 mb-2 border-b last:border-b-0">
            <div className="text-sm text-gray-500 mb-2">
              {new Date(log.created_at).toLocaleString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
            <div
              className="prose prose-sm max-w-none text-sm"
              dangerouslySetInnerHTML={{ __html: log.content }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
