"use client";

import { useState } from "react";
import { X, Camera, AlertCircle, CheckCircle } from "lucide-react";
import { Vehicle } from "@/lib/mockData";
import { Booking } from "@/lib/store";

interface CheckOutModalProps {
    booking: Booking | null;
    vehicle: Vehicle | null;
    isOpen: boolean;
    onClose: () => void;
    onComplete: (checkOutData: CheckOutData) => void;
}

export interface CheckOutData {
    bookingId: string;
    initialMileage: number;
    initialFuelLevel: string;
    preExistingDamages: string;
    checkOutPhotos: string[];
    checkOutDate: Date;
    checkedOutBy: string;
}

export function CheckOutModal({ booking, vehicle, isOpen, onClose, onComplete }: CheckOutModalProps) {
    const [formData, setFormData] = useState({
        initialMileage: "",
        initialFuelLevel: "Full",
        preExistingDamages: "",
        checkedOutBy: "Staff Name",
    });
    const [photos, setPhotos] = useState<string[]>([]);

    if (!isOpen || !vehicle || !booking) return null;

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPhotos(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const handleComplete = () => {
        const checkOutData: CheckOutData = {
            bookingId: booking.id,
            initialMileage: parseInt(formData.initialMileage) || 0,
            initialFuelLevel: formData.initialFuelLevel,
            preExistingDamages: formData.preExistingDamages,
            checkOutPhotos: photos,
            checkOutDate: new Date(),
            checkedOutBy: formData.checkedOutBy,
        };

        onComplete(checkOutData);

        // Reset form
        setFormData({
            initialMileage: "",
            initialFuelLevel: "Full",
            preExistingDamages: "",
            checkedOutBy: "Staff Name",
        });
        setPhotos([]);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between border-b bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                    <div>
                        <h2 className="text-lg font-semibold">Vehicle Check-Out</h2>
                        <p className="text-sm text-blue-100">Recording initial condition</p>
                    </div>
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-white/20">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-[70vh] overflow-y-auto p-6">
                    <div className="space-y-6">
                        {/* Booking Info */}
                        <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-16 w-24 overflow-hidden rounded-lg bg-muted">
                                    <img src={vehicle.imageUrl} alt={vehicle.model} className="h-full w-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold">{vehicle.make} {vehicle.model}</h3>
                                    <p className="text-sm text-muted-foreground">{vehicle.plateNumber}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Booking Ref:</span>
                                    <span className="ml-2 font-mono font-medium">{booking.id}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Customer:</span>
                                    <span className="ml-2 font-medium">{booking.customerName}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Duration:</span>
                                    <span className="ml-2 font-medium">{booking.days} days</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Total:</span>
                                    <span className="ml-2 font-medium">₱{booking.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Alert */}
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-amber-900">Important: Document Initial Condition</p>
                                    <p className="text-amber-700">Record the vehicle's current state before customer takes possession. This protects both parties.</p>
                                </div>
                            </div>
                        </div>

                        {/* Check-Out Form */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Initial Mileage (km) *</label>
                                    <input
                                        type="number"
                                        value={formData.initialMileage}
                                        onChange={(e) => setFormData({ ...formData, initialMileage: e.target.value })}
                                        className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                        placeholder="45000"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Initial Fuel Level *</label>
                                    <select
                                        value={formData.initialFuelLevel}
                                        onChange={(e) => setFormData({ ...formData, initialFuelLevel: e.target.value })}
                                        className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                    >
                                        <option value="Full">Full Tank</option>
                                        <option value="3/4">3/4 Tank</option>
                                        <option value="Half">Half Tank</option>
                                        <option value="1/4">1/4 Tank</option>
                                        <option value="Empty">Empty/Low</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pre-Existing Damages/Notes</label>
                                <textarea
                                    value={formData.preExistingDamages}
                                    onChange={(e) => setFormData({ ...formData, preExistingDamages: e.target.value })}
                                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                    rows={3}
                                    placeholder="Document any scratches, dents, or issues already present..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Staff Name</label>
                                <input
                                    type="text"
                                    value={formData.checkedOutBy}
                                    onChange={(e) => setFormData({ ...formData, checkedOutBy: e.target.value })}
                                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                    placeholder="Your name"
                                />
                            </div>

                            {/* Photo Upload */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Vehicle Photos (Recommended)</label>
                                <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                        id="photo-upload"
                                    />
                                    <label
                                        htmlFor="photo-upload"
                                        className="flex cursor-pointer flex-col items-center gap-2"
                                    >
                                        <Camera className="h-8 w-8 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            Click to upload photos or drag and drop
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Document all sides, interior, and any existing damage
                                        </p>
                                    </label>
                                </div>

                                {/* Photo Preview */}
                                {photos.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mt-3">
                                        {photos.map((photo, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={photo}
                                                    alt={`Photo ${index + 1}`}
                                                    className="h-24 w-full rounded-lg object-cover"
                                                />
                                                <button
                                                    onClick={() => removePhoto(index)}
                                                    className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t bg-muted/20 p-4">
                    <p className="text-sm text-muted-foreground">
                        {photos.length} photo{photos.length !== 1 ? 's' : ''} uploaded
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-muted"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleComplete}
                            disabled={!formData.initialMileage}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <CheckCircle className="h-4 w-4" />
                            Complete Check-Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
