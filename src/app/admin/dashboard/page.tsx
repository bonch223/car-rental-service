"use client";

import { useStore } from "@/lib/store";
import { Car, Wrench, CalendarCheck, TrendingUp } from "lucide-react";

export default function DashboardPage() {
    const { vehicles, activities } = useStore();

    const availableCount = vehicles.filter(v => v.status === "Available").length;
    const rentedCount = vehicles.filter(v => v.status === "Rented").length;
    const maintenanceCount = vehicles.filter(v => v.status === "Maintenance").length;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your fleet status.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-green-100 p-3 text-green-600">
                            <Car className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Available Cars</p>
                            <h3 className="text-2xl font-bold">{availableCount}</h3>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-yellow-100 p-3 text-yellow-600">
                            <CalendarCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Currently Rented</p>
                            <h3 className="text-2xl font-bold">{rentedCount}</h3>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-red-100 p-3 text-red-600">
                            <Wrench className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">In Maintenance</p>
                            <h3 className="text-2xl font-bold">{maintenanceCount}</h3>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Revenue (Dec)</p>
                            <h3 className="text-2xl font-bold">₱124,500</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border bg-card shadow-sm">
                <div className="border-b p-6">
                    <h3 className="font-semibold">Recent Activity</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {activities.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No recent activity.</p>
                        ) : (
                            activities.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-2 w-2 rounded-full ${activity.type === 'booking' ? 'bg-green-500' :
                                                activity.type === 'return' ? 'bg-blue-500' : 'bg-red-500'
                                            }`} />
                                        <div>
                                            <p className="font-medium">{activity.message}</p>
                                            <p className="text-xs text-muted-foreground">{activity.type.toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {activity.timestamp.toLocaleTimeString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
