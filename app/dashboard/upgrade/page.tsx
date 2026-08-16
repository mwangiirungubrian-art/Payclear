import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-1 py-20 px-6 text-center">
        <div className="text-6xl mb-6">🚀</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose a Plan to Get Started</h1>
        <p className="text-gray-500 text-lg max-w-lg mb-10">
          Pick a plan below — your dashboard unlocks instantly after payment. No separate signup needed.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full mb-10">
          <a href="/checkout#growth" className="border border-gray-200 rounded-2xl p-6 text-left hover:shadow-md transition hover:border-blue-300">
            <p className="font-bold text-gray-900 mb-1">Growth</p>
            <p className="text-blue-600 font-bold text-2xl mb-2">KES 9,999<span className="text-gray-400 text-sm font-normal">/mo</span></p>
            <p className="text-gray-500 text-sm mb-4">5 job posts · 1 featured · Dashboard access</p>
            <span className="text-blue-600 text-sm font-semibold">Select Growth →</span>
          </a>
          <a href="/checkout#pro" className="border border-blue-300 rounded-2xl p-6 text-left bg-blue-50 hover:shadow-md transition">
            <div className="inline-block bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full mb-2">POPULAR</div>
            <p className="font-bold text-gray-900 mb-1">Pro</p>
            <p className="text-blue-600 font-bold text-2xl mb-2">KES 24,999<span className="text-gray-400 text-sm font-normal">/mo</span></p>
            <p className="text-gray-500 text-sm mb-4">20 job posts · 5 featured · Full insights</p>
            <span className="text-blue-600 text-sm font-semibold">Select Pro →</span>
          </a>
          <a href="/checkout#enterprise" className="border border-purple-200 rounded-2xl p-6 text-left bg-purple-50 hover:shadow-md transition">
            <p className="font-bold text-gray-900 mb-1">Enterprise</p>
            <p className="text-purple-600 font-bold text-2xl mb-2">KES 79,999<span className="text-gray-400 text-sm font-normal">/yr</span></p>
            <p className="text-gray-500 text-sm mb-4">Unlimited posts · All featured · PDF reports</p>
            <span className="text-purple-600 text-sm font-semibold">Select Enterprise →</span>
          </a>
        </div>

        <p className="text-gray-400 text-sm">
          Just need a single job post?{" "}
          <a href="/checkout#standard" className="text-blue-600 hover:underline">Post a single job →</a>
        </p>
      </div>

      <Footer />
    </div>
  );
}