"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdVariant, LandingPage, BehavioralProfile } from "@/lib/types";
import LandingPageModal from "./LandingPageModal";

// Temporary Import for demo product (In a real app, this would come from context or props)
const DEMO_PRODUCT = {
    name: "Lumina X1",
    category: "Smart Wearable",
    features: ["Bio-metric Sensing", "7-Day Battery", "Titanium Finish", "AI Assistant"],
    price_tier: "Premium"
};

interface AdDisplayProps {
    personalized: AdVariant[];
    generic: AdVariant;
    profile: BehavioralProfile; // Needed for expand logic
}

export default function AdDisplay({ personalized, generic, profile }: AdDisplayProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [landingPageData, setLandingPageData] = useState<LandingPage | null>(null);
    const [isLoadingLP, setIsLoadingLP] = useState(false);
    const [selectedAd, setSelectedAd] = useState<AdVariant | null>(null);

    const handleAdClick = async (ad: AdVariant) => {
        if (!process.env.NEXT_PUBLIC_API_URL && !window.location.hostname.includes("localhost")) {
            console.error("API URL not configured");
            return;
        }

        setSelectedAd(ad);
        setIsModalOpen(true);
        setIsLoadingLP(true);
        setLandingPageData(null);

        try {
            const response = await fetch("http://localhost:8000/expand-ad", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    profile: profile,
                    ad_variant: ad,
                    product: DEMO_PRODUCT
                })
            });

            if (!response.ok) throw new Error("Failed to generate landing page");
            const data = await response.json();
            setLandingPageData(data);
        } catch (error) {
            console.error(error);
            alert("Failed to generate landing page. Check backend connection.");
            setIsModalOpen(false); // Close on error
        } finally {
            setIsLoadingLP(false);
        }
    };

    return (
        <div className="space-y-8 w-full max-w-4xl mx-auto">
            <LandingPageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={landingPageData}
                isLoading={isLoadingLP}
                originalAd={selectedAd}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Generic Ad Column */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h3 className="text-lg font-semibold text-gray-400 mb-4 text-center tracking-wider uppercase text-xs">Baseline: Generic</h3>
                    <AdCard variant={generic} accentColor="gray" />
                </motion.div>


                {/* Personalized Ads Column */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-400 mb-4 text-center tracking-wider uppercase text-xs">Outcome: Personalized (Click to Expand)</h3>
                    {personalized.map((ad, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.2 }}
                            onClick={() => handleAdClick(ad)}
                            className="cursor-pointer"
                        >
                            <AdCard variant={ad} accentColor={idx === 0 ? "gold" : "gold-muted"} isRecommended={idx === 0} />
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
}

function AdCard({ variant, accentColor, isRecommended }: { variant: AdVariant, accentColor: string, isRecommended?: boolean }) {
    const borderColors: Record<string, string> = {
        gray: "border-white/10 hover:border-white/20",
        gold: "border-primary/50 hover:border-primary group-hover:shadow-[0_0_20px_rgba(255,215,0,0.2)]",
        "gold-muted": "border-primary/30 hover:border-primary/50"
    };

    const bgColors: Record<string, string> = {
        gray: "bg-white/5",
        gold: "bg-primary/10",
        "gold-muted": "bg-primary/5"
    };

    return (
        <Card className={`relative overflow-hidden border ${borderColors[accentColor]} ${bgColors[accentColor]} backdrop-blur-sm transition-all duration-300 group h-full`}>
            {isRecommended && (
                <div className="absolute top-0 right-0 bg-primary text-black text-[10px] uppercase font-bold px-2 py-1 rounded-bl-lg shadow-[0_0_10px_rgba(255,215,0,0.3)] z-10">
                    Top Match
                </div>
            )}

            {/* Click to expand hint overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 pointer-events-none">
                <span className="text-white text-xs uppercase tracking-widest font-bold border border-white/30 px-3 py-1 rounded-full backdrop-blur-md">
                    Click to Generate Page
                </span>
            </div>

            <CardContent className="p-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{variant.type}</span>
                        <h4 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                            {variant.headline}
                        </h4>
                    </div>

                    <p className="text-sm text-gray-300 leading-relaxed">
                        {variant.body}
                    </p>

                    <button className={`w-full py-2 rounded-md text-sm font-bold transition-all duration-300 ${accentColor === 'gray' ? 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10' : 'bg-primary text-black hover:bg-white hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] border border-transparent'}`}>
                        {variant.call_to_action}
                    </button>

                    <div className="pt-4 mt-4 border-t border-white/5">
                        <p className="text-xs text-muted-foreground italic">
                            <span className="font-semibold text-gray-500 not-italic">Why this ad? </span>
                            {variant.rationale}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
