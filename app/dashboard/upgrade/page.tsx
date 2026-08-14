import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-1 py-20 px-6 text-center">
        <div className="text-6xl mb-6">🔒</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard Access Requires a Plan</h1>
        <p className="text-gray-500 text-lg max-w-lg mb-4">
          The employer dashboard is available on Growth, Pro and Enterprise plans. Single job postings don't include dashboard access.
        </p>
        <p className="text-gray-400 text-sm mb-10 max-w-md">
          Upgrade to a subscription plan to manage all your listings, track applications and access salary insights.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="/checkout#growth" className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700">
            View Plans →
          </a>
          <a href="/jobs" className="border border-gray-200 text-gray-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50">
            Browse Jobs
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}