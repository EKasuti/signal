'use client';

import React from 'react';
import Link from 'next/link';
import { useCampaigns } from '../hooks/useCampaigns';

export default function Dashboard() {
  const { campaigns, loading } = useCampaigns();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Signal
          </h1>
          <div className="flex gap-4 text-sm font-medium">
            <Link href="/" className="text-gray-900">Campaigns</Link>
            <Link href="/users" className="text-gray-500 hover:text-gray-900 transition">Users</Link>
          </div>
        </div>

        <Link href="/campaigns/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + New Campaign
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-12">
        <header className="mb-12">
          <h2 className="text-3xl font-bold mb-2">Campaign Dashboard</h2>
          <p className="text-gray-500">Manage your generated video ads.</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {campaigns.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-400 mb-4">No campaigns found.</p>
                <Link href="/campaigns/new" className="text-blue-600 hover:underline">
                  Create your first campaign &rarr;
                </Link>
              </div>
            ) : (
              <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">User Persona</th>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Created</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {campaigns.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-gray-500">#{c.id}</td>
                        <td className="px-6 py-4 font-medium">{c.user?.name || "Unknown"}</td>
                        <td className="px-6 py-4">{c.product?.name || "Unknown"}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.status === 'completed' ? 'bg-green-100 text-green-800' :
                            c.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {new Date(c.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/campaigns/${c.id}`}
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
