"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setMessage("Account created! Log in to continue.");
        setIsSignUp(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        window.location.href = "/dashboard";
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-1 py-20 px-6">
        <div className="w-full max-w-md">

          {!isSignUp ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Employer Login
              </h1>
              <p className="text-gray-500 text-center mb-8">
                Log in to manage your Luravo job listings
              </p>

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>
              )}
              {message && (
                <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl text-sm mb-4">{message}</div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                  {loading ? "Logging in..." : "Log In"}
                </button>
              </form>

              <div className="mt-8 p-6 bg-blue-50 rounded-2xl text-center">
                <p className="text-gray-700 font-semibold mb-2">Don't have an account yet?</p>
                <p className="text-gray-500 text-sm mb-4">Choose a plan first — your account is created as part of the signup process.</p>
                <a href="/checkout#growth" className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-blue-700">
                  View Plans →
                </a>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Create Your Account
              </h1>
              <p className="text-gray-500 text-center mb-8">
                Set up your Luravo employer account
              </p>

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>
              )}
              {message && (
                <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl text-sm mb-4">{message}</div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>

              <p className="text-center text-gray-500 text-sm mt-6">
                Already have an account?{" "}
                <button onClick={() => setIsSignUp(false)} className="text-blue-600 font-medium hover:underline">
                  Log in
                </button>
              </p>
            </>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}