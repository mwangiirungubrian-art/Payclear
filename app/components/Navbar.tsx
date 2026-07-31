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
      <div className="flex items-center gap-2">
        <svg width="36" height="36" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="55" r="14" fill="#2196F3" opacity="0.3" stroke="#2196F3" strokeWidth="2"/>
          <circle cx="40" cy="38" r="10" fill="#2196F3" opacity="0.3" stroke="#2196F3" strokeWidth="2"/>
          <circle cx="22" cy="58" r="11" fill="none" stroke="#2196F3" strokeWidth="2.5"/>
          <circle cx="22" cy="43" r="7" fill="none" stroke="#2196F3" strokeWidth="2.5"/>
          <circle cx="58" cy="58" r="11" fill="none" stroke="#2196F3" strokeWidth="2.5"/>
          <circle cx="58" cy="43" r="7" fill="none" stroke="#2196F3" strokeWidth="2.5"/>
          <circle cx="40" cy="55" r="14" fill="#2196F3"/>
          <circle cx="40" cy="36" r="10" fill="#2196F3"/>
          <circle cx="52" cy="18" r="8" fill="#4CAF50"/>
          <circle cx="52" cy="18" r="5" fill="#81C784"/>
        </svg>
        <a href="/" className="text-2xl font-semibold">
          <span className="text-gray-900">lura</span>
          <span className="text-blue-500">vo</span>
        </a>
      </div>
      <div className="hidden md:flex items-center gap-8">
        <a href="/jobs" className="text-gray-500 hover:text-blue-600 font-medium text-sm">Browse Jobs</a>
        <a href="/insights" className="text-gray-500 hover:text-blue-600 font-medium text-sm">Salary Insights</a>
        {user ? (
          <>
            <a href="/dashboard" className="text-gray-500 hover:text-blue-600 font-medium text-sm">My Dashboard</a>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 font-medium text-sm">Log Out</button>
            <a href="/checkout" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium text-sm hover:bg-blue-700">Post a Job</a>
          </>
        ) : (
          <>
            <a href="/login" className="text-gray-500 hover:text-blue-600 font-medium text-sm">Employer Login</a>
            <a href="/checkout" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium text-sm hover:bg-blue-700">Post a Job</a>
          </>
        )}
      </div>
    </nav>
  );
}