"use client";

import { BehavioralProfile } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress"; // Need to install Progress if not already done, or build custom

// Simple custom progress if not installed, or I'll install it later. 
// For now, I'll build a simple one to be safe and dependency-free for this component.
function SimpleProgress({ value, colorClass }: { value: number; colorClass: string }) {
    return (
        <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
            <div
                className={`h-full ${colorClass}`}
                style={{ width: `${value * 100}%` }}
            />
        </div>
    )
}

export default function ProfileVisualizer({ profile }: { profile: BehavioralProfile }) {
    return (
        <Card className="border-white/10 bg-black">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <span className="text-primary">◆</span> Inferred Behavioral Profile
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Top Level Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Decision Style</p>
                        <p className="text-xl font-bold mt-1 text-primary">{profile.decision_style}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Tone Preference</p>
                        <p className="text-xl font-bold mt-1 text-primary">{profile.preferred_tone}</p>
                    </div>
                </div>

                {/* Drivers */}
                <div className="space-y-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Motivational Drivers</p>
                    {profile.motivational_drivers.map((driver) => (
                        <div key={driver.name} className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span>{driver.name}</span>
                                <span className="text-gray-400">{Math.round(driver.score * 100)}%</span>
                            </div>
                            <SimpleProgress value={driver.score} colorClass="bg-primary shadow-[0_0_10px_rgba(255,215,0,0.4)]" />
                        </div>
                    ))}
                </div>

                {/* Constraints */}
                <div className="space-y-3 pt-2 border-t border-white/5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Ethical Constraints Applied</p>
                    <div className="flex flex-wrap gap-2">
                        {profile.emotional_triggers_disallowed.map(trigger => (
                            <Badge key={trigger} variant="destructive" className="bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20">
                                Forbidden: {trigger}
                            </Badge>
                        ))}
                        {profile.sensitive_exclusions.map(excl => (
                            <Badge key={excl} variant="outline" className="border-gray-700 text-gray-500">
                                Excluded: {excl}
                            </Badge>
                        ))}
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
