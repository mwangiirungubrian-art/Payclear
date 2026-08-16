"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function SuccessPage() {
  const [step, setStep] = useState<"saving" | "account" | "done">("saving");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState("standard-listing");

  useEffect(() => {
    const savePlan = async () => {
      const params = new URLSearchParams(window.location.search);
      const planParam = params.get("plan") || "standard-listing";
      setPlan(planParam);

      const { data: { user } } = await supabase.auth.getUser();

      let posts_remaining = 1;
      let featured_remaining = 0;
      let days = 30;

      if (planParam === "featured-listing") { posts_remaining = 1; featured_remaining = 1; }
      else if (planParam === "growth-plan") { posts_remaining = 5; featured_remaining = 1; days = 30; }
      else if (planParam === "pro-plan") { posts_remaining = 20; featured_remaining = 5; days = 30; }
      else if (planParam === "enterprise-plan") { posts_remaining = 999; featured_remaining = 999; days = 365; }

      const userEmail = user?.email || "";
      const isSinglePost = planParam === "standard-listing" || planParam === "featured-listing";

      if (userEmail && !isSinglePost) {
        // Logged in + subscription plan = save subscription
        await supabase.from("subscriptions").insert([{
          email: userEmail,
          plan: planParam,
          posts_remaining,
          featured_remaining,
          expires_at: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
        }]);
        setStep("done");
      } else if (isSinglePost) {
        // Single post = no account needed
        setStep("done");
      } else {
        // Not logged in + subscription plan = create account
        setStep("account");
      }
    };

    savePlan();
  }, []);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    let posts_remaining = 1;
    let featured_remaining = 0;
    let days = 30;

    if (plan === "featured-listing") { posts_remaining = 1; featured_remaining = 1; }
    else if (plan === "growth-plan") { posts_remaining = 5; featured_remaining = 1; days = 30; }
    else if (plan === "pro-plan") { posts_remaining = 20; featured_remaining = 5; days = 30; }
    else if (plan === "enterprise-plan") { posts_remaining = 999; featured_remaining = 999; days = 365; }

    await supabase.from("subscriptions").insert([{
      email,
      plan,
      posts_remaining,
      featured_remaining,
      expires_at: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
    }]);

    setLoading(false);
    setStep("done");
  };

  if (step === "saving") {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
        <Navbar />
        <div className="flex flex-col items-center justify-center flex-1 py-20 text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-500">Confirming your payment...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (step === "account") {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
        <Navbar />
        <div className="flex flex-col items-center justify-center flex-1 py-20 px-6">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
              <p className="text-gray-500">Create your account to access your dashboard and start posting jobs.</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>
            )}

            <form onSubmit={handleCreateAccount} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Work Email *</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Create Password *</label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create Account & Continue →"}
              </button>
            </form>

            <p className="text-center text-gray-400 text-xs mt-6">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">Log in instead</a>
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-1 py-20 px-6 text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">You're all set!</h1>
        <p className="text-gray-500 text-lg max-w-md mb-10">
          Your account is ready. Start posting jobs and managing your listings from your dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="/post-job" className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700">
            Post Your First Job →
          </a>
          <a href="/dashboard" className="border border-gray-200 text-gray-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50">
            Go to Dashboard
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}