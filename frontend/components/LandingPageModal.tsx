"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LandingPage, AdVariant } from "@/lib/types";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LandingPageModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: LandingPage | null;
    isLoading: boolean;
    originalAd: AdVariant | null;
}

export default function LandingPageModal({ isOpen, onClose, data, isLoading, originalAd }: LandingPageModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl bg-black border-primary/20 text-white overflow-hidden p-0 gap-0">
                {isLoading ? (
                    <div className="h-96 flex flex-col items-center justify-center p-8 space-y-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-white rounded-full animate-spin" />
                        <p className="text-gray-400 animate-pulse text-center">
                            Generating personalized landing page experience...<br />
                            <span className="text-xs text-primary/70">Aligning tone with "{originalAd?.headline}"</span>
                        </p>
                    </div>
                ) : data && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col h-full max-h-[85vh] overflow-y-auto"
                    >
                        {/* Simulation Header */}
                        <div className="bg-white/5 p-3 border-b border-white/10 flex justify-between items-center text-xs text-muted-foreground uppercase tracking-widest sticky top-0 backdrop-blur-md z-10">
                            <span>Simulated Landing Page</span>
                            <Badge variant="outline" className="border-primary/30 text-primary">Conversion Optimized</Badge>
                        </div>

                        {/* Landing Page Content */}
                        <div className="p-8 space-y-12">

                            {/* Hero Section */}
                            <div className="text-center space-y-6">
                                <motion.h1
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-primary via-white to-primary/50"
                                >
                                    {data.headline}
                                </motion.h1>
                                <p className="text-xl text-gray-300 max-w-xl mx-auto leading-relaxed">
                                    {data.hero_subtext}
                                </p>
                                <Button className="bg-primary text-black hover:bg-white hover:text-black font-bold text-lg px-8 py-6 rounded-full shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all">
                                    {data.call_to_action}
                                </Button>
                            </div>

                            <hr className="border-white/10" />

                            {/* Benefits Section */}
                            <div className="grid md:grid-cols-3 gap-6">
                                {data.key_benefits.map((benefit, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 + 0.3 }}
                                        className="bg-white/5 p-6 rounded-xl border border-white/5 hover:border-primary/30 transition-colors"
                                    >
                                        <div className="h-2 w-12 bg-primary/50 rounded-full mb-4" />
                                        <p className="text-md font-medium text-gray-200">{benefit}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* AI Explanation Footer */}
                            <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 mt-8">
                                <p className="text-xs text-primary/70 mb-1 font-mono uppercase">Agentic Reasoning</p>
                                <p className="text-sm text-gray-400 italic">
                                    {data.tone_match_explanation}
                                </p>
                            </div>
                        </div>

                    </motion.div>
                )}
            </DialogContent>
        </Dialog>
    );
}
