"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUser(user);

      const { data } = await supabase
        .from("jobs")
        .select("*")
        .eq("contact_email", user.email)
        .order("created_at", { ascending: false });

      if (data) setJobs(data);
      setLoading(false);
    };

    getUser();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    await supabase.from("jobs").delete().eq("id", id);
    setJobs(jobs.filter((job) => job.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <section className="bg-blue-50 px-6 py-14">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900">Employer Dashboard</h1>
          <p className="text-gray-500 mt-2">Welcome back, {user?.email}</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Your Job Listings</h2>
          <a href="/checkout" className="bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-800">
            + Post New Job
          </a>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-20 border border-gray-100 rounded-2xl">
            <p className="text-gray-400 text-lg mb-4">No jobs posted yet</p>
            <a href="/checkout" className="bg-blue-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-800">
              Post Your First Job →
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-gray-500 mt-1">{job.company} · {job.location}</p>
                    <div className="flex gap-2 mt-3">
                      <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">{job.level}</span>
                      <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">{job.type}</span>
                    </div>
                    <p className="text-green-600 font-bold mt-3">
                      KES {job.salary_min.toLocaleString()} – {job.salary_max.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a href={`/jobs/${job.id}`} className="text-blue-700 text-sm font-medium hover:underline text-right">
                      View listing
                    </a>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="text-red-500 text-sm font-medium hover:underline text-right"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}