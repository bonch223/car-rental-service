import Image from "next/image";
import { Vehicle } from "@/lib/mockData";
import { Fuel, Gauge, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarCardProps {
    vehicle: Vehicle;
    onBook?: (vehicle: Vehicle) => void;
    className?: string;
}

export function CarCard({ vehicle, onBook, className }: CarCardProps) {
    return (
        <div className={cn("group relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md", className)}>
            <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
                <Image
                    src={vehicle.imageUrl}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    width={600}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                    {vehicle.category}
                </div>
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

                <button
                    onClick={() => onBook?.(vehicle)}
                    className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                    Book Now
                </button>
            </div>
        </div>
    );
}
