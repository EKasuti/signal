import React from 'react';

interface Campaign {
    id: number;
    status: string;
    sora_prompt: string;
    creative_persona: any; // Using any for flexibility with the JSON structure
    created_at: string;
    user: { name: string; age: number; location: string; bio: string };
    product: { name: string; description: string; image_url: string };
}

interface Props {
    campaign: Campaign | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function CampaignDetailsModal({ campaign, isOpen, onClose }: Props) {
    if (!isOpen || !campaign) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                    <h3 className="text-xl font-bold text-gray-900">Campaign #{campaign.id} Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Status Badge */}
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${campaign.status === 'completed' ? 'bg-green-100 text-green-800' :
                            campaign.status === 'failed' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                            {campaign.status.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">{new Date(campaign.created_at).toLocaleString()}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* User Profile */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h4 className="font-semibold text-gray-700 mb-2 uppercase text-xs tracking-wider">User Persona</h4>
                            <div className="space-y-1 text-sm">
                                <p><span className="text-gray-500">Name:</span> {campaign.user?.name}</p>
                                <p><span className="text-gray-500">Age:</span> {campaign.user?.age || "N/A"}</p>
                                <p><span className="text-gray-500">Location:</span> {campaign.user?.location || "N/A"}</p>
                                <p><span className="text-gray-500">Bio:</span> {campaign.user?.bio || "N/A"}</p>
                            </div>
                        </div>

                        {/* Product Profile */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h4 className="font-semibold text-gray-700 mb-2 uppercase text-xs tracking-wider">Product</h4>
                            <div className="space-y-1 text-sm">
                                <p><span className="text-gray-500">Name:</span> {campaign.product?.name}</p>
                                <p><span className="text-gray-500">Desc:</span> {campaign.product?.description}</p>
                                {campaign.product?.image_url && (
                                    <img
                                        src={campaign.product.image_url}
                                        alt="Product"
                                        className="mt-2 h-24 w-auto object-cover rounded-lg border border-gray-200"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Creative Persona */}
                    {campaign.creative_persona && (
                        <div>
                            <h4 className="font-bold text-gray-900 mb-3 text-lg">Creative Persona Strategy</h4>
                            <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl text-sm text-indigo-900 h-64 overflow-y-auto font-mono whitespace-pre-wrap">
                                {JSON.stringify(campaign.creative_persona, null, 2)}
                            </div>
                        </div>
                    )}

                    {/* Generated Prompt */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-3 text-lg">Generated Sora Prompt</h4>
                        <div className="bg-gray-900 text-gray-100 p-5 rounded-xl font-mono text-sm leading-relaxed shadow-inner overflow-x-auto relative group">
                            {campaign.sora_prompt || "No prompt generated yet."}

                            {campaign.sora_prompt && (
                                <button
                                    onClick={() => navigator.clipboard.writeText(campaign.sora_prompt)}
                                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded text-xs"
                                >
                                    Copy
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end">
                    <button onClick={onClose} className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
