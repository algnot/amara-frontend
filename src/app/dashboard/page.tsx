"use client";

import {Album, UsersRound} from "lucide-react";
import {ReactNode, useEffect, useState} from "react";
import {BarChart} from "@/components/common/bar-chart";
import {PieChart} from "@/components/common/pie-chart";
import {
    ChartDateRangeFilter,
    getDefaultChartDateRangeFilterValue,
} from "@/components/common/chart-date-range-filter";
import {BackendClient} from "@/lib/request";
import {useFullLoadingContext} from "@/components/provider/full-loading-provider";
import {ChartResponse, GetDashboardSummaryResponse, isErrorResponse} from "@/types/request";
import {useAlertContext} from "@/components/provider/alert-provider";

const Badge = ({title, value, icon, className = ""}: {title: string, value: string | number, icon: ReactNode, className?: string}) => {
    return (
        <div className={`flex border bg-card items-center justify-between p-6 rounded-md shadow-sm ${className}`}>
            {icon}
            <div className="">
                <div className="text-xs font-bold text-right">{title}</div>
                {
                    typeof value === "number" ?
                        <div className="text-right">{value.toLocaleString()}</div>
                        : <div className="text-right">{value}</div>
                }
            </div>
        </div>
    )
}

export default function Page() {
    const client = new BackendClient();
    const setLoading = useFullLoadingContext();
    const setAlert = useAlertContext();
    const [chartFilter, setChartFilter] = useState(getDefaultChartDateRangeFilterValue);
    const [summaryData, setSummaryData] = useState<GetDashboardSummaryResponse>({
        total_certificate: 0, total_certificate_in_month: 0, total_draft_certificate: 0, total_students: 0
    })
    const [certificateChartData, setCertificateChartData] = useState<ChartResponse[]>([])
    const [courseChartData, setCourseChartData] = useState<ChartResponse[]>([])

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const response = await client.getDashboardSummary();
        if(isErrorResponse(response)) {
            setLoading(false);
            setAlert("ผิดพลาด", response.message, 0, true);
            return;
        }
        setSummaryData(response);

        const chartMonthResponse = await client.getChartMonthSummary(
            chartFilter.startMonth,
            chartFilter.startYear,
            chartFilter.endMonth,
            chartFilter.endYear,
        )
        if(isErrorResponse(chartMonthResponse)) {
            setLoading(false);
            setAlert("ผิดพลาด", chartMonthResponse.message, 0, true);
            return;
        }
        setCertificateChartData(chartMonthResponse);

        const chartCourseResponse = await client.getChartCourseSummary(
            chartFilter.startMonth,
            chartFilter.startYear,
            chartFilter.endMonth,
            chartFilter.endYear,
        )
        if(isErrorResponse(chartCourseResponse)) {
            setLoading(false);
            setAlert("ผิดพลาด", chartCourseResponse.message, 0, true);
            return;
        }
        setCourseChartData(chartCourseResponse);
        setLoading(false);
    }

    const onSubmit = async () => {
        await fetchData()
    }

    return (
        <div className="container mx-auto p-4 md:p-10">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Badge title="นักเรียนทั้งหมด" value={summaryData.total_students} icon={ <UsersRound size={30} /> } />
                <Badge title="ใบประกาศทั้งหมด" value={summaryData.total_certificate} icon={ <Album size={30} /> } />
                <Badge title="คำขอใบประกาศทั้งหมด" value={summaryData.total_draft_certificate} icon={ <Album size={30} /> } />
                <Badge title="ใบประกาศในเดือนนี้" value={summaryData.total_certificate_in_month} icon={ <Album size={30} /> } />
            </div>

            <ChartDateRangeFilter
                value={chartFilter}
                onChange={setChartFilter}
                className="mt-6"
                onSubmit={onSubmit}
            />

            <div className="mt-6 grid grid-cols-1 items-stretch gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(360px,1fr)]">
                <BarChart
                    title="ใบประกาศแบ่งตามเดือน"
                    data={certificateChartData}
                    valueLabel="ใบประกาศ"
                    className="h-full"
                />
                <PieChart
                    title="ใบประกาศแบ่งตามหลักสูตร"
                    data={courseChartData}
                    valueLabel="ใบประกาศ"
                    className="h-full"
                />
            </div>
        </div>
    )
}
