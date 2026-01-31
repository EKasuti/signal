'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface User {
    id: number;
    name: string;
    demographics?: { age_range: string, gender_identity: string, country: string };
    created_at: string;
}

export default function UsersList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/users')
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Ad Agentic Admin
                    </h1>
                    <div className="flex gap-4 text-sm font-medium">
                        <Link href="/" className="text-gray-500 hover:text-gray-900 transition">Campaigns</Link>
                        <Link href="/users" className="text-gray-900">Users</Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-8 py-12">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">User Profiles</h2>
                        <p className="text-gray-500">Manage target audience personas and detailed psychographics.</p>
                    </div>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Demographics</th>
                                    <th className="px-6 py-4">Created</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-gray-500">#{u.id}</td>
                                        <td className="px-6 py-4 font-medium">{u.name}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {u.demographics ? (
                                                <span>{u.demographics.age_range}, {u.demographics.gender_identity}, {u.demographics.country}</span>
                                            ) : (
                                                <span className="text-gray-400 italic">No detailed data</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/users/${u.id}`}
                                                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                            >
                                                Edit Profile
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {users.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-gray-400">No users found.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
