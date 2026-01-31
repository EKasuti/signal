'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usersApi } from '../../../api/users';
import { productsApi } from '../../../api/products';
import { campaignsApi } from '../../../api/campaigns';
import { uploadsApi } from '../../../api/uploads';

export default function NewCampaign() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: User, 2: Product, 3: Review/Generate

    const [userData, setUserData] = useState({
        name: '',
        age: '',
        location: '',
        gender: 'Female',
        occupation: '',
        values: '',
        bio: ''
    });

    const [productData, setProductData] = useState({
        name: '',
        description: '',
        features: '',
        image_url: ''
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        try {
            const file = e.target.files[0];
            const data = await uploadsApi.uploadFile(file);
            setProductData(prev => ({ ...prev, image_url: data.url }));
        } catch (err) {
            console.error(err);
            alert('Failed to upload image');
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // 1. Create User with Expanded Data
            const userPayload = {
                name: userData.name,
                demographics: {
                    age_range: userData.age, // Keeping simple as string for now implies age range
                    gender_identity: userData.gender,
                    country: userData.location, // Mapping location to country/region broadly
                    location_type: "Urban" // Defaulting for demo
                },
                lifestyle: {
                    occupation: userData.occupation || "Unspecified",
                    tech_savviness: "average"
                },
                psychographics: {
                    values: userData.values.split(',').map(v => v.trim()).filter(Boolean)
                }
            };

            const user = await usersApi.create(userPayload);

            // 2. Create Product
            const product = await productsApi.create({
                ...productData,
                features: productData.features.split(',').map(f => f.trim())
            });

            // 3. Create Campaign
            const campaign = await campaignsApi.create({
                user_id: user.id,
                product_id: product.id,
                status: 'pending',
                objective: 'awareness', // Default
                platform: 'instagram',
                duration_seconds: 15
            });

            // 4. Trigger Generation
            await campaignsApi.generate(campaign.id);

            router.push('/');
        } catch (error) {
            console.error(error);
            alert('Error creating campaign. Check console.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {step === 1 && "Target Persona"}
                        {step === 2 && "Product Details"}
                        {step === 3 && "Ready to Launch?"}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Step {step} of 3
                    </p>
                </div>

                <div className="space-y-6">
                    {step === 1 && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                                    value={userData.name}
                                    onChange={e => setUserData({ ...userData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Age Range</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 25-34"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                                        value={userData.age}
                                        onChange={e => setUserData({ ...userData, age: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                                    <select
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                                        value={userData.gender}
                                        onChange={e => setUserData({ ...userData, gender: e.target.value })}
                                    >
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                        <option value="Non-binary">Non-binary</option>
                                        <option value="All">All</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Location (Country/City)</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                                    value={userData.location}
                                    onChange={e => setUserData({ ...userData, location: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Occupation</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                                    value={userData.occupation}
                                    onChange={e => setUserData({ ...userData, occupation: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Values / Interests (comma separated)</label>
                                <textarea
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                                    rows={2}
                                    placeholder="Sustainability, Innovation, Family"
                                    value={userData.values}
                                    onChange={e => setUserData({ ...userData, values: e.target.value })}
                                />
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Next: Product
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                                    value={productData.name}
                                    onChange={e => setProductData({ ...productData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                                    rows={3}
                                    value={productData.description}
                                    onChange={e => setProductData({ ...productData, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Key Features (comma separated)</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                                    value={productData.features}
                                    onChange={e => setProductData({ ...productData, features: e.target.value })}
                                    placeholder="e.g. Fast, Durable, Eco-friendly"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Product Image</label>
                                {productData.image_url && (
                                    <img src={productData.image_url} alt="Preview" className="mb-2 h-32 w-auto object-cover rounded-md border" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="w-1/3 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    className="w-2/3 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Review
                                </button>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-2">
                                <p><strong>User:</strong> {userData.name} ({userData.age})</p>
                                <p><strong>Occupation:</strong> {userData.occupation}</p>
                                <p><strong>Product:</strong> {productData.name}</p>
                                <p><strong>Goal:</strong> Generate Sora Video Prompts</p>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            >
                                {loading ? 'Generating Agentic Ads...' : 'Generate Campaign'}
                            </button>
                            <button
                                onClick={() => setStep(2)}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-gray-500 hover:text-gray-700"
                            >
                                Edit Details
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
