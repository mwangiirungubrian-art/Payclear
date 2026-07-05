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
      </section>

      <section className="max-w-xl mx-auto px-6 py-16">

        <div className="border border-gray-200 rounded-2xl p-8 text-center shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Standard Listing</h2>
          <p className="text-gray-500 mb-6">Your job posted for 30 days with full salary transparency</p>
          <p className="text-5xl font-bold text-blue-700 mb-2">KES 1,500</p>
          <p className="text-gray-400 text-sm mb-8">per listing · 30 days</p>
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

        <div className="border border-blue-200 rounded-2xl p-8 text-center shadow-sm bg-blue-50">
          <div className="inline-block bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">FEATURED</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Listing</h2>
          <p className="text-gray-500 mb-6">Top placement on the jobs page for maximum visibility</p>
          <p className="text-5xl font-bold text-blue-700 mb-2">KES 5,000</p>
          <p className="text-gray-400 text-sm mb-8">per listing · 30 days · top placement</p>
          <ul className="text-left text-gray-600 text-sm space-y-3 mb-8">
            <li>✅ Everything in Standard</li>
            <li>✅ Featured badge on listing</li>
            <li>✅ Top of search results</li>
            <li>✅ Highlighted in blue on jobs page</li>
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

      </section>

      <Footer />
    </div>
  );
}