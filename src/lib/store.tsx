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

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    bookings: string[]; // Booking IDs
}

interface StoreContextType {
    vehicles: Vehicle[];
    activities: Activity[];
    destinations: Destination[];
    maintenanceLogs: MaintenanceLog[];
    pricingRules: PricingRule[];
    customers: Customer[];

    // Actions
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
    const [customers, setCustomers] = useState<Customer[]>([]);

    const addActivity = (message: string, type: Activity["type"]) => {
        const newActivity: Activity = {
            id: Math.random().toString(36).substr(2, 9),
            message,
            timestamp: new Date(),
            type,
        };
        setActivities((prev) => [newActivity, ...prev]);
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
                customers,
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
