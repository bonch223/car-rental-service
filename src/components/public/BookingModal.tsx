"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import { Vehicle, destinations } from "@/lib/mockData";
import { useStore } from "@/lib/store";

interface BookingModalProps {
    vehicle: Vehicle | null;
    isOpen: boolean;
    onClose: () => void;
    initialLocation?: string;
    initialDays?: number;
}

export function BookingModal({ vehicle, isOpen, onClose, initialLocation, initialDays }: BookingModalProps) {
    const { createBooking, addOns } = useStore();
    const [step, setStep] = useState(1);
    const [days, setDays] = useState(initialDays || 3);

    // Find destination ID based on name, default to Tagum (1)
    const defaultDestId = destinations.find(d => d.name === initialLocation)?.id || "1";
    const [destinationId, setDestinationId] = useState(defaultDestId);

    // Customer info
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");

    // Add-ons
    const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

    // Booking reference
    const [bookingRef, setBookingRef] = useState("");

    if (!isOpen || !vehicle) return null;

    const selectedDestination = destinations.find(d => d.id === destinationId) || destinations[0];
    const basePrice = vehicle.basePriceDaily * days;
    const destinationFee = selectedDestination.surcharge;
    const addOnsTotal = selectedAddOns.reduce((sum, id) => {
        const addOn = addOns.find(a => a.id === id);
        return sum + (addOn ? addOn.price * days : 0);
    }, 0);
    const total = basePrice + destinationFee + addOnsTotal;

    const toggleAddOn = (id: string) => {
        setSelectedAddOns(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const handleNext = () => {
        if (step === 3) {
            // Create booking
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + days);

            const bookingId = createBooking({
                vehicleId: vehicle.id,
                customerName,
                customerEmail,
                customerPhone,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                days,
                destinationId,
                addOns: selectedAddOns,
                basePrice,
                addOnsTotal,
                destinationFee,
                totalPrice: total,
            });

            setBookingRef(bookingId);
        }
        setStep(step + 1);
    };

    const handleClose = () => {
        setStep(1);
        setCustomerName("");
        setCustomerEmail("");
        setCustomerPhone("");
        setSelectedAddOns([]);
        setBookingRef("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-lg font-semibold">
                        {step === 4 ? "Booking Confirmed!" : `Book ${vehicle.make} ${vehicle.model}`}
                    </h2>
                    <button onClick={handleClose} className="rounded-full p-2 hover:bg-muted">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Progress */}
                {step < 4 && (
                    <div className="flex items-center gap-2 border-b px-6 py-3">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex flex-1 items-center gap-2">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                    }`}>
                                    {s}
                                </div>
                                <span className="text-sm font-medium">
                                    {s === 1 ? 'Details' : s === 2 ? 'Add-ons' : 'Customer Info'}
                                </span>
                                {s < 3 && <div className="ml-auto h-0.5 flex-1 bg-muted" />}
                            </div>
                        ))}
                    </div>
                )}

                {/* Body */}
                <div className="p-6">
                    {/* Step 1: Details */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Rental Duration (Days)</label>
                                    <input
                                        type="number"
                                        value={days}
                                        onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                                        className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                        min="1"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Destination</label>
                                    <select
                                        value={destinationId}
                                        onChange={(e) => setDestinationId(e.target.value)}
                                        className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                    >
                                        {destinations.map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Base Rate ({days} days × ₱{vehicle.basePriceDaily})</span>
                                    <span className="font-medium">₱{basePrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Destination Fee ({selectedDestination.name})</span>
                                    <span>₱{destinationFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2 font-bold text-primary">
                                    <span>Subtotal</span>
                                    <span>₱{(basePrice + destinationFee).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Add-ons */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">Enhance your rental experience with these optional add-ons:</p>

                            <div className="grid gap-3">
                                {addOns.map((addOn) => {
                                    const isSelected = selectedAddOns.includes(addOn.id);
                                    return (
                                        <button
                                            key={addOn.id}
                                            onClick={() => toggleAddOn(addOn.id)}
                                            className={`flex items-center gap-4 rounded-lg border-2 p-4 text-left transition-all ${isSelected
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-muted hover:border-primary/50'
                                                }`}
                                        >
                                            <div className="text-3xl">{addOn.icon}</div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{addOn.name}</h3>
                                                <p className="text-sm text-muted-foreground">₱{addOn.price}/day × {days} days = ₱{(addOn.price * days).toLocaleString()}</p>
                                            </div>
                                            <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${isSelected ? 'border-primary bg-primary' : 'border-muted'
                                                }`}>
                                                {isSelected && <Check className="h-4 w-4 text-primary-foreground" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {selectedAddOns.length > 0 && (
                                <div className="rounded-lg border bg-green-50 p-4">
                                    <div className="flex justify-between text-sm font-medium text-green-900">
                                        <span>Add-ons Total</span>
                                        <span>+₱{addOnsTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Customer Info */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name *</label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                    placeholder="Juan Dela Cruz"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address *</label>
                                <input
                                    type="email"
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                    placeholder="juan@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone Number *</label>
                                <input
                                    type="tel"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                    placeholder="+63 912 345 6789"
                                />
                            </div>

                            <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Base Rate</span>
                                    <span>₱{basePrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Destination Fee</span>
                                    <span>₱{destinationFee.toLocaleString()}</span>
                                </div>
                                {addOnsTotal > 0 && (
                                    <div className="flex justify-between text-green-700">
                                        <span>Add-ons ({selectedAddOns.length})</span>
                                        <span>₱{addOnsTotal.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between border-t pt-2 text-lg font-bold text-primary">
                                    <span>Total Amount</span>
                                    <span>₱{total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Confirmation */}
                    {step === 4 && (
                        <div className="space-y-6 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <Check className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Booking Confirmed!</h3>
                                <p className="mt-2 text-muted-foreground">Your booking reference number:</p>
                                <p className="mt-1 text-2xl font-mono font-bold text-primary">{bookingRef}</p>
                            </div>
                            <div className="rounded-lg border bg-muted/30 p-4 text-left text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Vehicle:</span>
                                    <span className="font-medium">{vehicle.make} {vehicle.model}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Customer:</span>
                                    <span className="font-medium">{customerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Duration:</span>
                                    <span className="font-medium">{days} days</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total:</span>
                                    <span className="font-bold text-primary">₱{total.toLocaleString()}</span>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                A confirmation email has been sent to <span className="font-medium">{customerEmail}</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t bg-muted/20 p-4">
                    {step > 1 && step < 4 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-muted"
                        >
                            Back
                        </button>
                    )}
                    {step < 4 && (
                        <button
                            onClick={handleNext}
                            disabled={step === 3 && (!customerName || !customerEmail || !customerPhone)}
                            className="ml-auto rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {step === 3 ? 'Confirm Booking' : 'Continue'}
                        </button>
                    )}
                    {step === 4 && (
                        <button
                            onClick={handleClose}
                            className="ml-auto rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                        >
                            Done
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
