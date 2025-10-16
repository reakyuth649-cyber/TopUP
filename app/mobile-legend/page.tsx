"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const diamondPackages = [
  { diamonds: 50, price: "$1.00", bonus: "" },
  { diamonds: 100, price: "$2.00", bonus: "+10 bonus" },
  { diamonds: 250, price: "$5.00", bonus: "+25 bonus" },
  { diamonds: 500, price: "$9.50", bonus: "+50 bonus" },
  { diamonds: 1000, price: "$18.00", bonus: "+150 bonus" },
  { diamonds: 2000, price: "$35.00", bonus: "+350 bonus" },
  { diamonds: 5000, price: "$85.00", bonus: "+1000 bonus" },
];

export default function MobileLegend() {
  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalUsd, setTotalUsd] = useState<number | null>(null);
  const [khqrTotal, setKhqrTotal] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sending, setSending] = useState(false);
  const qrFolder = '/khqr'; // public/khqr (move files there)
  const qrPrices = ['1.00','2.00','5.00','9.50','18.00','35.00','85.00'];
  const [verifying, setVerifying] = useState(false);
  const [verifiedName, setVerifiedName] = useState<string | null>(null);
  const [verifiedCountry, setVerifiedCountry] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !zoneId || selectedPackage === null || !paymentMethod) {
      alert("Please fill in all fields");
      return;
    }

    // Only allow purchase if verification already succeeded
    if (!verifiedName) {
      alert('Please verify the User ID and Zone ID before purchasing.');
      return;
    }

  // open confirmation modal instead of sending immediately
  setShowConfirm(true);
  };

  const confirmOrder = async () => {
    if (selectedPackage === null) return;
    const pkg = diamondPackages[selectedPackage];
    const pkgLabel = `${pkg.diamonds} Diamonds`;
    const usd = parseFloat(pkg.price.replace(/[^0-9.]/g, '')) || 0;
    const rate = 4100;
    const kh = Math.round(usd * rate);
    setSending(true);
    try {
      await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: 'MLBB', username: verifiedName, userId, zoneId, packageLabel: pkgLabel, paymentMethod, priceUsd: usd, priceKhqr: kh })
      });
      // Close modal and reset sending state
      setShowConfirm(false);
      setSending(false);
      // Show a success message
      alert('Order confirmed and sent.');
    } catch (err) {
      setSending(false);
      alert('Failed to send order.');
    }
  };

  const handleVerify = async () => {
    if (!userId || !zoneId) {
      setVerifyError('Please enter both User ID and Zone ID');
      return;
    }
    setVerifyError(null);
    setVerifiedName(null);
    setVerifiedCountry(null);
    setVerifying(true);
    try {
      const res = await fetch('/api/mlbb/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, zoneId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setVerifyError(err?.error || 'Failed to verify ID');
        setVerifying(false);
        return;
      }

      const data = await res.json();
      if (data.error) {
        setVerifyError(data.error);
        setVerifying(false);
        return;
      }

      setVerifiedName(data.name || null);
      setVerifiedCountry(data.country || null);
      setVerifying(false);
    } catch (err) {
      setVerifyError('Network error');
      setVerifying(false);
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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Mobile Legends: Bang Bang</h1>
          <p className="text-gray-600">Top up your diamonds instantly</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Game Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden sticky top-8">
                <Image
                  src="https://ext.same-assets.com/1882033060/2768638069.png"
                  alt="Mobile Legends"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">How to Top Up</h2>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    <li>Enter your User ID and Zone ID</li>
                    <li>Select diamond package</li>
                    <li>Choose payment method</li>
                    <li>Complete payment</li>
                    <li>Diamonds credited instantly!</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Right Column - Top Up Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handlePurchase} className="space-y-6">
                {/* Account Info */}
                <div className="bg-white rounded-xl shadow-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">1. Enter Account Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
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
                        placeholder="Enter User ID"
                        required
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
                        placeholder="Enter Zone ID"
                        required
                      />
                    </div>
                  </div>
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleVerify}
                        disabled={verifying}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {verifying ? 'Verifying...' : 'Verify ID'}
                      </button>
                      {verifiedName && <div className="text-sm text-green-700">Verified: {verifiedName}</div>}
                    </div>
                  {/* Verification status */}
                  <div className="mt-4">
                    {verifying && (
                      <div className="text-sm text-gray-700">Verifying User ID and Zone ID...</div>
                    )}
                    {verifyError && (
                      <div className="mt-2 bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg">{verifyError}</div>
                    )}
                    {verifiedName && (
                      <div className="mt-2 bg-green-100 border-2 border-green-400 text-green-700 px-4 py-3 rounded-lg">
                        <div className="font-semibold">Verified:</div>
                        <div className="text-sm">Username: {verifiedName}</div>
                        {verifiedCountry && <div className="text-sm">Country: {verifiedCountry}</div>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Diamond Packages */}
                <div className="bg-white rounded-xl shadow-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">2. Select Diamond Package</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {diamondPackages.map((pkg, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => { setSelectedPackage(index); const p = parseFloat(pkg.price.replace(/[^0-9.]/g, '')) || 0; setTotalUsd(p); setKhqrTotal(Math.round(p * 4100)); }}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          selectedPackage === index
                            ? "border-pink-500 bg-pink-50 shadow-lg scale-105"
                            : "border-gray-300 hover:border-pink-300"
                        }`}
                      >
                        <div className="text-2xl font-bold text-gray-800">{pkg.diamonds}</div>
                        <div className="text-sm text-gray-600">Diamonds</div>
                        {pkg.bonus && <div className="text-xs text-green-600 font-semibold mt-1">{pkg.bonus}</div>}
                        <div className="text-lg font-bold text-pink-600 mt-2">{pkg.price}</div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4">
                    {totalUsd !== null && (
                      <div className="text-sm text-gray-700">
                        <span className="font-semibold">Total:</span> ${totalUsd.toFixed(2)} {khqrTotal !== null && (<span className="ml-3 font-semibold">KHQR: ៛{khqrTotal}</span>)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl shadow-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">3. Select Payment Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-pink-300 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="KHQR"
                        checked={paymentMethod === "KHQR"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <span className="flex-1 font-semibold">KHQR</span>
                      <div className="bg-red-600 px-3 py-1 rounded text-white text-sm font-bold">KHQR</div>
                    </label>
                    {/* <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-pink-300 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="Bank Transfer"
                        checked={paymentMethod === "Bank Transfer"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <span className="flex-1 font-semibold">Bank Transfer</span>
                    </label>
                    <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-pink-300 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="E-Wallet"
                        checked={paymentMethod === "E-Wallet"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <span className="flex-1 font-semibold">E-Wallet</span>
                    </label> */}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 text-lg"
                >
                  Purchase Now
                </button>
              </form>
              {/* Confirmation Modal */}
              {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h3 className="text-lg font-bold mb-4">Confirm Purchase</h3>
                    <div className="mb-4 text-sm text-gray-700">
                      <div><span className="font-semibold">Package:</span> {selectedPackage !== null ? `${diamondPackages[selectedPackage].diamonds} Diamonds` : '-'}</div>
                      <div><span className="font-semibold">USD:</span> {totalUsd !== null ? `$${totalUsd.toFixed(2)}` : '-'}</div>
                      <div><span className="font-semibold">KHQR:</span> {khqrTotal !== null ? `៛${Math.round(khqrTotal)}` : '-'}</div>
                      <div><span className="font-semibold">Payment:</span> {paymentMethod || '-'}</div>
                    </div>
                    {/* Show KHQR QR image when USD price matches available images */}
                    {totalUsd !== null && qrPrices.includes(totalUsd.toFixed(2)) && (
                      <div className="mb-4 flex items-center justify-center">
                        <img src={`${qrFolder}/${totalUsd.toFixed(2)}.png`} alt="KHQR" width={260} height={260} style={{ maxWidth: '100%', height: 'auto' }} />
                      </div>
                    )}
                    <div className="flex justify-end gap-3">
                      <button className="px-4 py-2 rounded border" onClick={() => setShowConfirm(false)} disabled={sending}>Cancel</button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={confirmOrder} disabled={sending}>{sending ? 'Sending...' : 'Confirm'}</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
