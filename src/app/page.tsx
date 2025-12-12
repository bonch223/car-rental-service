"use client";

import { useState } from "react";
import Link from "next/link";
import { Vehicle } from "@/lib/mockData";
import { useStore } from "@/lib/store";
import { CarCard } from "@/components/public/CarCard";
import { BookingModal } from "@/components/public/BookingModal";
import { Calendar, MapPin, Search } from "lucide-react";

export default function Home() {
  const { vehicles } = useStore();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [location, setLocation] = useState("Tagum City");
  const [dateRange, setDateRange] = useState({ start: "2025-12-15", end: "2025-12-18" });
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      document.getElementById("fleet")?.scrollIntoView({ behavior: "smooth" });
    }, 800);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBook = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-background" onClick={() => {
      setShowLocationPicker(false);
      setShowDatePicker(false);
    }}>
      {/* Hero Section */}
      <section className="relative h-[600px] w-full bg-black text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?q=80&w=2128&auto=format&fit=crop"
          alt="Hero Background"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />

        <div className="relative z-20 container mx-auto flex h-full flex-col justify-center px-4">
          <h1 className="max-w-2xl text-5xl font-extrabold tracking-tight sm:text-7xl">
            Drive <span className="text-primary">Tagum</span> <br /> With Confidence.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-gray-300">
            Premium car rental service in Tagum City. Transparent pricing, well-maintained fleet, and 24/7 support.
          </p>

          {/* Search Widget */}
          <div className="mt-10 flex max-w-4xl flex-col gap-2 rounded-2xl bg-white p-2 sm:flex-row sm:items-center sm:p-2 shadow-xl relative" onClick={(e) => e.stopPropagation()}>

            {/* Location Picker */}
            <div
              className="relative flex-1"
              onClick={() => { setShowLocationPicker(!showLocationPicker); setShowDatePicker(false); }}
            >
              <div className="flex cursor-pointer items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100">
                <MapPin className="h-5 w-5 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-500">PICK-UP</span>
                  <span className="font-medium text-black">{location}</span>
                </div>
              </div>

              {showLocationPicker && (
                <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] overflow-hidden rounded-xl border bg-white shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                  {["Tagum City", "Davao City", "Panabo City", "Digos City", "Gensan"].map((loc) => (
                    <button
                      key={loc}
                      onClick={() => { setLocation(loc); setShowLocationPicker(false); }}
                      className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-px w-full bg-gray-200 sm:h-10 sm:w-px" />

            {/* Date Picker */}
            <div
              className="relative flex-1"
              onClick={() => { setShowDatePicker(!showDatePicker); setShowLocationPicker(false); }}
            >
              <div className="flex cursor-pointer items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100">
                <Calendar className="h-5 w-5 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-500">DATE</span>
                  <span className="font-medium text-black">
                    {new Date(dateRange.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(dateRange.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>

              {showDatePicker && (
                <div className="absolute top-full left-0 mt-2 w-full min-w-[280px] rounded-xl border bg-white p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500">START DATE</label>
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm text-black focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500">END DATE</label>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm text-black focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="w-full rounded-lg bg-primary py-2 text-sm font-bold text-white"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); handleSearch(); }}
              disabled={isSearching}
              className="h-full rounded-xl bg-primary px-8 py-4 font-bold text-white transition-all hover:scale-105 hover:bg-primary/90 disabled:opacity-70 disabled:hover:scale-100 sm:w-auto min-w-[140px]"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section id="fleet" className="container mx-auto py-20 px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Premium Fleet</h2>
          <p className="mt-4 text-muted-foreground">Choose from our selection of maintained vehicles.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.filter(v => v.status === "Available").map((vehicle) => (
            <CarCard key={vehicle.id} vehicle={vehicle} onBook={handleBook} />
          ))}
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        vehicle={selectedVehicle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialLocation={location}
        initialDays={Math.ceil((new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) / (1000 * 60 * 60 * 24)) || 3}
      />

      {/* Footer / Staff Access */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>&copy; 2025 Ace & King Car Rental Service. All rights reserved.</p>
        <div className="mt-4">
          <Link href="/admin/pos" className="text-xs font-medium text-primary hover:underline">
            Staff Access (POS System)
          </Link>
        </div>
      </footer>
    </main>
  );
}
