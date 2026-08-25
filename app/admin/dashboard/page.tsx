"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminDashboardPage() {
  const [admin, setAdmin] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/admin"; return; }

      const { data: adminData } = await supabase
        .from("admins")
        .select("*")
        .eq("email", user.email)
        .limit(1);

      if (!adminData || adminData.length === 0) {
        window.location.href = "/admin";
        return;
      }

      setAdmin(adminData[0]);

      const { data: jobsData } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: subsData } = await supabase
        .from("subscriptions")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: contactsData } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (jobsData) setJobs(jobsData);
      if (subsData) setSubscriptions(subsData);
      if (contactsData) setContacts(contactsData);

      setLoading(false);
    };

    init();
  }, []);

  const handleDeleteJob = async (id: number) => {
    if (!confirm("Delete this job?")) return;
    await supabase.from("jobs").delete().eq("id", id);
    setJobs(jobs.filter((j) => j.id !== id));
  };

  const handleFeatureJob = async (id: number, featured: boolean) => {
    await supabase.from("jobs").update({ featured: !featured }).eq("id", id);
    setJobs(jobs.map((j) => j.id === id ? { ...j, featured: !featured } : j));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin";
  };

  const getPlanLabel = (plan: string) => {
    if (plan === "standard-listing") return "Standard";
    if (plan === "featured-listing") return "Featured";
    if (plan === "growth-plan") return "Growth";
    if (plan === "pro-plan") return "Pro";
    if (plan === "enterprise-plan") return "Enterprise";
    return plan;
  };

  const getPlanColor = (plan: string) => {
    if (plan === "enterprise-plan") return "bg-purple-100 text-purple-700";
    if (plan === "pro-plan") return "bg-blue-100 text-blue-700";
    if (plan === "growth-plan") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const totalRevenue = subscriptions.reduce((sum, sub) => {
    if (sub.plan === "standard-listing") return sum + 1500;
    if (sub.plan === "featured-listing") return sum + 5000;
    if (sub.plan === "growth-plan") return sum + 9999;
    if (sub.plan === "pro-plan") return sum + 24999;
    if (sub.plan === "enterprise-plan") return sum + 79999;
    return sum;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-950 font-sans">

      {/* Admin Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L20 7V12C20 16.4 16.4 20.4 12 22C7.6 20.4 4 16.4 4 12V7L12 2Z" fill="white"/>
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-sm">Luravo Admin</p>
            <p className="text-gray-500 text-xs">{admin?.role === "super_admin" ? "Super Admin" : "Support"} · {admin?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 text-sm transition">
          Sign Out
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-500 text-xs mb-1">Total Jobs</p>
            <p className="text-white text-3xl font-bold">{jobs.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-500 text-xs mb-1">Subscriptions</p>
            <p className="text-white text-3xl font-bold">{subscriptions.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-500 text-xs mb-1">Contact Requests</p>
            <p className="text-white text-3xl font-bold">{contacts.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-500 text-xs mb-1">Est. Revenue</p>
            <p className="text-green-400 text-3xl font-bold">KES {totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-800 pb-4">
          {["overview", "jobs", "subscriptions", "contacts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${activeTab === tab ? "bg-blue-600 text-white" : "text-gray-500 hover:text-white"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-white text-xl font-bold mb-2">All Jobs ({jobs.length})</h2>
            {jobs.map((job) => (
              <div key={job.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-semibold">{job.title}</p>
                      {job.featured && <span className="bg-blue-900 text-blue-300 text-xs px-2 py-0.5 rounded-full">⭐ Featured</span>}
                    </div>
                    <p className="text-gray-500 text-sm">{job.company} · {job.location}</p>
                    <p className="text-green-400 text-sm mt-1">
                      {job.salary_type === "fixed"
                        ? `KES ${job.salary_min?.toLocaleString()} fixed`
                        : `KES ${job.salary_min?.toLocaleString()} – ${job.salary_max?.toLocaleString()}`}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">{job.contact_email}</p>
                  </div>
                  <div className="flex flex-col gap-2 text-right">
                    <button
                      onClick={() => handleFeatureJob(job.id, job.featured)}
                      className={`text-xs font-medium hover:underline ${job.featured ? "text-orange-400" : "text-green-400"}`}
                    >
                      {job.featured ? "Remove Featured" : "⭐ Make Featured"}
                    </button>
                    {admin?.role === "super_admin" && (
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="text-red-500 text-xs font-medium hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === "subscriptions" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-white text-xl font-bold mb-2">All Subscriptions ({subscriptions.length})</h2>
            {subscriptions.map((sub) => (
              <div key={sub.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{sub.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getPlanColor(sub.plan)}`}>
                        {getPlanLabel(sub.plan)}
                      </span>
                      <span className="text-gray-500 text-xs">
                        Expires: {new Date(sub.expires_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-6 text-center">
                    <div>
                      <p className="text-blue-400 font-bold text-xl">{sub.posts_remaining}</p>
                      <p className="text-gray-600 text-xs">Posts left</p>
                    </div>
                    <div>
                      <p className="text-green-400 font-bold text-xl">{sub.featured_remaining}</p>
                      <p className="text-gray-600 text-xs">Featured left</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === "contacts" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-white text-xl font-bold mb-2">Contact Requests ({contacts.length})</h2>
            {contacts.map((contact) => (
              <div key={contact.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-semibold">{contact.name} · {contact.company}</p>
                    <p className="text-blue-400 text-sm mt-1">{contact.email}</p>
                    <p className="text-gray-500 text-xs mt-1">Team size: {contact.team_size}</p>
                    <p className="text-gray-400 text-sm mt-2 max-w-lg">{contact.message}</p>
                  </div>
                  <p className="text-gray-600 text-xs">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <h2 className="text-white text-xl font-bold mb-6">Recent Activity</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Recent Jobs */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Latest Jobs</h3>
                <div className="flex flex-col gap-3">
                  {jobs.slice(0, 5).map((job) => (
                    <div key={job.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm font-medium">{job.title}</p>
                        <p className="text-gray-500 text-xs">{job.company}</p>
                      </div>
                      <span className="text-green-400 text-xs">
                        KES {job.salary_max?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Subscriptions */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Latest Subscriptions</h3>
                <div className="flex flex-col gap-3">
                  {subscriptions.slice(0, 5).map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm font-medium">{sub.email}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getPlanColor(sub.plan)}`}>
                          {getPlanLabel(sub.plan)}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}