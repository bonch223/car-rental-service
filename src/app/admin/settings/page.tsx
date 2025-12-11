"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { DollarSign, MapPin, Calendar, Plus, X, ToggleLeft, ToggleRight } from "lucide-react";

export default function PricingPage() {
    const { pricingRules, updatePricingRule, destinations, addDestination } = useStore();
    const [showAddDestination, setShowAddDestination] = useState(false);
    const [newDest, setNewDest] = useState({ name: "", surcharge: "" });

    const handleTogglePricing = (ruleId: string) => {
        const rule = pricingRules.find(r => r.id === ruleId);
        if (rule) {
            updatePricingRule({ ...rule, isActive: !rule.isActive });
        }
    };

    const handleAddDestination = () => {
        if (newDest.name && newDest.surcharge) {
            const newId = (destinations.length + 1).toString();
            addDestination({
                id: newId,
                name: newDest.name,
                surcharge: parseInt(newDest.surcharge)
            });
            setNewDest({ name: "", surcharge: "" });
            setShowAddDestination(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Pricing Configuration</h1>
                <p className="text-muted-foreground">Manage seasonal pricing, destination surcharges, and rate tiers.</p>
            </div>

            {/* Seasonal/Peak Pricing */}
            <div className="rounded-xl border bg-card shadow-sm">
                <div className="border-b p-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Seasonal / Peak Pricing</h2>
                            <p className="text-sm text-muted-foreground">Apply percentage surcharges during peak seasons</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {pricingRules.map((rule) => (
                        <div key={rule.id} className="rounded-lg border bg-muted/30 p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold">{rule.name}</h3>
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${rule.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {rule.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Start Date:</span>
                                            <p className="font-medium">{new Date(rule.startDate).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">End Date:</span>
                                            <p className="font-medium">{new Date(rule.endDate).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Surcharge:</span>
                                            <p className="font-medium text-primary">+{rule.surchargePercentage}%</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleTogglePricing(rule.id)}
                                    className="ml-4"
                                >
                                    {rule.isActive ? (
                                        <ToggleRight className="h-8 w-8 text-green-600" />
                                    ) : (
                                        <ToggleLeft className="h-8 w-8 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-4 text-center">
                        <p className="text-sm text-muted-foreground">Additional seasonal pricing rules can be added here</p>
                    </div>
                </div>
            </div>

            {/* Destination Surcharges */}
            <div className="rounded-xl border bg-card shadow-sm">
                <div className="border-b p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-primary/10 p-2 text-primary">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">Destination Surcharges</h2>
                                <p className="text-sm text-muted-foreground">Fixed fees for travel outside standard routes</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowAddDestination(true)}
                            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4" />
                            Add Destination
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {destinations.map((dest) => (
                            <div key={dest.id} className="rounded-lg border bg-gradient-to-br from-white to-gray-50 p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-primary/10 p-2">
                                            <MapPin className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{dest.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {dest.surcharge > 0 ? `+₱${dest.surcharge.toLocaleString()}` : 'No surcharge'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Base Rate Tiers (Mock Display) */}
            <div className="rounded-xl border bg-card shadow-sm">
                <div className="border-b p-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                            <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Base Rate Tiers (By Category)</h2>
                            <p className="text-sm text-muted-foreground">Standard pricing structure for vehicle categories</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="pb-3 text-left font-semibold">Category</th>
                                    <th className="pb-3 text-right font-semibold">Daily</th>
                                    <th className="pb-3 text-right font-semibold">Weekly</th>
                                    <th className="pb-3 text-right font-semibold">Monthly</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr className="hover:bg-muted/30">
                                    <td className="py-3 font-medium">Sedan</td>
                                    <td className="py-3 text-right">₱1,500</td>
                                    <td className="py-3 text-right">₱9,000</td>
                                    <td className="py-3 text-right">₱30,000</td>
                                </tr>
                                <tr className="hover:bg-muted/30">
                                    <td className="py-3 font-medium">SUV</td>
                                    <td className="py-3 text-right">₱2,500</td>
                                    <td className="py-3 text-right">₱15,000</td>
                                    <td className="py-3 text-right">₱50,000</td>
                                </tr>
                                <tr className="hover:bg-muted/30">
                                    <td className="py-3 font-medium">Van</td>
                                    <td className="py-3 text-right">₱3,000</td>
                                    <td className="py-3 text-right">₱18,000</td>
                                    <td className="py-3 text-right">₱60,000</td>
                                </tr>
                                <tr className="hover:bg-muted/30">
                                    <td className="py-3 font-medium">Pickup</td>
                                    <td className="py-3 text-right">₱2,000</td>
                                    <td className="py-3 text-right">₱12,000</td>
                                    <td className="py-3 text-right">₱40,000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground">Note: Individual vehicle rates may vary. These are category averages.</p>
                </div>
            </div>

            {/* Add Destination Modal */}
            {showAddDestination && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-2xl">
                        <div className="flex items-center justify-between border-b p-4">
                            <h2 className="text-lg font-semibold">Add New Destination</h2>
                            <button onClick={() => setShowAddDestination(false)} className="rounded-full p-2 hover:bg-muted">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Destination Name</label>
                                <input
                                    type="text"
                                    value={newDest.name}
                                    onChange={(e) => setNewDest({ ...newDest, name: e.target.value })}
                                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                    placeholder="e.g., Mati City"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Surcharge Amount (₱)</label>
                                <input
                                    type="number"
                                    value={newDest.surcharge}
                                    onChange={(e) => setNewDest({ ...newDest, surcharge: e.target.value })}
                                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                                    placeholder="1500"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t bg-muted/20 p-4">
                            <button
                                onClick={() => setShowAddDestination(false)}
                                className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-muted"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddDestination}
                                className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                            >
                                Add Destination
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
