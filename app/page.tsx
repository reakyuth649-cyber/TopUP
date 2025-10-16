"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const games = [
  {
    title: "Mobile Legend",
    image: "https://ext.same-assets.com/1882033060/2768638069.png",
    href: "/mobile-legend",
  },
  {
    title: "MLBB Check ID",
    image: "https://ext.same-assets.com/1882033060/2768638069.png",
    href: "/mlbb-checkid",
  },
  // {
  //   title: "MLBB Check ID",
  //   image: "https://ext.same-assets.com/1882033060/2194953753.jpeg",
  //   href: "/mlbb-checkid",
  // },
  // {
  //   title: "MLBB PH",
  //   image: "https://ext.same-assets.com/1882033060/1309883904.jpeg",
  //   href: "/mobile-legend-ph",
  // },
  // {
  //   title: "Free Fire",
  //   image: "https://ext.same-assets.com/1882033060/2359428848.jpeg",
  //   href: "/free-fire",
  // },
  // {
  //   title: "Blood Strike",
  //   image: "https://ext.same-assets.com/1882033060/3440809230.jpeg",
  //   href: "/blood-strike",
  // },
  // {
  //   title: "Pubg Mobile",
  //   image: "https://ext.same-assets.com/1882033060/1368228667.jpeg",
  //   href: "/pubg-mobile",
  // },
  // {
  //   title: "MLBB MY",
  //   image: "https://ext.same-assets.com/1882033060/2625626487.jpeg",
  //   href: "/mobile-legend-my",
  // },
  // {
  //   title: "MLBB Indo",
  //   image: "https://ext.same-assets.com/1882033060/3572801944.jpeg",
  //   href: "/mobile-legend-indo",
  // },
  // {
  //   title: "Honor Of Kings",
  //   image: "https://ext.same-assets.com/1882033060/1135947858.jpeg",
  //   href: "/honor-of-kings",
  // },
  // {
  //   title: "Magic Chess",
  //   image: "https://ext.same-assets.com/1882033060/2961462879.jpeg",
  //   href: "/magic-chest-gogo",
  // },
  // {
  //   title: "Zepeto",
  //   image: "https://ext.same-assets.com/1882033060/2961462879.jpeg",
  //   href: "/zepeto",
  // },
  // {
  //   title: "Genshin Impact",
  //   image: "https://ext.same-assets.com/1882033060/1135947858.jpeg",
  //   href: "/genshin-impact",
  // },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-pink-300 to-pink-200">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 right-4 z-50 md:hidden bg-pink-400 p-3 rounded-lg shadow-lg hover:bg-pink-500 transition-colors"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-0.5 bg-white mb-1.5"></div>
        <div className="w-6 h-0.5 bg-white mb-1.5"></div>
        <div className="w-6 h-0.5 bg-white"></div>
      </button>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-64 bg-pink-300 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <nav className="flex flex-col gap-4 mt-16">
              <Link href="/" className="text-lg font-semibold text-blue-700 hover:underline" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/mlbb-checkid" className="text-lg font-semibold text-blue-700 hover:underline" onClick={() => setMobileMenuOpen(false)}>
                Check MLBB ID
              </Link>
              <Link href="/contact" className="text-lg font-semibold text-blue-700 hover:underline" onClick={() => setMobileMenuOpen(false)}>
                Contact Us
              </Link>
              <Link href="/term-and-policy" className="text-lg font-semibold text-blue-700 hover:underline" onClick={() => setMobileMenuOpen(false)}>
                Terms & Policy
              </Link>
            </nav>
            <div className="flex gap-4 mt-8">
              <Link href="https://www.facebook.com" target="_blank">
                <Image src="https://ext.same-assets.com/1882033060/3764551927.svg" alt="Facebook" width={32} height={32} />
              </Link>
              <Link href="https://t.me" target="_blank">
                <Image src="https://ext.same-assets.com/1882033060/3815843100.svg" alt="Telegram" width={32} height={32} />
              </Link>
              <Link href="https://www.tiktok.com" target="_blank">
                <Image src="https://ext.same-assets.com/1882033060/3576954176.svg" alt="TikTok" width={32} height={32} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header/Hero Section */}
      <header className="relative flex flex-col items-center pt-8 pb-8">
        {/* Logo Circle with Actual Mascot Image */}
        <div className="relative w-[90vw] max-w-[500px] aspect-square mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-pink-400 to-pink-500 rounded-full"></div>
          <div className="absolute inset-4 md:inset-8 bg-gradient-to-br from-pink-200 to-pink-400 rounded-full overflow-hidden flex items-center justify-center">
            <Image
              src="https://ext.same-assets.com/1882033060/2961462879.jpeg"
              alt="Reak Topup Mascot"
              width={450}
              height={450}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>

        {/* Navigation Links - Hidden on mobile */}
        <nav className="hidden md:flex gap-6 mb-4">
          <Link href="/" className="text-blue-700 font-semibold hover:underline">Home</Link>
          <Link href="/mlbb-checkid" className="text-blue-700 font-semibold hover:underline">Check MLBB ID</Link>
          <Link href="/contact" className="text-blue-700 font-semibold hover:underline">Contact Us</Link>
        </nav>

        {/* Social Icons */}
        <div className="flex gap-4">
          <Link href="https://www.facebook.com" target="_blank" className="hover:opacity-80 transition-opacity">
            <Image src="https://ext.same-assets.com/1882033060/3764551927.svg" alt="Facebook" width={32} height={32} />
          </Link>
          <Link href="https://t.me" target="_blank" className="hover:opacity-80 transition-opacity">
            <Image src="https://ext.same-assets.com/1882033060/3815843100.svg" alt="Telegram" width={32} height={32} />
          </Link>
          <Link href="https://www.tiktok.com" target="_blank" className="hover:opacity-80 transition-opacity">
            <Image src="https://ext.same-assets.com/1882033060/3576954176.svg" alt="TikTok" width={32} height={32} />
          </Link>
        </div>
      </header>

      {/* Main Content - Game Grid */}
      <main className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {games.map((game, index) => (
            <Link
              key={index}
              href={game.href}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-xl font-bold drop-shadow-lg">{game.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-pink-300 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-center text-lg font-semibold mb-4">Contact Us:</h3>

          <div className="flex justify-center gap-6 mb-8">
            <Link href="https://www.facebook.com" target="_blank" className="w-10 h-10">
              <Image src="https://ext.same-assets.com/1882033060/3764551927.svg" alt="Facebook" width={40} height={40} />
            </Link>
            <Link href="https://t.me" target="_blank" className="w-10 h-10">
              <Image src="https://ext.same-assets.com/1882033060/3815843100.svg" alt="Telegram" width={40} height={40} />
            </Link>
            <Link href="https://www.tiktok.com" target="_blank" className="w-10 h-10">
              <Image src="https://ext.same-assets.com/1882033060/3576954176.svg" alt="TikTok" width={40} height={40} />
            </Link>
          </div>

          <div className="text-center space-y-2 text-sm">
            <Link href="/term-and-policy" className="text-blue-700 hover:underline block">
              Privacy Policy | Terms and Condition
            </Link>
            <p>Copyright Reak Topup. All Rights Reserved.</p>
          </div>

          <div className="mt-8 text-center">
            <p className="mb-4">Accept Payment:</p>
            <div className="flex justify-center">
              <div className="bg-red-600 rounded-2xl px-12 py-6">
                <div className="text-white text-4xl font-bold">KHQR</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
