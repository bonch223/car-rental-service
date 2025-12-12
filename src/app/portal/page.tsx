"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Car, Calendar, MapPin, Package, User, Mail, Phone, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export default function PortalPage() {
    const { bookings, vehicles, destinations, addOns } = useStore();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock login - in real app, verify credentials
        setIsLoggedIn(true);
    };

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock signup - in real app, create account
        setIsLoggedIn(true);
        setShowSignup(false);
    };

    // Mock: filter bookings by email (in real app, use authenticated user)
    const userBookings = bookings.filter(b =>
        b.customerEmail.toLowerCase() === email.toLowerCase()
    );

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header */}
                <div className="border-b bg-white shadow-sm">
                    <div className="container mx-auto flex items-center justify-between px-6 py-4">
                        <Link href="/" className="text-2xl font-bold text-primary">
                            Ace & King
                        </Link>
                        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                            ← Back to Home
                        </Link>
                    </div>
                </div>

                {/* Login/Signup Form */}
                <div className="flex min-h-[calc(100vh-73px)] items-center justify-center p-6">
                    <div className="w-full max-w-md">
                        <div className="overflow-hidden rounded-2xl border bg-white shadow-xl">
                            <div className="border-b bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
                                <h1 className="text-2xl font-bold">
                                    {showSignup ? "Create Account" : "Customer Portal"}
                                </h1>
                                <p className="mt-1 text-sm text-white/80">
                                    {showSignup ? "Sign up to view your bookings" : "Sign in to view your bookings"}
                                </p>
                            </div>

                            <div className="p-6">
                                {!showSignup ? (
                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full rounded-lg border bg-white py-2 pl-10 pr-3 text-sm"
                                                    placeholder="your@email.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Password</label>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground hover:bg-primary/90"
                                        >
                                            <LogIn className="h-5 w-5" />
                                            Sign In
                                        </button>

                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={() => setShowSignup(true)}
                                                className="text-sm text-primary hover:underline"
                                            >
                                                Don't have an account? Sign up
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <form onSubmit={handleSignup} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full rounded-lg border bg-white py-2 pl-10 pr-3 text-sm"
                                                    placeholder="Juan Dela Cruz"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full rounded-lg border bg-white py-2 pl-10 pr-3 text-sm"
                                                    placeholder="your@email.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="w-full rounded-lg border bg-white py-2 pl-10 pr-3 text-sm"
                                                    placeholder="+63 912 345 6789"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Password</label>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground hover:bg-primary/90"
                                        >
                                            <UserPlus className="h-5 w-5" />
                                            Create Account
                                        </button>

                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={() => setShowSignup(false)}
                                                className="text-sm text-primary hover:underline"
                                            >
                                                Already have an account? Sign in
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        <p className="mt-4 text-center text-xs text-muted-foreground">
                            Demo: Use any email to login and view bookings
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="border-b bg-white shadow-sm">
                <div className="container mx-auto flex items-center justify-between px-6 py-4">
                    <Link href="/" className="text-2xl font-bold text-primary">
                        Ace & King
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{email}</span>
                        <button
                            onClick={() => setIsLoggedIn(false)}
                            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">My Bookings</h1>
                    <p className="text-muted-foreground">View and manage your rental history</p>
                </div>

                {userBookings.length === 0 ? (
                    <div className="rounded-xl border bg-white p-12 text-center">
                        <Car className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">No bookings yet</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Start by browsing our fleet and making your first booking!
                        </p>
                        <Link
                            href="/"
                            className="mt-4 inline-block rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                        >
                            Browse Vehicles
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {userBookings.map((booking) => {
                            const vehicle = vehicles.find(v => v.id === booking.vehicleId);
                            const destination = destinations.find(d => d.id === booking.destinationId);
                            const bookingAddOns = addOns.filter(a => booking.addOns.includes(a.id));

                            return (
                                <div key={booking.id} className="overflow-hidden rounded-xl border bg-white shadow-sm">
                                    <div className="flex items-center justify-between border-b bg-muted/30 px-6 py-3">
                                        <div>
                                            <span className="text-sm font-medium text-muted-foreground">Booking Reference</span>
                                            <p className="font-mono text-lg font-bold">{booking.id}</p>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${booking.status === "Active" ? "bg-green-100 text-green-700" :
                                                booking.status === "Completed" ? "bg-blue-100 text-blue-700" :
                                                    "bg-gray-100 text-gray-700"
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex gap-6">
                                            {vehicle && (
                                                <div className="h-32 w-48 flex-none overflow-hidden rounded-lg bg-muted">
                                                    <img src={vehicle.imageUrl} alt={vehicle.model} className="h-full w-full object-cover" />
                                                </div>
                                            )}

                                            <div className="flex-1 space-y-4">
                                                <div>
                                                    <h3 className="text-xl font-bold">{vehicle?.make} {vehicle?.model}</h3>
                                                    <p className="text-sm text-muted-foreground">{vehicle?.plateNumber}</p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <span className="text-muted-foreground">Duration:</span>
                                                            <span className="ml-1 font-medium">{booking.days} days</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <span className="text-muted-foreground">Destination:</span>
                                                            <span className="ml-1 font-medium">{destination?.name}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {bookingAddOns.length > 0 && (
                                                    <div className="flex items-start gap-2">
                                                        <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                        <div className="text-sm">
                                                            <span className="text-muted-foreground">Add-ons:</span>
                                                            <span className="ml-1 font-medium">
                                                                {bookingAddOns.map(a => a.name).join(", ")}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between border-t pt-4">
                                                    <div className="text-sm text-muted-foreground">
                                                        Booked on {new Date(booking.createdAt).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm text-muted-foreground">Total Amount</div>
                                                        <div className="text-2xl font-bold text-primary">₱{booking.totalPrice.toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
