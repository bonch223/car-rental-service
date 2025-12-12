"use client";

import { useState } from "react";
import { destinations, Vehicle } from "@/lib/mockData";
import { useStore } from "@/lib/store";
import { Search, Calendar, Calculator, Save, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function POSPage() {
    const { vehicles, createBooking } = useStore();
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [days, setDays] = useState(3);
    const [destinationId, setDestinationId] = useState("1");
    const [manualOverride, setManualOverride] = useState<string>("");
    const [overrideReason, setOverrideReason] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const selectedDestination = destinations.find(d => d.id === destinationId) || destinations[0];

    const baseTotal = selectedVehicle ? selectedVehicle.basePriceDaily * days : 0;
    const destinationFee = selectedDestination.surcharge;
    const subtotal = baseTotal + destinationFee;

    const finalPrice = manualOverride ? parseInt(manualOverride) : subtotal;
    const discountAmount = subtotal - finalPrice;

    const handleCreateContract = () => {
        if (selectedVehicle) {
            // Create proper booking record
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + days);

            createBooking({
                vehicleId: selectedVehicle.id,
                customerName: "Walk-in Customer",
                customerEmail: "walkin@example.com",
                customerPhone: "+63 000 000 0000",
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                days,
                destinationId,
                addOns: [], // POS doesn't have add-ons selection yet
                basePrice: subtotal,
                addOnsTotal: 0,
                destinationFee: destinations.find(d => d.id === destinationId)?.surcharge || 0,
                totalPrice: finalPrice,
            });

            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setSelectedVehicle(null);
                setManualOverride("");
                setOverrideReason("");
            }, 2000);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <CheckCircle className="h-10 w-10" />
                    </div>
                    <h2 className="text-2xl font-bold">Contract Created!</h2>
                    <p className="text-muted-foreground">Vehicle status updated to Rented.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6">
            {/* Left Panel: Selection */}
            <div className="flex-1 overflow-y-auto pr-2">
                <div className="mb-6 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search cars..."
                            className="w-full rounded-xl border bg-card py-3 pl-10 pr-4 shadow-sm focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border bg-card px-4 shadow-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Dec 15 - Dec 18</span>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {vehicles.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            onClick={() => setSelectedVehicle(vehicle)}
                            className={cn(
                                "cursor-pointer overflow-hidden rounded-xl border bg-card transition-all hover:shadow-md",
                                selectedVehicle?.id === vehicle.id ? "ring-2 ring-primary" : "",
                                vehicle.status !== "Available" ? "opacity-60 grayscale" : ""
                            )}
                        >
                            <div className="aspect-video w-full bg-muted">
                                <img src={vehicle.imageUrl} alt={vehicle.model} className="h-full w-full object-cover" />
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between">
                                    <h3 className="font-bold">{vehicle.make} {vehicle.model}</h3>
                                    <span className={cn(
                                        "rounded-full px-2 py-0.5 text-xs font-medium",
                                        vehicle.status === "Available" ? "bg-green-100 text-green-700" :
                                            vehicle.status === "Rented" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                                    )}>
                                        {vehicle.status}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">{vehicle.plateNumber}</p>
                                <p className="mt-2 font-semibold text-primary">₱{vehicle.basePriceDaily.toLocaleString()}/day</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel: Negotiation Hub */}
            <div className="w-96 flex-none rounded-xl border bg-card shadow-sm">
                <div className="flex h-full flex-col">
                    <div className="border-b p-6">
                        <h2 className="text-lg font-bold">Booking Summary</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {!selectedVehicle ? (
                            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                                <Calculator className="mb-4 h-12 w-12 opacity-20" />
                                <p>Select a vehicle to begin</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Vehicle Details */}
                                <div className="flex gap-4">
                                    <div className="h-16 w-24 overflow-hidden rounded-lg bg-muted">
                                        <img src={selectedVehicle.imageUrl} className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{selectedVehicle.make} {selectedVehicle.model}</h3>
                                        <p className="text-sm text-muted-foreground">{selectedVehicle.plateNumber}</p>
                                    </div>
                                </div>

                                {/* Parameters */}
                                <div className="space-y-4 rounded-lg bg-muted/50 p-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted-foreground">DURATION (DAYS)</label>
                                        <input
                                            type="number"
                                            value={days}
                                            onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                                            className="w-full rounded-md border bg-white px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted-foreground">DESTINATION</label>
                                        <select
                                            value={destinationId}
                                            onChange={(e) => setDestinationId(e.target.value)}
                                            className="w-full rounded-md border bg-white px-3 py-2 text-sm"
                                        >
                                            {destinations.map(d => (
                                                <option key={d.id} value={d.id}>{d.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Calculation */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Base Rate (x{days})</span>
                                        <span>₱{baseTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Destination Fee</span>
                                        <span>₱{destinationFee.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 font-bold">
                                        <span>Subtotal</span>
                                        <span>₱{subtotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Manual Override */}
                                <div className="rounded-lg border-2 border-dashed border-primary/20 bg-primary/5 p-4">
                                    <label className="mb-2 block text-xs font-bold text-primary">MANUAL OVERRIDE (NEGOTIATION)</label>
                                    <div className="flex gap-2">
                                        <span className="flex items-center font-bold text-muted-foreground">₱</span>
                                        <input
                                            type="number"
                                            placeholder={subtotal.toString()}
                                            value={manualOverride}
                                            onChange={(e) => setManualOverride(e.target.value)}
                                            className="w-full bg-transparent text-xl font-bold text-primary focus:outline-none"
                                        />
                                    </div>
                                    {manualOverride && (
                                        <div className="mt-2">
                                            <select
                                                value={overrideReason}
                                                onChange={(e) => setOverrideReason(e.target.value)}
                                                className="w-full rounded border bg-white px-2 py-1 text-xs"
                                            >
                                                <option value="">Select Reason...</option>
                                                <option value="haggle">Haggle / Negotiation</option>
                                                <option value="loyalty">Loyalty Discount</option>
                                                <option value="promo">Manager Promo</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Discount Applied</span>
                                        <span>-₱{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="border-t bg-muted/20 p-6">
                        <div className="mb-4 flex items-end justify-between">
                            <span className="font-medium text-muted-foreground">Total to Pay</span>
                            <span className="text-3xl font-bold text-primary">₱{finalPrice.toLocaleString()}</span>
                        </div>
                        <button
                            onClick={handleCreateContract}
                            disabled={!selectedVehicle || selectedVehicle.status !== "Available"}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="h-5 w-5" />
                            {selectedVehicle?.status === "Available" ? "Create Contract" : "Vehicle Unavailable"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
