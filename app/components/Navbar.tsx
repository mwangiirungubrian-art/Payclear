"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white">
      <div className="flex items-center gap-1">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M18 2 L32 7 L32 20 Q32 30 18 35 Q4 30 4 20 L4 7 Z" fill="#185FA5"/>
          <polyline points="11,18 16,24 26,12" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="28" cy="8" r="5" fill="#1D9E75"/>
        </svg>
        <a href="/" className="text-2xl font-semibold">
          <span className="text-blue-700">Pay</span>
          <span className="text-gray-900">Clear</span>
        </a>
      </div>
      <div className="hidden md:flex items-center gap-8">
        <a href="/jobs" className="text-gray-500 hover:text-blue-700 font-medium text-sm">Browse Jobs</a>
        <a href="/insights" className="text-gray-500 hover:text-blue-700 font-medium text-sm">Salary Insights</a>
        {user ? (
          <>
            <a href="/dashboard" className="text-gray-500 hover:text-blue-700 font-medium text-sm">My Dashboard</a>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 font-medium text-sm">Log Out</button>
            <a href="/checkout" className="bg-blue-700 text-white px-5 py-2 rounded-full font-medium text-sm hover:bg-blue-800">Post a Job</a>
          </>
        ) : (
          <>
            <a href="/login" className="text-gray-500 hover:text-blue-700 font-medium text-sm">Employer Login</a>
            <a href="/checkout" className="bg-blue-700 text-white px-5 py-2 rounded-full font-medium text-sm hover:bg-blue-800">Post a Job</a>
          </>
        )}
      </div>
    </nav>
  );
}