"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function MLBBCheckID() {
  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [playerInfo, setPlayerInfo] = useState<{ name: string; id: string; zone: string } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPlayerInfo(null);

    if (!userId || !zoneId) {
      setError("Please enter both User ID and Zone ID");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/mlbb/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, zoneId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err?.error || 'Failed to check ID');
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setPlayerInfo({ name: data.name, id: data.id, zone: data.zone });
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-pink-300 to-pink-200">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:underline mb-8">
          ← Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">MLBB ID Checker</h1>
          <p className="text-gray-600">Verify your Mobile Legends: Bang Bang account</p>
        </div>

        {/* Main Card */}
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8">
          <div className="mb-6">
            <Image
              src="https://ext.same-assets.com/1882033060/2194953753.jpeg"
              alt="Mobile Legends"
              width={600}
              height={300}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>

          <form onSubmit={handleCheck} className="space-y-6">
            <div>
              <label htmlFor="userId" className="block text-sm font-semibold text-gray-700 mb-2">
                User ID
              </label>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-3 border-2 border-pink-300 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                placeholder="Enter your User ID"
              />
            </div>

            <div>
              <label htmlFor="zoneId" className="block text-sm font-semibold text-gray-700 mb-2">
                Zone ID
              </label>
              <input
                type="text"
                id="zoneId"
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                className="w-full px-4 py-3 border-2 border-pink-300 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                placeholder="Enter your Zone ID"
              />
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {playerInfo && (
              <div className="bg-green-100 border-2 border-green-400 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-green-800">Player Found!</h3>
                <div className="space-y-1 text-green-700">
                  <p><strong>Username:</strong> {playerInfo.name}</p>
                  <p><strong>User ID:</strong> {playerInfo.id}</p>
                  <p><strong>Zone ID:</strong> {playerInfo.zone}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Checking..." : "Check ID"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>How to find your ID:</strong> Open Mobile Legends, tap your profile icon, and you'll see your User ID and Zone ID below your username.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
