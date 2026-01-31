'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { campaignsApi, Campaign } from '../../../api/campaigns'; // Adjusted path

export default function CampaignDetails() {
    const params = useParams();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const data = await campaignsApi.getById(Number(params.id));
                setCampaign(data);
            } catch (err: any) {
                console.error("Failed to fetch campaign", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [params.id]);

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!campaign) return <div className="p-10 text-center">Campaign not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center gap-4">
                <Link href="/" className="text-gray-500 hover:text-gray-900 transition">
                    &larr; Back to Dashboard
                </Link>
                <div className="h-4 w-px bg-gray-300"></div>
                <h1 className="text-xl font-bold text-gray-900">Campaign #{campaign.id}</h1>
            </nav>

            <main className="max-w-5xl mx-auto px-8 py-12 space-y-8">

                {/* Header Status */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Campaign Overview</h2>
                        <p className="text-gray-500 text-sm">Created on {new Date(campaign.created_at).toLocaleString()}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${campaign.status === 'completed' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {campaign.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Persona */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">User Persona</h3>
                            {/* Link to Edit User */}
                            <Link href={`/users/${campaign.user?.id}`} className="text-blue-600 text-sm hover:underline">
                                View Full Profile &rarr;
                            </Link>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <span className="block text-xs uppercase text-gray-400 font-semibold mb-1">Identity</span>
                                <div className="font-medium text-gray-900">{campaign.user?.name}</div>
                                <div className="text-gray-600">
                                    {/* Types need to be updated in campaign interface to handle this deeply, using optional chaining for safety */}
                                    {(campaign.user as any).demographics?.age_range || "Age N/A"} • {(campaign.user as any).demographics?.gender_identity || "Gender N/A"}
                                </div>
                                <div className="text-gray-600">{(campaign.user as any).demographics?.location_type || "Location N/A"}, {(campaign.user as any).demographics?.country || ""}</div>
                            </div>

                            <div className="p-3 bg-gray-50 rounded-lg">
                                <span className="block text-xs uppercase text-gray-400 font-semibold mb-1">Psychographics</span>
                                <div className="text-gray-700">
                                    <span className="font-medium">Values:</span> {(campaign.user as any).psychographics?.values?.join(", ") || "N/A"}
                                </div>
                                <div className="text-gray-700 mt-1">
                                    <span className="font-medium">Personality:</span> {JSON.stringify((campaign.user as any).psychographics?.personality_traits || {})}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Product Details</h3>
                        <div className="flex gap-4">
                            {(campaign.product as any).image_url && (
                                <img src={(campaign.product as any).image_url} alt="Product" className="w-24 h-24 object-cover rounded-lg border border-gray-100" />
                            )}
                            <div>
                                <div className="font-bold text-gray-900">{campaign.product?.name}</div>
                                <p className="text-gray-600 text-sm mt-1">{(campaign.product as any).description}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {(campaign.product as any).features?.map((f: string, i: number) => (
                                        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Creative Strategy */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Creative Strategy (Generated)</h3>
                    {campaign.creative_persona ? (
                        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl text-sm text-indigo-900 font-mono whitespace-pre-wrap overflow-x-auto">
                            {JSON.stringify(campaign.creative_persona, null, 2)}
                        </div>
                    ) : (
                        <div className="text-gray-400 italic">No creative strategy generated yet.</div>
                    )}
                </div>

                {/* Sora Prompt */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Final Sora Prompt</h3>
                    {campaign.sora_prompt ? (
                        <div className="bg-gray-900 text-gray-100 p-6 rounded-xl font-mono text-sm leading-relaxed shadow-inner">
                            {campaign.sora_prompt}
                        </div>
                    ) : (
                        <div className="text-gray-400 italic">No prompt generated yet.</div>
                    )}
                </div>
            </main>
        </div>
    );
}
