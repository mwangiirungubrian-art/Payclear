"use client";

import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CheckoutPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/intasend-inlinejs-sdk@4.0.5/build/intasend-inline.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      new (window as any).IntaSend({
        publicAPIKey: "ISPubKey_test_b77c9031-302c-4e7a-a36f-ec47c2ebb5ca",
        live: false,
      })
        .on("COMPLETE", (results: any) => {
          window.location.href = "/checkout/success";
        })
        .on("FAILED", (results: any) => {
          console.log("Payment failed", results);
        })
        .on("IN-PROGRESS", () => {
          console.log("Payment in progress");
        });
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <section className="bg-blue-50 px-6 py-14 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Post a Job</h1>
        <p className="mt-3 text-gray-500 text-lg">One payment. 30 days of visibility. Salary shown always.</p>
        <p className="mt-4 text-sm text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-blue-700 font-medium hover:underline">Log in</a>
          {" "}to manage your listings after posting.
          {" "}New here?{" "}
          <a href="/login" className="text-blue-700 font-medium hover:underline">Create a free account</a>.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">

        {/* Single Listings */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Single Job Listings</h2>
        <p className="text-gray-500 text-sm mb-8">Perfect for companies hiring occasionally</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">

          {/* Standard */}
          <div className="border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Standard Listing</h3>
            <p className="text-gray-500 text-sm mb-6">Your job posted for 30 days</p>
            <p className="text-5xl font-bold text-blue-700 mb-1">KES 1,500</p>
            <p className="text-gray-400 text-sm mb-8">one-time · 30 days</p>
            <ul className="text-left text-gray-600 text-sm space-y-3 mb-8">
              <li>✅ Listed for 30 days</li>
              <li>✅ Salary range displayed prominently</li>
              <li>✅ Searchable by job seekers</li>
              <li>✅ Direct applications to your email</li>
              <li>✅ Pay via M-Pesa or Card</li>
            </ul>
            <button
              className="intaSendPayButton w-full bg-blue-700 text-white py-4 rounded-full text-lg font-semibold hover:bg-blue-800 transition"
              data-amount="1500"
              data-currency="KES"
              data-email="employer@payclear.com"
              data-api_ref="standard-listing"
            >
              Pay KES 1,500 → Post Job
            </button>
          </div>

          {/* Featured */}
          <div className="border border-blue-300 rounded-2xl p-8 text-center shadow-sm bg-blue-50">
            <div className="inline-block bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">⭐ FEATURED</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Featured Listing</h3>
            <p className="text-gray-500 text-sm mb-6">Top placement for maximum visibility</p>
            <p className="text-5xl font-bold text-blue-700 mb-1">KES 5,000</p>
            <p className="text-gray-400 text-sm mb-8">one-time · 30 days · top placement</p>
            <ul className="text-left text-gray-600 text-sm space-y-3 mb-8">
              <li>✅ Everything in Standard</li>
              <li>✅ Featured badge on listing</li>
              <li>✅ Top of search results</li>
              <li>✅ Highlighted on jobs page</li>
              <li>✅ 3x more visibility</li>
            </ul>
            <button
              className="intaSendPayButton w-full bg-blue-700 text-white py-4 rounded-full text-lg font-semibold hover:bg-blue-800 transition"
              data-amount="5000"
              data-currency="KES"
              data-email="employer@payclear.com"
              data-api_ref="featured-listing"
            >
              Pay KES 5,000 → Featured Post
            </button>
          </div>

        </div>

        {/* Subscription Plans */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Plans</h2>
        <p className="text-gray-500 text-sm mb-8">For companies hiring regularly — better value, more features</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

          {/* Growth */}
          <div className="border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Growth</h3>
            <p className="text-gray-500 text-sm mb-6">For growing teams</p>
            <p className="text-4xl font-bold text-blue-700 mb-1">KES 9,999</p>
            <p className="text-gray-400 text-sm mb-8">per month</p>
            <ul className="text-left text-gray-600 text-sm space-y-3 mb-8">
              <li>✅ 5 job posts per month</li>
              <li>✅ 1 featured listing included</li>
              <li>✅ Employer dashboard</li>
              <li>✅ Basic salary insights</li>
              <li>✅ Email support</li>
            </ul>
            <button
              className="intaSendPayButton w-full bg-blue-700 text-white py-4 rounded-full text-lg font-semibold hover:bg-blue-800 transition"
              data-amount="9999"
              data-currency="KES"
              data-email="employer@payclear.com"
              data-api_ref="growth-plan"
            >
              Start Growth Plan
            </button>
          </div>

          {/* Pro */}
          <div className="border border-blue-300 rounded-2xl p-8 text-center shadow-sm bg-blue-50 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-semibold px-4 py-1 rounded-full">MOST POPULAR</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
            <p className="text-gray-500 text-sm mb-6">For active recruiters</p>
            <p className="text-4xl font-bold text-blue-700 mb-1">KES 24,999</p>
            <p className="text-gray-400 text-sm mb-8">per month</p>
            <ul className="text-left text-gray-600 text-sm space-y-3 mb-8">
              <li>✅ 20 job posts per month</li>
              <li>✅ 5 featured listings included</li>
              <li>✅ Advanced salary insights</li>
              <li>✅ Priority support</li>
              <li>✅ Company profile page</li>
              <li>✅ Applicant tracking</li>
            </ul>
            <button
              className="intaSendPayButton w-full bg-blue-700 text-white py-4 rounded-full text-lg font-semibold hover:bg-blue-800 transition"
              data-amount="24999"
              data-currency="KES"
              data-email="employer@payclear.com"
              data-api_ref="pro-plan"
            >
              Start Pro Plan
            </button>
          </div>

          {/* Enterprise */}
          <div className="border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
            <p className="text-gray-500 text-sm mb-6">For large organisations</p>
            <p className="text-4xl font-bold text-blue-700 mb-1">KES 79,999</p>
            <p className="text-gray-400 text-sm mb-8">per year</p>
            <ul className="text-left text-gray-600 text-sm space-y-3 mb-8">
              <li>✅ Unlimited job posts</li>
              <li>✅ All listings featured</li>
              <li>✅ Full salary insights access</li>
              <li>✅ Dedicated account manager</li>
              <li>✅ Custom company branding</li>
              <li>✅ API access to salary data</li>
            </ul>
            <button
              className="intaSendPayButton w-full bg-blue-700 text-white py-4 rounded-full text-lg font-semibold hover:bg-blue-800 transition"
              data-amount="79999"
              data-currency="KES"
              data-email="employer@payclear.com"
              data-api_ref="enterprise-plan"
            >
              Start Enterprise Plan
            </button>
          </div>

        </div>

        {/* Contact for Enterprise */}
        <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Need a custom plan?</h3>
          <p className="text-gray-500 text-sm mb-4">Large team or unique requirements? Let's talk and build something that works for you.</p>
          <a href="mailto:hello@payclear.com" className="bg-blue-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-800 text-sm">
            Contact Us →
          </a>
        </div>

      </section>

      <Footer />
    </div>
  );
}