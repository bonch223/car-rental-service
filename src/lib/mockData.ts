export type VehicleCategory = "Sedan" | "SUV" | "Van" | "Pickup";

export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    plateNumber: string;
    category: VehicleCategory;
    transmission: "Automatic" | "Manual";
    fuelType: "Gasoline" | "Diesel";
    seats: number;
    imageUrl: string;
    status: "Available" | "Rented" | "Maintenance";
    basePriceDaily: number;
}

export const vehicles: Vehicle[] = [
    {
        id: "1",
        make: "Toyota",
        model: "Vios",
        year: 2023,
        plateNumber: "ABC-1234",
        category: "Sedan",
        transmission: "Automatic",
        fuelType: "Gasoline",
        seats: 5,
        imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=2070&auto=format&fit=crop",
        status: "Available",
        basePriceDaily: 2500,
    },
    {
        id: "2",
        make: "Toyota",
        model: "Vios",
        year: 2022,
        plateNumber: "DEF-5678",
        category: "Sedan",
        transmission: "Manual",
        fuelType: "Gasoline",
        seats: 5,
        imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=2070&auto=format&fit=crop",
        status: "Rented",
        basePriceDaily: 2000,
    },
    {
        id: "3",
        make: "Toyota",
        model: "Innova",
        year: 2024,
        plateNumber: "GHI-9012",
        category: "MPV" as any, // Using 'as any' to simplify category type for now or update type definition
        transmission: "Automatic",
        fuelType: "Diesel",
        seats: 7,
        imageUrl: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=2069&auto=format&fit=crop",
        status: "Available",
        basePriceDaily: 3500,
    },
    {
        id: "4",
        make: "Toyota",
        model: "Fortuner",
        year: 2023,
        plateNumber: "JKL-3456",
        category: "SUV",
        transmission: "Automatic",
        fuelType: "Diesel",
        seats: 7,
        imageUrl: "https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?q=80&w=2072&auto=format&fit=crop",
        status: "Available",
        basePriceDaily: 4500,
    },
    {
        id: "5",
        make: "Nissan",
        model: "Navara",
        year: 2023,
        plateNumber: "MNO-7890",
        category: "Pickup",
        transmission: "Automatic",
        fuelType: "Diesel",
        seats: 5,
        imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop",
        status: "Maintenance",
        basePriceDaily: 4000,
    },
    {
        id: "6",
        make: "Toyota",
        model: "Hiace",
        year: 2023,
        plateNumber: "PQR-1122",
        category: "Van",
        transmission: "Manual",
        fuelType: "Diesel",
        seats: 15,
        imageUrl: "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?q=80&w=2070&auto=format&fit=crop",
        status: "Available",
        basePriceDaily: 5000,
    },
];

export interface Destination {
    id: string;
    name: string;
    surcharge: number;
}

export const destinations: Destination[] = [
    { id: "1", name: "Tagum City (Local)", surcharge: 0 },
    { id: "2", name: "Davao City", surcharge: 500 },
    { id: "3", name: "Panabo City", surcharge: 300 },
    { id: "4", name: "Digos City", surcharge: 1500 },
    { id: "5", name: "Gensan", surcharge: 2500 },
];
