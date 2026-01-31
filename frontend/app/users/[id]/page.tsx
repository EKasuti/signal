'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { usersApi } from '../../../api/users'; // Adjusted import path

export default function EditUser() {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await usersApi.getById(Number(params.id));
                // Ensure all subsections exist to prevent crashes
                if (!data.demographics) data.demographics = {};
                if (!data.psychographics) data.psychographics = {};
                if (!data.lifestyle) data.lifestyle = {};
                if (!data.media_preferences) data.media_preferences = {};
                setUser(data);
            } catch (err) {
                console.error("Failed to fetch user", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [params.id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Clone user to avoid mutating state directly during data prep
            const cleanUser = JSON.parse(JSON.stringify(user));

            // Helper to clean array inputs
            const cleanArray = (val: any) => {
                if (Array.isArray(val)) return val;
                if (typeof val === 'string') return val.split(',').map((s: string) => s.trim()).filter(Boolean);
                return [];
            };

            if (cleanUser.psychographics) {
                cleanUser.psychographics.values = cleanArray(cleanUser.psychographics.values);
                cleanUser.psychographics.motivations = cleanArray(cleanUser.psychographics.motivations);
            }
            if (cleanUser.lifestyle) {
                cleanUser.lifestyle.hobbies = cleanArray(cleanUser.lifestyle.hobbies);
                cleanUser.lifestyle.daily_environments = cleanArray(cleanUser.lifestyle.daily_environments);
            }
            if (cleanUser.media_preferences) {
                cleanUser.media_preferences.preferred_platforms = cleanArray(cleanUser.media_preferences.preferred_platforms);
            }

            const updated = await usersApi.update(Number(params.id), cleanUser);

            // Re-apply null checks for the updated data
            if (!updated.demographics) updated.demographics = {};
            if (!updated.psychographics) updated.psychographics = {};
            if (!updated.lifestyle) updated.lifestyle = {};
            if (!updated.media_preferences) updated.media_preferences = {};

            setUser(updated);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Error updating user. Check console.");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (section: string, field: string, value: any) => {
        setUser((prev: any) => {
            if (section === 'root') {
                return { ...prev, [field]: value };
            }
            return {
                ...prev,
                [section]: {
                    ...prev[section] || {},
                    [field]: value
                }
            };
        });
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!user) return <div className="p-10 text-center">User not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/users" className="text-gray-500 hover:text-gray-900 transition flex items-center gap-1 font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back
                    </Link>
                    <div className="h-6 w-px bg-gray-200 mx-2"></div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 leading-tight">Editing: {user.name}</h1>
                        <p className="text-xs text-gray-500">ID: {user.id}</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-200"
                >
                    {saving ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </button>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">

                {/* 1. Core Identity & Demographics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-1 h-fit">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">👤</span> Identity
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                                <input
                                    type="text"
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition sm:text-sm p-2.5 bg-gray-50 focus:bg-white text-gray-900"
                                    value={user.name}
                                    onChange={e => handleChange('root', 'name', e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                            <span className="bg-green-100 text-green-600 p-1.5 rounded-lg">🌍</span> Demographics
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Age Range</label>
                                <input
                                    type="text"
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 text-gray-900"
                                    placeholder="e.g. 25-34"
                                    value={user.demographics.age_range || ''}
                                    onChange={e => handleChange('demographics', 'age_range', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Gender Identity</label>
                                <select
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 bg-white text-gray-900"
                                    value={user.demographics.gender_identity || ''}
                                    onChange={e => handleChange('demographics', 'gender_identity', e.target.value)}
                                >
                                    <option value="">Select...</option>
                                    <option value="Female">Female</option>
                                    <option value="Male">Male</option>
                                    <option value="Non-binary">Non-binary</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Country</label>
                                <input
                                    type="text"
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 text-gray-900"
                                    value={user.demographics.country || ''}
                                    onChange={e => handleChange('demographics', 'country', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Location Type</label>
                                <select
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 bg-white"
                                    value={user.demographics.location_type || ''}
                                    onChange={e => handleChange('demographics', 'location_type', e.target.value)}
                                >
                                    <option value="">Select...</option>
                                    <option value="Urban">Urban</option>
                                    <option value="Suburban">Suburban</option>
                                    <option value="Rural">Rural</option>
                                </select>
                            </div>
                        </div>
                    </section>
                </div>

                {/* 2. Psychographics */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                        <span className="bg-purple-100 text-purple-600 p-1.5 rounded-lg">🧠</span> Psychographics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Values</label>
                                <p className="text-xs text-gray-400 mb-1">Comma-separated (e.g., "Sustainability, Family, Growth")</p>
                                <textarea
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 text-gray-900"
                                    rows={3}
                                    value={Array.isArray(user.psychographics.values) ? user.psychographics.values.join(', ') : user.psychographics.values || ''}
                                    onChange={e => handleChange('psychographics', 'values', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Motivations</label>
                                <textarea
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 text-gray-900"
                                    rows={3}
                                    value={Array.isArray(user.psychographics.motivations) ? user.psychographics.motivations.join(', ') : user.psychographics.motivations || ''}
                                    onChange={e => handleChange('psychographics', 'motivations', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Risk Tolerance (1-10)</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        value={user.psychographics.risk_tolerance || 5}
                                        onChange={e => handleChange('psychographics', 'risk_tolerance', parseInt(e.target.value))}
                                    />
                                    <span className="text-lg font-bold w-8 text-center">{user.psychographics.risk_tolerance || 5}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Decision Style</label>
                                <input
                                    type="text"
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 text-gray-900"
                                    placeholder="e.g. Analytical, Impulsive"
                                    value={user.psychographics.decision_making_style || ''}
                                    onChange={e => handleChange('psychographics', 'decision_making_style', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Lifestyle & Media - Two Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                            <span className="bg-orange-100 text-orange-600 p-1.5 rounded-lg">💼</span> Lifestyle
                        </h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Occupation</label>
                                    <input
                                        type="text"
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 text-gray-900"
                                        value={user.lifestyle.occupation || ''}
                                        onChange={e => handleChange('lifestyle', 'occupation', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tech Savviness</label>
                                    <select
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 bg-white"
                                        value={user.lifestyle.tech_savviness || ''}
                                        onChange={e => handleChange('lifestyle', 'tech_savviness', e.target.value)}
                                    >
                                        <option value="average">Average</option>
                                        <option value="low">Low</option>
                                        <option value="high">High</option>
                                        <option value="expert">Expert</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Hobbies (Comma separated)</label>
                                <input
                                    type="text"
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 text-gray-900"
                                    value={Array.isArray(user.lifestyle.hobbies) ? user.lifestyle.hobbies.join(', ') : user.lifestyle.hobbies || ''}
                                    onChange={e => handleChange('lifestyle', 'hobbies', e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                            <span className="bg-pink-100 text-pink-600 p-1.5 rounded-lg">🎨</span> Media & Aesthetics
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Visual Style Preference</label>
                                <input
                                    type="text"
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 text-gray-900"
                                    value={user.media_preferences.visual_visual_style || ''}
                                    onChange={e => handleChange('media_preferences', 'visual_visual_style', e.target.value)}
                                    placeholder="e.g. Cinematic, Minimalist"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Preferred Platforms</label>
                                <input
                                    type="text"
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 text-gray-900"
                                    value={Array.isArray(user.media_preferences.preferred_platforms) ? user.media_preferences.preferred_platforms.join(', ') : user.media_preferences.preferred_platforms || ''}
                                    onChange={e => handleChange('media_preferences', 'preferred_platforms', e.target.value)}
                                    placeholder="e.g. Instagram, TikTok"
                                />
                            </div>
                        </div>
                    </section>
                </div>

            </main>
        </div>
    );
}
