"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserData } from "@/lib/types";

interface SimulationFormProps {
    onSubmit: (data: UserData) => void;
    isLoading: boolean;
}


const DEFAULT_INTERESTS = [
    { id: "tech", label: "Tech" },
    { id: "fashion", label: "Fashion" },
    { id: "sustainability", label: "Sustainability" },
    { id: "travel", label: "Travel" },
    { id: "finance", label: "Finance" },
    { id: "gaming", label: "Gaming" },
];

export default function SimulationForm({ onSubmit, isLoading }: SimulationFormProps) {
    const { register, handleSubmit, setValue, watch } = useForm<UserData>({
        defaultValues: {
            age_range: "25-34",
            location: "New York, USA",
            purchase_history: [],
            content_engagement: { tech: 0.8, sustainability: 0.6 },
        }
    });

    const [selectedInterests, setSelectedInterests] = useState<string[]>(["tech", "sustainability"]);
    const [purchases, setPurchases] = useState<string[]>(["Smart Watch"]);

    const handleInterestToggle = (id: string, label: string) => {
        const current = watch("content_engagement");
        const newEngagement = { ...current };

        if (newEngagement[id]) {
            delete newEngagement[id];
            setSelectedInterests(prev => prev.filter(i => i !== id));
        } else {
            newEngagement[id] = 0.8; // Default high engagement for demo
            setSelectedInterests(prev => [...prev, id]);
        }
        setValue("content_engagement", newEngagement);
    };

    const addPurchase = (item: string) => {
        setPurchases(prev => [...prev, item]);
        setValue("purchase_history", [...purchases, item]);
    }

    const removePurchase = (item: string) => {
        const newPurchases = purchases.filter(p => p !== item);
        setPurchases(newPurchases);
        setValue("purchase_history", newPurchases);
    }

    const onFormSubmit = (data: UserData) => {
        const finalData = {
            ...data,
            purchase_history: purchases
        };
        onSubmit(finalData);
    };

    return (
        <Card className="w-full max-w-lg border-white/10 bg-black shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            <CardHeader>
                <CardTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    Step 1: User Signal Input
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Input synthetic data to simulate a user profile.
                    <span className="block mt-1 text-xs text-gray-500 font-mono">
                        * All data is processed locally within the demo context.
                    </span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="age">Age Range</Label>
                            <Select onValueChange={(val) => setValue("age_range", val)} defaultValue="25-34">
                                <SelectTrigger id="age" className="bg-white/5 border-white/10">
                                    <SelectValue placeholder="Select Age" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="18-24">18-24</SelectItem>
                                    <SelectItem value="25-34">25-34</SelectItem>
                                    <SelectItem value="35-44">35-44</SelectItem>
                                    <SelectItem value="45+">45+</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                className="bg-white/5 border-white/10"
                                placeholder="City, Country"
                                {...register("location")}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Content Engagement (Interests)</Label>
                        <div className="flex flex-wrap gap-2">
                            {DEFAULT_INTERESTS.map((interest) => (
                                <Badge
                                    key={interest.id}
                                    className={`cursor-pointer transition-all duration-300 border ${selectedInterests.includes(interest.id) ? 'bg-primary border-primary text-black font-bold shadow-[0_0_10px_rgba(255,215,0,0.2)]' : 'bg-transparent text-gray-400 border-white/10 hover:border-primary/50 hover:text-primary'}`}
                                    onClick={() => handleInterestToggle(interest.id, interest.label)}
                                >
                                    {interest.label}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Purchase History (Recent)</Label>
                        <div className="flex gap-2">
                            <Input
                                id="new-purchase"
                                placeholder="Add item..."
                                className="bg-white/5 border-white/10"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addPurchase(e.currentTarget.value);
                                        e.currentTarget.value = "";
                                    }
                                }}
                            />
                            <Button type="button" variant="secondary" onClick={() => {
                                const el = document.getElementById("new-purchase") as HTMLInputElement;
                                if (el && el.value) {
                                    addPurchase(el.value);
                                    el.value = "";
                                }
                            }}>Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {purchases.map(p => (
                                <Badge key={p} variant="secondary" className="pr-1">
                                    {p}
                                    <button onClick={() => removePurchase(p)} className="ml-2 hover:text-red-400">×</button>
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-primary text-black hover:bg-white font-bold py-6 text-lg transition-all shadow-[0_4px_20px_rgba(255,215,0,0.15)] hover:shadow-[0_4px_30px_rgba(255,215,0,0.3)]"
                        disabled={isLoading}
                    >
                        {isLoading ? "Generating Profile..." : "Run Simulation →"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
