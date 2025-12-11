"use client";

import { useState } from "react";
import { X, Camera, AlertTriangle, CheckCircle } from "lucide-react";
import { Vehicle } from "@/lib/mockData";

interface CheckInModalProps {
    vehicle: Vehicle | null;
    isOpen: boolean;
    onClose: () => void;
    onComplete: (vehicleId: string, fees: number) => void;
}

export function CheckInModal({ vehicle, isOpen, onClose, onComplete }: CheckInModalProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        returnMileage: "",
        fuelLevel: "Full",
        condition: "Good",
        damages: "",
        lateDays: 0,
        extraKm: 0,
    });

    if (!isOpen || !vehicle) return null;

    // Mock original contract data
    const originalMileage = 45000;
    const expectedReturnDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
    const rentalDays = 3;
    const originalPrice = vehicle.basePriceDaily * rentalDays;

    // Calculate fees
    const kmDriven = formData.returnMileage ? parseInt(formData.returnMileage) - originalMileage : 0;
    const excessKm = Math.max(0, kmDriven - 300); // 300km free allowance
    const excessKmFee = excessKm * 10; // ₱10 per excess km

    const lateFee = formData.lateDays * vehicle.basePriceDaily * 1.5; // 1.5x daily rate for late returns

    const fuelFee = formData.fuelLevel === "Empty" ? 1500 :
        formData.fuelLevel === "Half" ? 800 : 0;

    const damageFee = formData.condition === "Damaged" ? 5000 : 0;

    const totalFees = excessKmFee + lateFee + fuelFee + damageFee;
    const finalAmount = originalPrice + totalFees;

    const handleComplete = () => {
        if (step === 2) {
            onComplete(vehicle.id, totalFees);
            onClose();
            // Reset form
            setFormData({
                returnMileage: "",
                fuelLevel: "Full",
                condition: "Good",
                damages: "",
                lateDays: 0,
                extraKm: 0,
            });
            setStep(1);
        } else {
            setStep(2);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-lg font-semibold">
                        {step === 1 ? "Vehicle Check-In" : "Return Summary"}
                    </h2>
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-muted">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {step === 1 && (
                        <div className="space-y-6">
                            {/* Vehicle Info */}
                            <div className="rounded-lg border bg-muted/30 p-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-24 overflow-hidden rounded-lg bg-muted">
                                        <img src={vehicle.imageUrl} alt={vehicle.model} className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{vehicle.make} {vehicle.model}</h3>
                                        <p className="text-sm text-muted-foreground">{vehicle.plateNumber}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Original Contract Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="rounded-lg border bg-white p-3">
                                    <span className="text-muted-foreground">Rental Period</span>
                                    <p className="font-medium">{rentalDays} days</p>
                                </div>
                                <div className="rounded-lg border bg-white p-3">
                                    <span className="text-muted-foreground">Original Amount</span>
                                    <p className="font-medium">₱{originalPrice.toLocaleString()}</p>
                                </div>
                                <div className="rounded-lg border bg-white p-3">
                                    <span className="text-muted-foreground">Pickup Mileage</span>
                                    <p className="font-medium">{originalMileage.toLocaleString()} km</p>
                                </div>
                                <div className="rounded-lg border bg-white p-3">
                                    <span className="text-muted-foreground">Expected Return</span>
                                    <p className="font-medium">{expectedReturnDate.toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Check-In Form */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Return Mileage (km)</label>
                                        <input
                                            type="number"
                                            value={formData.returnMileage}
                                            onChange={(e) => setFormData({ ...formData, returnMileage: e.target.value })}
                                            className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                            placeholder={originalMileage.toString()}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Late Days</label>
                                        <input
                                            type="number"
                                            value={formData.lateDays}
                                            onChange={(e) => setFormData({ ...formData, lateDays: parseInt(e.target.value) || 0 })}
                                            className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Fuel Level</label>
                                        <select
                                            value={formData.fuelLevel}
                                            onChange={(e) => setFormData({ ...formData, fuelLevel: e.target.value })}
                                            className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                        >
                                            <option value="Full">Full Tank</option>
                                            <option value="Half">Half Tank</option>
                                            <option value="Empty">Empty/Low</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Vehicle Condition</label>
                                        <select
                                            value={formData.condition}
                                            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                            className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                        >
                                            <option value="Good">Good Condition</option>
                                            <option value="Minor">Minor Issues</option>
                                            <option value="Damaged">Damaged</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Damage Notes (if any)</label>
                                    <textarea
                                        value={formData.damages}
                                        onChange={(e) => setFormData({ ...formData, damages: e.target.value })}
                                        className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                        rows={3}
                                        placeholder="Describe any scratches, dents, or issues..."
                                    />
                                </div>

                                <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-4 text-center">
                                    <Camera className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">Photo upload would go here</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            {/* Summary */}
                            <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                                <h3 className="mb-4 font-bold text-primary">Return Summary</h3>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Original Rental Amount</span>
                                        <span className="font-medium">₱{originalPrice.toLocaleString()}</span>
                                    </div>

                                    {excessKmFee > 0 && (
                                        <div className="flex justify-between text-orange-600">
                                            <span>Excess KM Fee ({excessKm} km × ₱10)</span>
                                            <span className="font-medium">+₱{excessKmFee.toLocaleString()}</span>
                                        </div>
                                    )}

                                    {lateFee > 0 && (
                                        <div className="flex justify-between text-red-600">
                                            <span>Late Return Fee ({formData.lateDays} days)</span>
                                            <span className="font-medium">+₱{lateFee.toLocaleString()}</span>
                                        </div>
                                    )}

                                    {fuelFee > 0 && (
                                        <div className="flex justify-between text-orange-600">
                                            <span>Fuel Charge ({formData.fuelLevel})</span>
                                            <span className="font-medium">+₱{fuelFee.toLocaleString()}</span>
                                        </div>
                                    )}

                                    {damageFee > 0 && (
                                        <div className="flex justify-between text-red-600">
                                            <span>Damage Assessment</span>
                                            <span className="font-medium">+₱{damageFee.toLocaleString()}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between border-t pt-2 text-base font-bold">
                                        <span>Total Amount</span>
                                        <span className="text-primary">₱{finalAmount.toLocaleString()}</span>
                                    </div>

                                    {totalFees > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Additional Fees</span>
                                            <span className="font-medium">₱{totalFees.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Warnings */}
                            {totalFees > 0 && (
                                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                                        <div>
                                            <p className="font-medium text-orange-900">Additional Charges Applied</p>
                                            <p className="text-sm text-orange-700">Customer will be charged ₱{totalFees.toLocaleString()} in additional fees.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {totalFees === 0 && (
                                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        <div>
                                            <p className="font-medium text-green-900">Clean Return</p>
                                            <p className="text-sm text-green-700">No additional charges. Vehicle returned in good condition.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t bg-muted/20 p-4">
                    {step === 2 && (
                        <button
                            onClick={() => setStep(1)}
                            className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-muted"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={handleComplete}
                        className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                        {step === 1 ? "Review & Continue" : "Complete Check-In"}
                    </button>
                </div>
            </div>
        </div>
    );
}
