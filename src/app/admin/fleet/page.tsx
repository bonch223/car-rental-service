"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Car, Wrench, CheckCircle, Plus, X, Calendar, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FleetPage() {
    const { vehicles, returnVehicle, setMaintenance, maintenanceLogs, addMaintenanceLog } = useStore();
    const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
    const [maintenanceForm, setMaintenanceForm] = useState({
        type: "Service" as "Repair" | "Service" | "LTO Registration",
        cost: "",
        notes: "",
        mileage: "",
        date: new Date().toISOString().split('T')[0]
    });

    const handleAddMaintenance = () => {
        if (selectedVehicle && maintenanceForm.cost && maintenanceForm.mileage) {
            addMaintenanceLog({
                vehicleId: selectedVehicle,
                date: maintenanceForm.date,
                type: maintenanceForm.type,
                cost: parseFloat(maintenanceForm.cost),
                notes: maintenanceForm.notes,
                mileage: parseInt(maintenanceForm.mileage)
            });
            setShowMaintenanceModal(false);
            setMaintenanceForm({
                type: "Service",
                cost: "",
                notes: "",
                mileage: "",
                date: new Date().toISOString().split('T')[0]
            });
        }
    };

    const vehicleLogs = selectedVehicle
        ? maintenanceLogs.filter(log => log.vehicleId === selectedVehicle)
        : [];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
                    <p className="text-muted-foreground">Manage vehicle status, maintenance, and detailed records.</p>
                </div>
                <div className="flex gap-2">
                    <div className="rounded-lg border bg-card px-4 py-2">
                        <span className="text-sm font-medium text-muted-foreground">Total Fleet: </span>
                        <span className="text-lg font-bold">{vehicles.length}</span>
                    </div>
                </div>
            </div>

            {/* Status Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-gradient-to-br from-green-50 to-green-100 p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-green-600 p-2 text-white">
                            <Car className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-green-700">Available</p>
                            <p className="text-2xl font-bold text-green-900">{vehicles.filter(v => v.status === "Available").length}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border bg-gradient-to-br from-yellow-50 to-yellow-100 p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-yellow-600 p-2 text-white">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-yellow-700">Rented</p>
                            <p className="text-2xl font-bold text-yellow-900">{vehicles.filter(v => v.status === "Rented").length}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border bg-gradient-to-br from-red-50 to-red-100 p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-red-600 p-2 text-white">
                            <Wrench className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-red-700">Maintenance</p>
                            <p className="text-2xl font-bold text-red-900">{vehicles.filter(v => v.status === "Maintenance").length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vehicle Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                        <div className="aspect-video w-full bg-muted relative">
                            <img src={vehicle.imageUrl} alt={vehicle.model} className="h-full w-full object-cover" />
                            <div className="absolute top-3 right-3">
                                <span className={cn(
                                    "rounded-full px-3 py-1 text-xs font-medium shadow-sm backdrop-blur-sm",
                                    vehicle.status === "Available" ? "bg-green-100/90 text-green-700" :
                                        vehicle.status === "Rented" ? "bg-yellow-100/90 text-yellow-700" : "bg-red-100/90 text-red-700"
                                )}>
                                    {vehicle.status}
                                </span>
                            </div>
                        </div>

                        <div className="p-5 space-y-4">
                            <div>
                                <h3 className="text-lg font-bold">{vehicle.make} {vehicle.model}</h3>
                                <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                    <div>
                                        <span className="font-medium">Plate:</span> {vehicle.plateNumber}
                                    </div>
                                    <div>
                                        <span className="font-medium">Year:</span> {vehicle.year}
                                    </div>
                                    <div>
                                        <span className="font-medium">Type:</span> {vehicle.category}
                                    </div>
                                    <div>
                                        <span className="font-medium">Rate:</span> ₱{vehicle.basePriceDaily}/day
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {vehicle.status === "Rented" && (
                                    <button
                                        onClick={() => returnVehicle(vehicle.id)}
                                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                        Return
                                    </button>
                                )}

                                {vehicle.status === "Available" && (
                                    <button
                                        onClick={() => setMaintenance(vehicle.id)}
                                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-orange-500 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
                                    >
                                        <Wrench className="h-4 w-4" />
                                        Maintenance
                                    </button>
                                )}

                                {vehicle.status === "Maintenance" && (
                                    <button
                                        onClick={() => returnVehicle(vehicle.id)}
                                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                        Mark Fixed
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        setSelectedVehicle(vehicle.id);
                                        setShowMaintenanceModal(true);
                                    }}
                                    className="flex items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                    Log
                                </button>
                            </div>

                            {/* Show recent maintenance */}
                            {maintenanceLogs.filter(log => log.vehicleId === vehicle.id).slice(0, 1).map(log => (
                                <div key={log.id} className="rounded-lg bg-muted/50 p-3 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{log.type}</span>
                                        <span className="text-muted-foreground">{new Date(log.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="mt-1 text-muted-foreground">₱{log.cost.toLocaleString()} • {log.mileage.toLocaleString()} km</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Maintenance Log Modal */}
            {showMaintenanceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-2xl">
                        <div className="flex items-center justify-between border-b p-4">
                            <h2 className="text-lg font-semibold">Add Maintenance Log</h2>
                            <button onClick={() => setShowMaintenanceModal(false)} className="rounded-full p-2 hover:bg-muted">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type</label>
                                <select
                                    value={maintenanceForm.type}
                                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, type: e.target.value as any })}
                                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                >
                                    <option value="Service">Service</option>
                                    <option value="Repair">Repair</option>
                                    <option value="LTO Registration">LTO Registration</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date</label>
                                <input
                                    type="date"
                                    value={maintenanceForm.date}
                                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, date: e.target.value })}
                                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Cost (₱)</label>
                                    <input
                                        type="number"
                                        value={maintenanceForm.cost}
                                        onChange={(e) => setMaintenanceForm({ ...maintenanceForm, cost: e.target.value })}
                                        className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                        placeholder="5000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Mileage (km)</label>
                                    <input
                                        type="number"
                                        value={maintenanceForm.mileage}
                                        onChange={(e) => setMaintenanceForm({ ...maintenanceForm, mileage: e.target.value })}
                                        className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                        placeholder="45000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Notes</label>
                                <textarea
                                    value={maintenanceForm.notes}
                                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, notes: e.target.value })}
                                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                    rows={3}
                                    placeholder="Oil change, brake pads replaced..."
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t bg-muted/20 p-4">
                            <button
                                onClick={() => setShowMaintenanceModal(false)}
                                className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-muted"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddMaintenance}
                                className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                            >
                                Add Log
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
