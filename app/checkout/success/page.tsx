"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function SuccessPage() {
  const [saving, setSaving] = useState(true);

  useEffect(() => {
    const savePlan = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const params = new URLSearchParams(window.location.search);
      const plan = params.get("plan") || "standard-listing";

      let posts_remaining = 1;
      let featured_remaining = 0;
      let days = 30;

      if (plan === "featured-listing") {
        posts_remaining = 1;
        featured_remaining = 1;
      } else if (plan === "growth-plan") {
        posts_remaining = 5;
        featured_remaining = 1;
        days = 30;
      } else if (plan === "pro-plan") {
        posts_remaining = 20;
        featured_remaining = 5;
        days = 30;
      } else if (plan === "enterprise-plan") {
        posts_remaining = 999;
        featured_remaining = 999;
        days = 365;
      }

      const email = user?.email || params.get("email") || "";

      if (email) {
        await supabase.from("subscriptions").insert([{
          email,
          plan,
          posts_remaining,
          featured_remaining,
          expires_at: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
        }]);
      }

      setSaving(false);
    };

    savePlan();
  }, []);

  if (saving) {
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

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-1 py-20 px-6 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        <p className="text-gray-500 text-lg max-w-md mb-4">
          Your payment has been received. You can now post your job on Luravo.
        </p>
        <p className="text-gray-400 text-sm mb-10">
          You will receive a confirmation email shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="/post-job" className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700">
            Post Your Job Now
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