"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {MouseEvent, useRef, useState} from "react";

type BarChartData = {
    key: string;
    value: number;
};

type BarChartProps = {
    title: string;
    data: BarChartData[];
    yAxisTicks?: number[];
    valueLabel?: string;
    className?: string;
};

type TooltipState = {
    key: string;
    value: number;
    x: number;
    y: number;
};

const getNiceMaxValue = (value: number) => {
    if (value <= 0) {
        return 1;
    }

    const magnitude = 10 ** Math.floor(Math.log10(value));
    const normalizedValue = value / magnitude;

    if (normalizedValue <= 2) {
        return 2 * magnitude;
    }

    if (normalizedValue <= 3) {
        return 3 * magnitude;
    }

    if (normalizedValue <= 5) {
        return 5 * magnitude;
    }

    return 10 * magnitude;
};

const getYAxisTicks = (data: BarChartData[]) => {
    const maxDataValue = Math.max(...data.map(({value}) => value), 0);
    const maxTick = getNiceMaxValue(maxDataValue);
    const tickStep = maxTick / 4;

    return Array.from({length: 5}, (_, index) => maxTick - tickStep * index);
};

export const BarChart = ({
    title,
    data,
    yAxisTicks,
    valueLabel = "",
    className = "",
}: BarChartProps) => {
    const resolvedYAxisTicks = yAxisTicks ?? getYAxisTicks(data);
    const maxValue = Math.max(...resolvedYAxisTicks, 1);
    const columnCount = Math.max(data.length, 1);
    const chartRef = useRef<HTMLDivElement>(null);
    const [tooltip, setTooltip] = useState<TooltipState | null>(null);

    const setTooltipPosition = (
        event: MouseEvent<HTMLDivElement>,
        key: string,
        value: number,
    ) => {
        const chartRect = chartRef.current?.getBoundingClientRect();

        if (!chartRect) {
            return;
        }

        setTooltip({
            key,
            value,
            x: event.clientX - chartRect.left,
            y: event.clientY - chartRect.top,
        });
    };

    return (
        <Card className={cn("flex flex-col rounded-md", className)}>
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1">
                <div className="flex w-full overflow-hidden">
                    <div className="grid w-full min-w-0 flex-1 grid-cols-[40px_minmax(0,1fr)] gap-2 sm:grid-cols-[48px_minmax(0,1fr)] sm:gap-3">
                        <div className="flex min-h-56 flex-col justify-between text-right text-xs text-muted-foreground sm:min-h-72">
                            {resolvedYAxisTicks.map((tick) => (
                                <span key={tick}>{tick.toLocaleString()}</span>
                            ))}
                        </div>

                        <div ref={chartRef} className="relative min-h-56 min-w-0 border-b border-l border-border sm:min-h-72">
                            <div className="absolute inset-0 flex flex-col justify-between">
                                {resolvedYAxisTicks.map((tick) => (
                                    <div key={tick} className="border-t border-dashed border-border first:border-t-0" />
                                ))}
                            </div>

                            <div
                                className="relative z-10 grid h-full min-w-0 items-end gap-2 px-2 sm:gap-3 sm:px-4"
                                style={{gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`}}
                            >
                                {data.map(({key, value}, index) => (
                                    <div key={key} className="flex h-full min-w-0 flex-col items-center justify-end gap-2">
                                        <div className="flex w-full flex-col items-center gap-1" style={{height: `${Math.min((value / maxValue) * 100, 100)}%`}}>
                                            <span className="text-xs font-medium text-foreground">
                                                {value.toLocaleString()}
                                            </span>
                                            <div
                                                className="chart-bar-fill min-h-1 w-full flex-1 rounded-t bg-primary transition-opacity hover:opacity-80"
                                                style={{animationDelay: `${index * 80}ms`}}
                                                title={`${key}: ${value.toLocaleString()}${valueLabel ? ` ${valueLabel}` : ""}`}
                                                onMouseEnter={(event) => setTooltipPosition(event, key, value)}
                                                onMouseMove={(event) => setTooltipPosition(event, key, value)}
                                                onMouseLeave={() => setTooltip(null)}
                                            />
                                        </div>
                                        <span className="h-5 w-full truncate text-center text-xs text-muted-foreground">{key}</span>
                                    </div>
                                ))}
                            </div>
                            {tooltip && (
                                <div
                                    className="pointer-events-none absolute z-20 rounded-md bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md"
                                    style={{
                                        left: tooltip.x,
                                        top: tooltip.y,
                                        transform: "translate(-50%, calc(-100% - 8px))",
                                    }}
                                >
                                    <div className="font-medium">{tooltip.key}</div>
                                    <div className="whitespace-nowrap text-muted-foreground">
                                        {tooltip.value.toLocaleString()}{valueLabel ? ` ${valueLabel}` : ""}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
