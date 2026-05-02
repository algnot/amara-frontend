"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {MouseEvent, useState} from "react";

type PieChartData = {
    key: string;
    value: number;
};

type PieChartProps = {
    title: string;
    data: PieChartData[];
    maxSlices?: number;
    valueLabel?: string;
    className?: string;
};

type TooltipState = {
    key: string;
    value: number;
    percent: number;
    x: number;
    y: number;
};

const chartColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
];

const otherColor = "hsl(var(--muted-foreground))";
const otherKey = "อื่น ๆ";

const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);

    return [x, y];
};

const getSlicePath = (startPercent: number, endPercent: number) => {
    const [startX, startY] = getCoordinatesForPercent(startPercent);
    const [endX, endY] = getCoordinatesForPercent(endPercent);
    const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0;

    return [
        `M ${startX} ${startY}`,
        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        "L 0 0",
    ].join(" ");
};

const getDisplayData = (data: PieChartData[], maxSlices: number) => {
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    if (sortedData.length <= maxSlices) {
        return sortedData;
    }

    const topData = sortedData.slice(0, maxSlices);
    const otherValue = sortedData
        .slice(maxSlices)
        .reduce((sum, item) => sum + item.value, 0);

    return [
        ...topData,
        {key: otherKey, value: otherValue},
    ];
};

export const PieChart = ({
    title,
    data,
    maxSlices = 5,
    valueLabel = "",
    className = "",
}: PieChartProps) => {
    const displayData = getDisplayData(data, maxSlices);
    const total = displayData.reduce((sum, item) => sum + item.value, 0);
    const [tooltip, setTooltip] = useState<TooltipState | null>(null);
    let cumulativePercent = -0.25;

    const setTooltipPosition = (
        event: MouseEvent<SVGPathElement>,
        key: string,
        value: number,
        percent: number,
    ) => {
        const svgRect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();

        if (!svgRect) {
            return;
        }

        setTooltip({
            key,
            value,
            percent,
            x: event.clientX - svgRect.left,
            y: event.clientY - svgRect.top,
        });
    };

    return (
        <Card className={cn("flex flex-col rounded-md", className)}>
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1">
                <div className="grid w-full min-w-0 gap-6 2xl:grid-cols-[minmax(180px,240px)_minmax(0,1fr)] 2xl:items-center">
                    <div className="relative mx-auto aspect-square w-full max-w-60">
                        <svg viewBox="-1 -1 2 2" className="h-full w-full rotate-[-90deg] overflow-visible">
                            {total > 0 ? displayData.map(({key, value}, index) => {
                                const startPercent = cumulativePercent;
                                const percent = value / total;
                                cumulativePercent += percent;
                                const endPercent = cumulativePercent;

                                return (
                                    <path
                                        key={key}
                                        className="chart-pie-slice transition-opacity hover:opacity-80"
                                        d={getSlicePath(startPercent, endPercent)}
                                        fill={key === otherKey ? otherColor : chartColors[index % chartColors.length]}
                                        style={{animationDelay: `${index * 90}ms`}}
                                        onMouseEnter={(event) => setTooltipPosition(event, key, value, percent)}
                                        onMouseMove={(event) => setTooltipPosition(event, key, value, percent)}
                                        onMouseLeave={() => setTooltip(null)}
                                    >
                                        <title>{`${key}: ${value.toLocaleString()}${valueLabel ? ` ${valueLabel}` : ""}`}</title>
                                    </path>
                                );
                            }) : (
                                <circle r="1" fill="hsl(var(--muted))" />
                            )}
                        </svg>
                        {tooltip && (
                            <div
                                className="pointer-events-none absolute z-10 rounded-md bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md"
                                style={{
                                    left: tooltip.x,
                                    top: tooltip.y,
                                    transform: "translate(-50%, calc(-100% - 8px))",
                                }}
                            >
                                <div className="font-medium">{tooltip.key}</div>
                                <div className="whitespace-nowrap text-muted-foreground">
                                    {tooltip.value.toLocaleString()}{valueLabel ? ` ${valueLabel}` : ""} ({(tooltip.percent * 100).toFixed(1)}%)
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid min-w-0 gap-3">
                        <div>
                            <div className="text-sm text-muted-foreground">ทั้งหมด</div>
                            <div className="text-2xl font-semibold">{total.toLocaleString()}</div>
                        </div>

                        <div className="grid min-w-0 gap-2">
                            {displayData.map(({key, value}, index) => {
                                const percent = total > 0 ? (value / total) * 100 : 0;

                                return (
                                    <div key={key} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 text-sm">
                                        <div className="flex min-w-0 items-center gap-2">
                                            <span
                                                className="size-3 shrink-0 rounded-sm"
                                                style={{backgroundColor: key === otherKey ? otherColor : chartColors[index % chartColors.length]}}
                                            />
                                            <span className="truncate">{key}</span>
                                        </div>
                                        <span className="text-right font-medium">{value.toLocaleString()}</span>
                                        <span className="text-right text-muted-foreground">{percent.toFixed(1)}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
