"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import { Check, User } from "lucide-react"

export function FeatureChart() {
    const data = [
        { name: "Mon", score: 45 },
        { name: "Tue", score: 52 },
        { name: "Wed", score: 48 },
        { name: "Thu", score: 61 },
        { name: "Fri", score: 55 },
        { name: "Sat", score: 67 },
        { name: "Sun", score: 72 },
    ]

    return (
        <div className="h-[200px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--color-background)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="score"
                        stroke="var(--color-primary)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorScore)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export function FastRecordingMock() {
    return (
        <div className="space-y-4 pt-4">
            {/* Mock Input Row 1 */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-secondary/20">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Ahmad Fulan</p>
                        <p className="text-xs text-muted-foreground">Juz 29, Page 12</p>
                    </div>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                    <Check className="h-4 w-4" />
                </div>
            </div>

            {/* Mock Input Row 2 */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-background shadow-sm opacity-60">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <User className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Siti Aminah</p>
                        <p className="text-xs text-muted-foreground">Juz 1, Page 4</p>
                    </div>
                </div>
                <div className="h-4 w-12 rounded bg-muted animate-pulse"></div>
            </div>
        </div>
    )
}
