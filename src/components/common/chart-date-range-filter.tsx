"use client";

import {ArrowRight, CalendarRange, Filter} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {cn} from "@/lib/utils";

export type ChartDateRangeFilterValue = {
    startMonth: string;
    startYear: string;
    endMonth: string;
    endYear: string;
};

type ChartDateRangeFilterProps = {
    value: ChartDateRangeFilterValue;
    onChange: (value: ChartDateRangeFilterValue) => void;
    onSubmit?: (value: ChartDateRangeFilterValue) => void;
    startYear?: number;
    className?: string;
};

const monthOptions = [
    {label: "มกราคม", value: "1"},
    {label: "กุมภาพันธ์", value: "2"},
    {label: "มีนาคม", value: "3"},
    {label: "เมษายน", value: "4"},
    {label: "พฤษภาคม", value: "5"},
    {label: "มิถุนายน", value: "6"},
    {label: "กรกฎาคม", value: "7"},
    {label: "สิงหาคม", value: "8"},
    {label: "กันยายน", value: "9"},
    {label: "ตุลาคม", value: "10"},
    {label: "พฤศจิกายน", value: "11"},
    {label: "ธันวาคม", value: "12"},
];

const getFilterMonthIndex = (year: string, month: string) => Number(year) * 12 + Number(month);

export const getDefaultChartDateRangeFilterValue = (): ChartDateRangeFilterValue => {
    const currentDate = new Date();

    return {
        startMonth: "1",
        startYear: String(currentDate.getFullYear()),
        endMonth: String(currentDate.getMonth() + 1),
        endYear: String(currentDate.getFullYear()),
    };
};

export const getChartDateRangeFilterError = (
    value: ChartDateRangeFilterValue,
    currentDate = new Date(),
) => {
    const currentFilterMonthIndex = getFilterMonthIndex(
        String(currentDate.getFullYear()),
        String(currentDate.getMonth() + 1),
    );
    const startFilterMonthIndex = getFilterMonthIndex(value.startYear, value.startMonth);
    const endFilterMonthIndex = getFilterMonthIndex(value.endYear, value.endMonth);

    if (startFilterMonthIndex > endFilterMonthIndex) {
        return "ช่วงเริ่มต้นต้องไม่มากกว่าช่วงสิ้นสุด";
    }

    if (endFilterMonthIndex > currentFilterMonthIndex) {
        return "ช่วงสิ้นสุดต้องไม่มากกว่าเดือนปัจจุบัน";
    }

    return "";
};

export const ChartDateRangeFilter = ({
    value,
    onChange,
    onSubmit,
    startYear = 2024,
    className = "",
}: ChartDateRangeFilterProps) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentFilterMonthIndex = getFilterMonthIndex(String(currentYear), String(currentMonth));
    const error = getChartDateRangeFilterError(value, currentDate);
    const yearOptions = Array.from(
        {length: currentYear - startYear + 1},
        (_, index) => String(startYear + index),
    );

    const handleValueChange = (key: keyof ChartDateRangeFilterValue, nextValue: string) => {
        const nextFilter = {
            ...value,
            [key]: nextValue,
        };

        const startIndex = getFilterMonthIndex(nextFilter.startYear, nextFilter.startMonth);
        const endIndex = getFilterMonthIndex(nextFilter.endYear, nextFilter.endMonth);

        if (startIndex > endIndex) {
            nextFilter.endMonth = nextFilter.startMonth;
            nextFilter.endYear = nextFilter.startYear;
        }

        const currentIndex = getFilterMonthIndex(
            String(currentDate.getFullYear()),
            String(currentDate.getMonth() + 1),
        );

        if (getFilterMonthIndex(nextFilter.endYear, nextFilter.endMonth) > currentIndex) {
            nextFilter.endMonth = String(currentDate.getMonth() + 1);
            nextFilter.endYear = String(currentDate.getFullYear());
        }

        onChange(nextFilter);
    };

    const isFutureMonthOption = (year: string, month: string) => {
        return getFilterMonthIndex(year, month) > currentFilterMonthIndex;
    };

    return (
        <div className={cn("rounded-md border bg-card p-3 shadow-sm", className)}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 flex-col gap-2 rounded-md bg-muted/60 p-1.5 sm:flex-row sm:items-center sm:gap-1">
                    <div className="flex h-9 items-center justify-center px-2 text-muted-foreground">
                        <CalendarRange size={18} />
                    </div>

                    <div className="grid min-w-0 grid-cols-2 gap-1 sm:w-[236px]">
                        <Select
                            value={value.startMonth}
                            onValueChange={(nextValue) => handleValueChange("startMonth", nextValue)}
                        >
                            <SelectTrigger aria-label="เดือนเริ่มต้น" className="h-9 border-0 bg-transparent shadow-none hover:bg-background">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {monthOptions.map((month) => (
                                    <SelectItem
                                        key={month.value}
                                        value={month.value}
                                        disabled={isFutureMonthOption(value.startYear, month.value)}
                                    >
                                        {month.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={value.startYear}
                            onValueChange={(nextValue) => handleValueChange("startYear", nextValue)}
                        >
                            <SelectTrigger aria-label="ปีเริ่มต้น" className="h-9 border-0 bg-transparent shadow-none hover:bg-background">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {yearOptions.map((year) => (
                                    <SelectItem key={year} value={year}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex h-9 items-center justify-center px-2 text-muted-foreground">
                        <ArrowRight size={18} />
                    </div>

                    <div className="grid min-w-0 grid-cols-2 gap-1 sm:w-[236px]">
                        <Select
                            value={value.endMonth}
                            onValueChange={(nextValue) => handleValueChange("endMonth", nextValue)}
                        >
                            <SelectTrigger aria-label="เดือนสิ้นสุด" className="h-9 border-0 bg-transparent shadow-none hover:bg-background">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {monthOptions.map((month) => (
                                    <SelectItem
                                        key={month.value}
                                        value={month.value}
                                        disabled={isFutureMonthOption(value.endYear, month.value)}
                                    >
                                        {month.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={value.endYear}
                            onValueChange={(nextValue) => handleValueChange("endYear", nextValue)}
                        >
                            <SelectTrigger aria-label="ปีสิ้นสุด" className="h-9 border-0 bg-transparent shadow-none hover:bg-background">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {yearOptions.map((year) => (
                                    <SelectItem key={year} value={year}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button
                    type="button"
                    className="w-full lg:w-auto"
                    disabled={Boolean(error)}
                    onClick={() => onSubmit?.(value)}
                >
                    <Filter size={16} />
                    อัพเดทกราฟ
                </Button>
            </div>

            {error && (
                <p className="mt-3 text-sm text-destructive">{error}</p>
            )}
        </div>
    );
};
