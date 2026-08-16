"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUser(user);

      const { data: subData } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("email", user.email)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!subData || subData.length === 0) {
        window.location.href = "/dashboard/upgrade";
        return;
      }

      setSubscription(subData[0]);

      const { data: jobData } = await supabase
        .from("jobs")
        .select("*")
        .eq("contact_email", user.email)
        .order("created_at", { ascending: false });

      if (jobData) setJobs(jobData);
      setLoading(false);
    };

    getUser();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    await supabase.from("jobs").delete().eq("id", id);
    setJobs(jobs.filter((job) => job.id !== id));
  };

  const handleFeature = async (id: number) => {
    if (!subscription || subscription.featured_remaining <= 0) return;
    await supabase.from("jobs").update({ featured: true }).eq("id", id);
    await supabase
      .from("subscriptions")
      .update({ featured_remaining: subscription.featured_remaining - 1 })
      .eq("id", subscription.id);
    setJobs(jobs.map((job) => job.id === id ? { ...job, featured: true } : job));
    setSubscription({ ...subscription, featured_remaining: subscription.featured_remaining - 1 });
  };

  const handleUnfeature = async (id: number) => {
    await supabase.from("jobs").update({ featured: false }).eq("id", id);
    await supabase
      .from("subscriptions")
      .update({ featured_remaining: subscription.featured_remaining + 1 })
      .eq("id", subscription.id);
    setJobs(jobs.map((job) => job.id === id ? { ...job, featured: false } : job));
    setSubscription({ ...subscription, featured_remaining: subscription.featured_remaining + 1 });
  };

  const getPlanLabel = (plan: string) => {
    if (plan === "standard-listing") return "Standard Listing";
    if (plan === "featured-listing") return "Featured Listing";
    if (plan === "growth-plan") return "Growth Plan";
    if (plan === "pro-plan") return "Pro Plan";
    if (plan === "enterprise-plan") return "Enterprise Plan";
    return plan;
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

        {/* Subscription Status */}
        {subscription && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-blue-600 font-semibold mb-1">Active Plan</p>
                <p className="text-2xl font-bold text-gray-900">{getPlanLabel(subscription.plan)}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Expires: {new Date(subscription.expires_at).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              <div className="flex gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-blue-600">{subscription.posts_remaining}</p>
                  <p className="text-gray-500 text-xs mt-1">Posts remaining</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600">{subscription.featured_remaining}</p>
                  <p className="text-gray-500 text-xs mt-1">Featured remaining</p>
                </div>
              </div>
              <a href="/post-job" className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-blue-700">
                Post a Job →
              </a>
            </div>
          </div>
        )}

        {/* Job Listings */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Your Job Listings</h2>
          {subscription && subscription.posts_remaining > 0 ? (
            <a href="/post-job" className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700">
              + Post New Job
            </a>
          ) : (
            <a href="/checkout" className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700">
              + Buy More Posts
            </a>
          )}
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-20 border border-gray-100 rounded-2xl">
            <p className="text-gray-400 text-lg mb-4">No jobs posted yet</p>
            <a href="/post-job" className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700">
              Post Your First Job →
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {jobs.map((job) => (
              <div key={job.id} className={`border rounded-2xl p-6 ${job.featured ? "border-blue-300 bg-blue-50" : "border-gray-200"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      {job.featured && (
                        <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">⭐ Featured</span>
                      )}
                    </div>
                    <p className="text-gray-500 mt-1">{job.company} · {job.location}</p>
                    <div className="flex gap-2 mt-3">
                      <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">{job.level}</span>
                      <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">{job.type}</span>
                    </div>
                    <p className="text-green-600 font-bold mt-3">
                      {job.salary_type === "fixed"
                        ? `KES ${job.salary_min.toLocaleString()} fixed`
                        : `KES ${job.salary_min.toLocaleString()} – ${job.salary_max.toLocaleString()}`}
                      <span className="text-gray-400 text-sm font-normal ml-1">/ month</span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 text-right">
                    <a href={`/jobs/${job.id}`} className="text-blue-600 text-sm font-medium hover:underline">
                      View listing
                    </a>
                    {!job.featured && subscription && subscription.featured_remaining > 0 && (
                      <button
                        onClick={() => handleFeature(job.id)}
                        className="text-green-600 text-sm font-medium hover:underline"
                      >
                        ⭐ Make Featured
                      </button>
                    )}
                    {job.featured && (
                      <button
                        onClick={() => handleUnfeature(job.id)}
                        className="text-orange-500 text-sm font-medium hover:underline"
                      >
                        Remove Featured
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="text-red-500 text-sm font-medium hover:underline"
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