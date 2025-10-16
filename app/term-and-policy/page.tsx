import Link from "next/link";

export default function TermsAndPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-pink-300 to-pink-200">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:underline mb-8">
          ← Back to Home
        </Link>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Privacy Policy & Terms and Conditions</h1>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Privacy Policy</h2>
              <div className="space-y-4">
                <p>
                  At Lisa Topup, we are committed to protecting your privacy and ensuring the security of your personal information.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mt-6">Information We Collect</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Game account information (User ID, Zone ID)</li>
                  <li>Contact information (email, phone number)</li>
                  <li>Payment transaction details</li>
                  <li>Device and browser information</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mt-6">How We Use Your Information</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>To process your top-up transactions</li>
                  <li>To verify your game account</li>
                  <li>To send transaction confirmations</li>
                  <li>To improve our services</li>
                  <li>To prevent fraud and ensure security</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mt-6">Data Security</h3>
                <p>
                  We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or misuse.
                </p>
              </div>
            </section>

            <section className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Terms and Conditions</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">1. Service Agreement</h3>
                <p>
                  By using Lisa Topup services, you agree to these terms and conditions. Please read them carefully before making any purchase.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mt-6">2. Account Verification</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You must provide accurate User ID and Zone ID</li>
                  <li>Incorrect information may result in failed transactions</li>
                  <li>We are not responsible for errors in account information you provide</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mt-6">3. Payment and Delivery</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All prices are in USD unless stated otherwise</li>
                  <li>Diamonds/credits are delivered instantly or within 5-30 minutes</li>
                  <li>Delivery delays may occur during server maintenance</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mt-6">4. Refund Policy</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Refunds are only available if diamonds/credits were not delivered</li>
                  <li>No refunds for wrong account information provided by customer</li>
                  <li>Refund requests must be made within 24 hours of purchase</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mt-6">5. Prohibited Activities</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Using stolen payment methods</li>
                  <li>Fraudulent transactions or chargebacks</li>
                  <li>Sharing account credentials</li>
                  <li>Reselling our services without authorization</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mt-6">6. Limitation of Liability</h3>
                <p>
                  Lisa Topup is not affiliated with game developers. We are an authorized reseller. We are not responsible for game bans, account suspensions, or game-related issues.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mt-6">7. Changes to Terms</h3>
                <p>
                  We reserve the right to modify these terms at any time. Continued use of our service constitutes acceptance of updated terms.
                </p>
              </div>
            </section>

            <section className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
              <p>
                If you have any questions about our Privacy Policy or Terms and Conditions, please contact us through our social media channels or contact form.
              </p>
              <Link href="/contact" className="inline-block mt-4 text-pink-600 font-semibold hover:underline">
                Contact Support →
              </Link>
            </section>

            <div className="border-t pt-8 text-sm text-gray-500">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              <p className="mt-2">© {new Date().getFullYear()} Lisa Topup. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
