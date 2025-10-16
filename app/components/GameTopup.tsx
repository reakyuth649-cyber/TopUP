"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Package {
  amount: number;
  price: string; // displayed price (e.g. "$1.20")
  // internal numericPrice will be parsed from price when needed
  bonus?: string;
}

interface GameTopupProps {
  gameName: string;
  gameImage: string;
  currency: string;
  packages: Package[];
  idLabel: string;
  hasZoneId?: boolean;
}

export default function GameTopup({ gameName, gameImage, currency, packages, idLabel, hasZoneId = true }: GameTopupProps) {
  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalPriceUsd, setTotalPriceUsd] = useState<number | null>(null);
  const [khqrPrice, setKhqrPrice] = useState<number | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifiedName, setVerifiedName] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifyDebug, setVerifyDebug] = useState<any | null>(null);
  const qrFolder = '/khqr';
  const qrPrices = ['1.00','2.00','5.00','9.50','18.00','35.00','85.00'];

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || (hasZoneId && !zoneId) || selectedPackage === null || !paymentMethod) {
      alert("Please fill in all fields");
      return;
    }

    if (!hasZoneId && !verifiedName) {
      alert('Please verify Player ID before purchasing');
      return;
    }

  const pkg = packages[selectedPackage];
  const pkgLabel = `${pkg.amount} ${currency}`;
  const usd = parseFloat(pkg.price.replace(/[^0-9.]/g, '')) || 0;
  const rate = 4100; // fixed KHR per USD rate (adjustable)
  const kh = Math.round(usd * rate);
  // Show confirmation including KHQR price if available
  alert(`Order placed!\n${idLabel}: ${userId}${hasZoneId ? `\nZone ID: ${zoneId}` : ''}\nPackage: ${pkgLabel}\nPayment: ${paymentMethod}\nUSD: $${usd.toFixed(2)}${kh ? `\nKHQR: ៛${kh}` : ''}`);

    // send order to server to forward to Telegram
    (async () => {
      try {
        await fetch('/api/orders/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ game: gameName, username: verifiedName, userId, zoneId: hasZoneId ? zoneId : null, packageLabel: pkgLabel, paymentMethod, priceUsd: usd, priceKhqr: kh })
        });
      } catch (err) {
        console.error('Failed to send order to server', err);
      }
    })();
  };

  // compute selected package prices when selection changes
  const computePrices = (index: number | null) => {
    if (index === null) { setTotalPriceUsd(null); setKhqrPrice(null); return; }
    const pkg = packages[index];
    const usd = parseFloat(pkg.price.replace(/[^0-9.]/g, '')) || 0;
    setTotalPriceUsd(usd);
    // Use a fixed conversion rate; can be replaced by live rate later
    const rate = 4100; // KHR per USD
    setKhqrPrice(usd * rate);
  };

  const handleVerify = async () => {
    if (!userId) {
      setVerifyError('Please enter Player ID');
      return;
    }
    setVerifyError(null);
    setVerifiedName(null);
    setVerifying(true);
    try {
      const res = await fetch('/api/garena/check', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) });
      const data = await res.json().catch(() => null);
      if (!res.ok || data?.error) {
        setVerifyError(data?.error || 'Failed to verify');
        setVerifyDebug(data?.attempts || data || null);
      } else {
        setVerifiedName(data.nickname || null);
        setVerifyDebug(null);
      }
    } catch (err) {
      setVerifyError('Network error');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-pink-300 to-pink-200">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:underline mb-8">
          ← Back to Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{gameName}</h1>
          <p className="text-gray-600">Top up your {currency} instantly</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden sticky top-8">
                <Image
                  src={gameImage}
                  alt={gameName}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">How to Top Up</h2>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    <li>Enter your {idLabel}{hasZoneId && ' and Zone ID'}</li>
                    <li>Select {currency} package</li>
                    <li>Choose payment method</li>
                    <li>Complete payment</li>
                    <li>{currency} credited instantly!</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <form onSubmit={handlePurchase} className="space-y-6">
                <div className="bg-white rounded-xl shadow-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">1. Enter Account Details</h3>
                  <div className={`grid ${hasZoneId ? 'md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
                    <div>
                      <label htmlFor="userId" className="block text-sm font-semibold text-gray-700 mb-2">
                        {idLabel}
                      </label>
                      <input
                        type="text"
                        id="userId"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-pink-300 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                        placeholder={`Enter ${idLabel}`}
                        required
                      />
                    </div>
                    {hasZoneId && (
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
                    )}
                  </div>
                  {!hasZoneId && (
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
                      {verifyError && <div className="text-sm text-red-700">{verifyError}</div>}
                      {verifyDebug && (
                        <div className="mt-2 text-xs text-gray-700 bg-gray-50 border border-gray-200 p-3 rounded">
                          <div className="font-semibold">Debug attempts:</div>
                          <pre className="whitespace-pre-wrap text-[12px] mt-1">{JSON.stringify(verifyDebug, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl shadow-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">2. Select {currency} Package</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {packages.map((pkg, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => { setSelectedPackage(index); computePrices(index); }}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          selectedPackage === index
                            ? "border-pink-500 bg-pink-50 shadow-lg scale-105"
                            : "border-gray-300 hover:border-pink-300"
                        }`}
                      >
                        <div className="text-2xl font-bold text-gray-800">{pkg.amount}</div>
                        <div className="text-sm text-gray-600">{currency}</div>
                        {pkg.bonus && <div className="text-xs text-green-600 font-semibold mt-1">{pkg.bonus}</div>}
                        <div className="text-lg font-bold text-pink-600 mt-2">{pkg.price}</div>
                      </button>
                    ))}
                  </div>
                  {/* Selected total */}
                  <div className="mt-4">
                    {totalPriceUsd !== null && (
                      <div className="text-sm text-gray-700">
                        <span className="font-semibold">Total:</span> ${totalPriceUsd.toFixed(2)} {khqrPrice !== null && (<span className="ml-3 font-semibold">KHQR: ៛{Math.round(khqrPrice)}</span>)}
                      </div>
                    )}
                    {totalPriceUsd !== null && qrPrices.includes(totalPriceUsd.toFixed(2)) && (
                      <div className="mt-3 flex items-center justify-center">
                        <img src={`${qrFolder}/${totalPriceUsd.toFixed(2)}.png`} alt="KHQR" width={220} height={220} style={{ maxWidth: '100%', height: 'auto' }} />
                      </div>
                    )}
                  </div>
                </div>

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
                    <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-pink-300 transition-colors">
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
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 text-lg"
                >
                  Purchase Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
