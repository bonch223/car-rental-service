"use client";

import { useState } from "react";
import { Vehicle, destinations } from "@/lib/mockData";
import { useStore } from "@/lib/store";
import { X, Calendar, MapPin, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingModalProps {
    vehicle: Vehicle | null;
    isOpen: boolean;
    onClose: () => void;
    initialLocation?: string;
    initialDays?: number;
}

export function BookingModal({ vehicle, isOpen, onClose, initialLocation, initialDays }: BookingModalProps) {
    const { bookVehicle } = useStore();
    const [step, setStep] = useState(1);
    const [days, setDays] = useState(initialDays || 3);

    // Find destination ID based on name, default to Tagum (1)
    const defaultDestId = destinations.find(d => d.name === initialLocation)?.id || "1";
    const [destinationId, setDestinationId] = useState(defaultDestId);

    if (!isOpen || !vehicle) return null;

    const selectedDestination = destinations.find(d => d.id === destinationId) || destinations[0];
    const total = (vehicle.basePriceDaily * days) + selectedDestination.surcharge;

    const handleNext = () => {
        if (step === 2 && vehicle) {
            // Calculate total price again for safety
            const selectedDestination = destinations.find(d => d.id === destinationId) || destinations[0];
            const total = (vehicle.basePriceDaily * days) + selectedDestination.surcharge;

            bookVehicle(vehicle.id, "Online Customer", days, destinationId, total);
        }
        setStep(step + 1);
    };
    const handleBack = () => setStep(step - 1);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-lg font-semibold">
                        {step === 3 ? "Booking Confirmed!" : `Book ${vehicle.make} ${vehicle.model}`}
                    </h2>
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-muted">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                                <img src={vehicle.imageUrl} alt={vehicle.model} className="h-full w-full object-cover" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Pick-up Date</label>
                                    <div className="flex items-center rounded-md border px-3 py-2">
                                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">Dec 15, 2025</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Duration (Days)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={days}
                                        onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                                        className="w-full rounded-md border px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Destination</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <select
                                        value={destinationId}
                                        onChange={(e) => setDestinationId(e.target.value)}
                                        className="w-full appearance-none rounded-md border bg-transparent px-9 py-2 text-sm"
                                    >
                                        {destinations.map(d => (
                                            <option key={d.id} value={d.id}>
                                                {d.name} {d.surcharge > 0 ? `(+₱${d.surcharge})` : ""}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-4 rounded-lg bg-muted p-4">
                                <div className="flex justify-between text-sm">
                                    <span>Base Rate ({days} days)</span>
                                    <span>₱{(vehicle.basePriceDaily * days).toLocaleString()}</span>
                                </div>
                                {selectedDestination.surcharge > 0 && (
                                    <div className="flex justify-between text-sm mt-2 text-primary">
                                        <span>Destination Surcharge</span>
                                        <span>+₱{selectedDestination.surcharge.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="mt-4 flex justify-between border-t border-dashed border-zinc-300 pt-4 font-bold">
                                    <span>Total</span>
                                    <span className="text-xl">₱{total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="rounded-lg border p-4">
                                <h3 className="font-medium mb-2">Customer Details</h3>
                                <div className="space-y-3">
                                    <input type="text" placeholder="Full Name" className="w-full rounded-md border px-3 py-2 text-sm" />
                                    <input type="email" placeholder="Email Address" className="w-full rounded-md border px-3 py-2 text-sm" />
                                    <input type="tel" placeholder="Mobile Number" className="w-full rounded-md border px-3 py-2 text-sm" />
                                </div>
                            </div>
                            <div className="rounded-lg border p-4 bg-muted/50">
                                <h3 className="font-medium mb-2">Payment Method</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    <button className="rounded border bg-white p-2 text-xs font-medium hover:border-primary">GCash</button>
                                    <button className="rounded border bg-white p-2 text-xs font-medium hover:border-primary">Bank Transfer</button>
                                    <button className="rounded border bg-white p-2 text-xs font-medium hover:border-primary">Cash on Pickup</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600">
                                <CheckCircle className="h-12 w-12" />
                            </div>
                            <h3 className="text-2xl font-bold">Booking Successful!</h3>
                            <p className="mt-2 text-muted-foreground">
                                Your reservation for the <span className="font-medium text-foreground">{vehicle.make} {vehicle.model}</span> has been confirmed.
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">Ref: #TAGUM-{Math.floor(Math.random() * 10000)}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t bg-muted/20 p-4">
                    {step < 3 && (
                        <>
                            {step > 1 && (
                                <button onClick={handleBack} className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-muted">
                                    Back
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                            >
                                {step === 1 ? "Continue" : "Confirm Booking"}
                            </button>
                        </>
                    )}
                    {step === 3 && (
                        <button onClick={onClose} className="w-full rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                            Done
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
