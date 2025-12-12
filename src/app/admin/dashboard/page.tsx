"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Car, Wrench, CalendarCheck, TrendingUp, LogOut, CheckCircle } from "lucide-react";
import { CheckOutModal, CheckOutData } from "@/components/admin/CheckOutModal";
import { Booking } from "@/lib/store";

export default function DashboardPage() {
    const { vehicles, activities, bookings, updateCheckOut } = useStore();
    const [showCheckOutModal, setShowCheckOutModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const availableCount = vehicles.filter(v => v.status === "Available").length;
    const rentedCount = vehicles.filter(v => v.status === "Rented").length;
    const maintenanceCount = vehicles.filter(v => v.status === "Maintenance").length;

    // Get active bookings that haven't been checked out yet
    const activeBookings = bookings.filter(b => b.status === "Active" && !b.checkOutData);
    const checkedOutBookings = bookings.filter(b => b.status === "Active" && b.checkOutData);

    const handleCheckOut = (booking: Booking) => {
        setSelectedBooking(booking);
        setShowCheckOutModal(true);
    };

    const handleCheckOutComplete = (checkOutData: CheckOutData) => {
        if (selectedBooking) {
            updateCheckOut(selectedBooking.id, checkOutData);
            setShowCheckOutModal(false);
            setSelectedBooking(null);
        }
    };

    const selectedVehicle = selectedBooking
        ? vehicles.find(v => v.id === selectedBooking.vehicleId)
        : null;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your fleet status and active bookings.</p>
            </div>

            {/* Stats Grid */}
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

            {/* Active Bookings - Awaiting Check-Out */}
            {activeBookings.length > 0 && (
                <div className="rounded-xl border bg-card shadow-sm">
                    <div className="border-b bg-amber-50 p-6">
                        <div className="flex items-center gap-2">
                            <LogOut className="h-5 w-5 text-amber-600" />
                            <h3 className="font-semibold text-amber-900">Awaiting Check-Out ({activeBookings.length})</h3>
                        </div>
                        <p className="text-sm text-amber-700 mt-1">Customers ready to pick up their vehicles</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {activeBookings.map((booking) => {
                                const vehicle = vehicles.find(v => v.id === booking.vehicleId);
                                return (
                                    <div key={booking.id} className="flex items-center justify-between rounded-lg border bg-white p-4">
                                        <div className="flex items-center gap-4">
                                            {vehicle && (
                                                <div className="h-16 w-24 overflow-hidden rounded-lg bg-muted">
                                                    <img src={vehicle.imageUrl} alt={vehicle.model} className="h-full w-full object-cover" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-mono text-sm font-medium text-muted-foreground">{booking.id}</p>
                                                <h4 className="font-bold">{vehicle?.make} {vehicle?.model}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {booking.customerName} • {booking.days} days • ₱{booking.totalPrice.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleCheckOut(booking)}
                                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Check-Out Vehicle
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Checked Out - On Road */}
            {checkedOutBookings.length > 0 && (
                <div className="rounded-xl border bg-card shadow-sm">
                    <div className="border-b bg-green-50 p-6">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <h3 className="font-semibold text-green-900">On Road ({checkedOutBookings.length})</h3>
                        </div>
                        <p className="text-sm text-green-700 mt-1">Vehicles currently with customers</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {checkedOutBookings.map((booking) => {
                                const vehicle = vehicles.find(v => v.id === booking.vehicleId);
                                return (
                                    <div key={booking.id} className="flex items-center justify-between rounded-lg border bg-white p-4">
                                        <div className="flex items-center gap-4">
                                            {vehicle && (
                                                <div className="h-16 w-24 overflow-hidden rounded-lg bg-muted">
                                                    <img src={vehicle.imageUrl} alt={vehicle.model} className="h-full w-full object-cover" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-mono text-sm font-medium text-muted-foreground">{booking.id}</p>
                                                <h4 className="font-bold">{vehicle?.make} {vehicle?.model}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {booking.customerName} • {booking.days} days
                                                </p>
                                                {booking.checkOutData && (
                                                    <p className="text-xs text-green-600 mt-1">
                                                        ✓ Checked out: {booking.checkOutData.initialMileage.toLocaleString()} km, {booking.checkOutData.initialFuelLevel}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                On Road
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Activity */}
            <div className="rounded-xl border bg-card shadow-sm">
                <div className="border-b p-6">
                    <h3 className="font-semibold">Recent Activity</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {activities.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No recent activity.</p>
                        ) : (
                            activities.slice(0, 10).map((activity) => (
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

            {/* Check-Out Modal */}
            <CheckOutModal
                booking={selectedBooking}
                vehicle={selectedVehicle}
                isOpen={showCheckOutModal}
                onClose={() => {
                    setShowCheckOutModal(false);
                    setSelectedBooking(null);
                }}
                onComplete={handleCheckOutComplete}
            />
        </div>
    );
}
