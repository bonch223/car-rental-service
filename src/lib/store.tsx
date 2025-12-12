"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { vehicles as initialVehicles, Vehicle, destinations as initialDestinations, Destination } from "./mockData";

export interface Activity {
    id: string;
    message: string;
    timestamp: Date;
    type: "booking" | "return" | "maintenance" | "system";
}

export interface MaintenanceLog {
    id: string;
    vehicleId: string;
    date: string;
    type: "Repair" | "Service" | "LTO Registration";
    cost: number;
    notes: string;
    mileage: number;
}

export interface PricingRule {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    surchargePercentage: number;
    isActive: boolean;
}

export interface AddOn {
    id: string;
    name: string;
    price: number;
    icon: string;
}

export interface Booking {
    id: string;
    vehicleId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    startDate: string;
    endDate: string;
    days: number;
    destinationId: string;
    addOns: string[]; // AddOn IDs
    basePrice: number;
    addOnsTotal: number;
    destinationFee: number;
    totalPrice: number;
    status: "Active" | "Completed" | "Cancelled";
    createdAt: Date;
    returnPhotos?: string[]; // Base64 encoded images
    returnNotes?: string;
}

interface StoreContextType {
    vehicles: Vehicle[];
    activities: Activity[];
    destinations: Destination[];
    maintenanceLogs: MaintenanceLog[];
    pricingRules: PricingRule[];
    addOns: AddOn[];
    bookings: Booking[];

    // Actions
    createBooking: (booking: Omit<Booking, "id" | "createdAt" | "status">) => string;
    completeBooking: (bookingId: string, photos?: string[], notes?: string) => void;
    bookVehicle: (vehicleId: string, customerName: string, days: number, destinationId: string, price: number) => void;
    returnVehicle: (vehicleId: string) => void;
    setMaintenance: (vehicleId: string) => void;
    addMaintenanceLog: (log: Omit<MaintenanceLog, "id">) => void;
    updatePricingRule: (rule: PricingRule) => void;
    addDestination: (dest: Destination) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
    const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
    const [destinations, setDestinations] = useState<Destination[]>(initialDestinations);
    const [activities, setActivities] = useState<Activity[]>([
        {
            id: "0",
            message: "System initialized with 20 vehicles",
            timestamp: new Date(),
            type: "system",
        },
    ]);
    const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
    const [pricingRules, setPricingRules] = useState<PricingRule[]>([
        { id: "1", name: "Christmas Rush", startDate: "2025-12-15", endDate: "2026-01-05", surchargePercentage: 20, isActive: true }
    ]);
    const [addOns] = useState<AddOn[]>([
        { id: "1", name: "Child Seat", price: 200, icon: "👶" },
        { id: "2", name: "GPS Navigation", price: 150, icon: "🗺️" },
        { id: "3", name: "Comprehensive Insurance", price: 500, icon: "🛡️" },
        { id: "4", name: "Additional Driver", price: 300, icon: "👤" },
    ]);
    const [bookings, setBookings] = useState<Booking[]>([]);

    const addActivity = (message: string, type: Activity["type"]) => {
        const newActivity: Activity = {
            id: Math.random().toString(36).substr(2, 9),
            message,
            timestamp: new Date(),
            type,
        };
        setActivities((prev) => [newActivity, ...prev]);
    };

    const createBooking = (bookingData: Omit<Booking, "id" | "createdAt" | "status">) => {
        const newBooking: Booking = {
            ...bookingData,
            id: `BK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            createdAt: new Date(),
            status: "Active",
        };

        setBookings(prev => [newBooking, ...prev]);
        setVehicles((prev) =>
            prev.map((v) =>
                v.id === bookingData.vehicleId ? { ...v, status: "Rented" } : v
            )
        );

        const vehicle = vehicles.find((v) => v.id === bookingData.vehicleId);
        if (vehicle) {
            addActivity(
                `New booking: ${vehicle.make} ${vehicle.model} for ${bookingData.customerName} (${bookingData.days} days, ₱${bookingData.totalPrice})`,
                "booking"
            );
        }

        return newBooking.id;
    };

    const completeBooking = (bookingId: string, photos?: string[], notes?: string) => {
        setBookings(prev => prev.map(b =>
            b.id === bookingId
                ? { ...b, status: "Completed" as const, returnPhotos: photos, returnNotes: notes }
                : b
        ));

        const booking = bookings.find(b => b.id === bookingId);
        if (booking) {
            setVehicles((prev) =>
                prev.map((v) =>
                    v.id === booking.vehicleId ? { ...v, status: "Available" } : v
                )
            );

            const vehicle = vehicles.find((v) => v.id === booking.vehicleId);
            if (vehicle) {
                addActivity(`Booking ${bookingId} completed: ${vehicle.make} ${vehicle.model} returned`, "return");
            }
        }
    };

    const bookVehicle = (vehicleId: string, customerName: string, days: number, destinationId: string, price: number) => {
        setVehicles((prev) =>
            prev.map((v) =>
                v.id === vehicleId ? { ...v, status: "Rented" } : v
            )
        );
        const vehicle = vehicles.find((v) => v.id === vehicleId);
        if (vehicle) {
            addActivity(`Vehicle ${vehicle.make} ${vehicle.model} rented to ${customerName} for ${days} days (₱${price})`, "booking");
        }
    };

    const returnVehicle = (vehicleId: string) => {
        setVehicles((prev) =>
            prev.map((v) =>
                v.id === vehicleId ? { ...v, status: "Available" } : v
            )
        );
        const vehicle = vehicles.find((v) => v.id === vehicleId);
        if (vehicle) {
            addActivity(`Vehicle ${vehicle.make} ${vehicle.model} returned`, "return");
        }
    };

    const setMaintenance = (vehicleId: string) => {
        setVehicles((prev) =>
            prev.map((v) =>
                v.id === vehicleId ? { ...v, status: "Maintenance" } : v
            )
        );
        const vehicle = vehicles.find((v) => v.id === vehicleId);
        if (vehicle) {
            addActivity(`Vehicle ${vehicle.make} ${vehicle.model} sent for maintenance`, "maintenance");
        }
    };

    const addMaintenanceLog = (log: Omit<MaintenanceLog, "id">) => {
        const newLog = { ...log, id: Math.random().toString(36).substr(2, 9) };
        setMaintenanceLogs(prev => [newLog, ...prev]);
        addActivity(`Maintenance log added for vehicle ${log.vehicleId}`, "maintenance");
    };

    const updatePricingRule = (rule: PricingRule) => {
        setPricingRules(prev => prev.map(r => r.id === rule.id ? rule : r));
        addActivity(`Pricing rule '${rule.name}' updated`, "system");
    };

    const addDestination = (dest: Destination) => {
        setDestinations(prev => [...prev, dest]);
        addActivity(`New destination '${dest.name}' added`, "system");
    };

    return (
        <StoreContext.Provider
            value={{
                vehicles,
                activities,
                destinations,
                maintenanceLogs,
                pricingRules,
                addOns,
                bookings,
                createBooking,
                completeBooking,
                bookVehicle,
                returnVehicle,
                setMaintenance,
                addMaintenanceLog,
                updatePricingRule,
                addDestination,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
}
