import Image from "next/image";
import { Vehicle } from "@/lib/mockData";
import { Fuel, Gauge, Settings, Users, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

interface CarCardProps {
    vehicle: Vehicle;
    onBook?: (vehicle: Vehicle) => void;
    className?: string;
}

export function CarCard({ vehicle, onBook, className }: CarCardProps) {
    const { bookings } = useStore();

    // Find active booking for this vehicle
    const activeBooking = bookings.find(b =>
        b.vehicleId === vehicle.id &&
        b.status === "Active"
    );

    const isAvailable = vehicle.status === "Available";
    const isRented = vehicle.status === "Rented";
    const isMaintenance = vehicle.status === "Maintenance";

    return (
        <div className={cn("group relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md", className)}>
            <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
                <Image
                    src={vehicle.imageUrl}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    width={600}
                    height={400}
                    className={cn(
                        "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
                        !isAvailable && "opacity-75 grayscale-[30%]"
                    )}
                />
                <div className="absolute top-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                    {vehicle.category}
                </div>

                {/* Status Badge */}
                {!isAvailable && (
                    <div className={cn(
                        "absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md",
                        isRented && "bg-amber-500/90 text-white",
                        isMaintenance && "bg-red-500/90 text-white"
                    )}>
                        {isRented && "🚗 Rented Now"}
                        {isMaintenance && "🔧 In Maintenance"}
                    </div>
                )}
            </div>

            <div className="p-5">
                <div className="mb-4 flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-bold leading-tight">{vehicle.make} {vehicle.model}</h3>
                        <p className="text-sm text-muted-foreground">{vehicle.year}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold text-primary">₱{vehicle.basePriceDaily.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">/ day</p>
                    </div>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>{vehicle.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4" />
                        <span>{vehicle.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{vehicle.seats} Seats</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4" />
                        <span>Unl. Mileage</span>
                    </div>
                </div>

                {/* Availability Info */}
                {isRented && activeBooking && (
                    <div className="mb-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
                        <div className="flex items-center gap-2 text-xs text-amber-800">
                            <Calendar className="h-3 w-3" />
                            <span className="font-medium">Available from: {new Date(activeBooking.endDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                )}

                {isMaintenance && (
                    <div className="mb-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-center">
                        <p className="text-xs text-red-800 font-medium">Undergoing maintenance</p>
                    </div>
                )}

                <button
                    onClick={() => isAvailable && onBook?.(vehicle)}
                    disabled={!isAvailable}
                    className={cn(
                        "w-full rounded-xl py-3 text-sm font-semibold transition-colors",
                        isAvailable
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    )}
                >
                    {isAvailable ? "Book Now" : isRented ? "Currently Rented" : "Not Available"}
                </button>
            </div>
        </div>
    );
}
