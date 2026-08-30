"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function AdminDashboardPage() {
  const [admin, setAdmin] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("support");
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [notification, setNotification] = useState("");
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [expandedSub, setExpandedSub] = useState<number | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/admin"; return; }

      const { data: adminData } = await supabase
        .from("admins").select("*").eq("email", user.email).limit(1);

      if (!adminData || adminData.length === 0) {
        window.location.href = "/admin";
        return;
      }

      setAdmin(adminData[0]);

      const { data: jobsData } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
      const { data: subsData } = await supabase.from("subscriptions").select("*").order("created_at", { ascending: false });
      const { data: contactsData } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
      const { data: adminsData } = await supabase.from("admins").select("*").order("created_at", { ascending: false });

      if (jobsData) setJobs(jobsData);
      if (subsData) setSubscriptions(subsData);
      if (contactsData) setContacts(contactsData);
      if (adminsData) setAdmins(adminsData);
      setLoading(false);
    };

    init();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleDeleteJob = async (id: number) => {
    if (!confirm("Delete this job?")) return;
    await supabase.from("jobs").delete().eq("id", id);
    setJobs(jobs.filter((j: any) => j.id !== id));
    showNotification("Job deleted");
  };

  const handleFeatureJob = async (id: number, featured: boolean) => {
    await supabase.from("jobs").update({ featured: !featured }).eq("id", id);
    setJobs(jobs.map((j: any) => j.id === id ? { ...j, featured: !featured } : j));
    showNotification(featured ? "Featured removed" : "Job featured!");
  };

  const handleReply = (contact: any) => {
    setReplyingTo(contact);
    setReplyMessage(`Hi ${contact.name},\n\nThank you for reaching out to Luravo.\n\nWe have reviewed your inquiry and would love to discuss how Luravo can support ${contact.company}.\n\nBest regards,\nLuravo Team\nhello@luravo.com`);
  };

  const handleSendReply = () => {
    const subject = encodeURIComponent(`Re: Your Luravo Inquiry - ${replyingTo.company}`);
    const body = encodeURIComponent(replyMessage);
    window.location.href = `mailto:${replyingTo.email}?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setReplyingTo(null);
      setReplyMessage("");
      showNotification("Reply opened in email app!");
    }, 500);
  };

  const handleCopyReply = () => {
    navigator.clipboard.writeText(replyMessage);
    showNotification("Message copied!");
  };

  const handleGeneratePDF = async (sub: any) => {
    const { data: subJobs } = await supabase.from("jobs").select("*").eq("contact_email", sub.email);
    const avgSalary = subJobs && subJobs.length > 0
      ? Math.round(subJobs.reduce((sum: number, j: any) => sum + (j.salary_min + j.salary_max) / 2, 0) / subJobs.length)
      : 0;

    const content = `LURAVO SALARY BENCHMARKING REPORT
Generated: ${new Date().toLocaleDateString()}
Prepared for: ${sub.email}
Plan: ${getPlanLabel(sub.plan)}

SUMMARY
Total Jobs Posted: ${subJobs?.length || 0}
Average Salary: KES ${avgSalary.toLocaleString()} per month
Plan Expires: ${new Date(sub.expires_at).toLocaleDateString()}

YOUR JOB LISTINGS
${subJobs?.map((j: any, i: number) => `${i + 1}. ${j.title} - ${j.company}
   Location: ${j.location} | Level: ${j.level}
   Salary: ${j.salary_type === "fixed" ? `KES ${j.salary_min?.toLocaleString()} fixed` : `KES ${j.salary_min?.toLocaleString()} - KES ${j.salary_max?.toLocaleString()}`}
`).join("") || "No jobs posted yet"}

PLATFORM INSIGHTS
Total Jobs on Luravo: ${jobs.length}
Posts Remaining: ${sub.posts_remaining}
Featured Remaining: ${sub.featured_remaining}

luravo.com | hello@luravo.com
Every Job. Every Salary. No Exceptions.`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Luravo_Report_${sub.email.split("@")[0]}_${new Date().toLocaleDateString("en-KE").replace(/\//g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification("Report downloaded!");
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingAdmin(true);
    await supabase.from("admins").insert([{ email: newAdminEmail, role: newAdminRole }]);
    const { data } = await supabase.from("admins").select("*").order("created_at", { ascending: false });
    if (data) setAdmins(data);
    setNewAdminEmail("");
    setAddingAdmin(false);
    showNotification(`${newAdminEmail} added!`);
  };

  const handleRemoveAdmin = async (id: number, email: string) => {
    if (email === admin.email) { showNotification("Cannot remove yourself!"); return; }
    if (!confirm(`Remove ${email}?`)) return;
    await supabase.from("admins").delete().eq("id", id);
    setAdmins(admins.filter((a: any) => a.id !== id));
    showNotification("Admin removed");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin";
  };

  const getPlanLabel = (plan: string) => {
    const labels: Record<string, string> = {
      "standard-listing": "Standard",
      "featured-listing": "Featured",
      "growth-plan": "Growth",
      "pro-plan": "Pro",
      "enterprise-plan": "Enterprise",
    };
    return labels[plan] || plan;
  };

  const getPlanColor = (plan: string) => {
    if (plan === "enterprise-plan") return "bg-purple-900 text-purple-300";
    if (plan === "pro-plan") return "bg-blue-900 text-blue-300";
    if (plan === "growth-plan") return "bg-green-900 text-green-300";
    return "bg-gray-800 text-gray-400";
  };

  const totalRevenue = subscriptions.reduce((sum: number, sub: any) => {
    const prices: Record<string, number> = {
      "standard-listing": 1500,
      "featured-listing": 5000,
      "growth-plan": 9999,
      "pro-plan": 24999,
      "enterprise-plan": 79999,
    };
    return sum + (prices[sub.plan] || 0);
  }, 0);

  const isSuperAdmin = admin?.role === "super_admin";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const tabs = isSuperAdmin
    ? ["overview", "jobs", "subscriptions", "contacts", "team"]
    : ["contacts", "subscriptions", "jobs"];

  return (
    <div className="min-h-screen bg-gray-950 font-sans">

      {notification && (
        <div className="fixed top-4 right-4 bg-green-800 text-green-200 px-6 py-3 rounded-xl text-sm font-medium z-50 shadow-lg">
          ✓ {notification}
        </div>
      )}

      {replyingTo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-white font-bold mb-1">Reply to {replyingTo.name}</h3>
            <p className="text-gray-500 text-sm mb-4">{replyingTo.email} · {replyingTo.company}</p>
            <div className="bg-gray-800 rounded-xl p-3 mb-4">
              <p className="text-gray-400 text-xs font-semibold mb-1">Their message:</p>
              <p className="text-gray-300 text-sm">{replyingTo.message}</p>
            </div>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={8}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
            />
            <div className="flex gap-3 flex-wrap">
              <button onClick={handleSendReply} className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 flex-1">
                📧 Open in Email App
              </button>
              <button onClick={handleCopyReply} className="bg-gray-700 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-600">
                📋 Copy
              </button>
              <button onClick={() => setReplyingTo(null)} className="bg-gray-800 text-gray-400 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-700 w-full">
                Cancel
              </button>
            </div>
            <p className="text-gray-600 text-xs mt-3 text-center">
              If email app does not open, copy the message and paste into Gmail or Outlook manually.
            </p>
          </div>
        </div>
      )}

      <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L20 7V12C20 16.4 16.4 20.4 12 22C7.6 20.4 4 16.4 4 12V7L12 2Z" fill="white"/>
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-sm">Luravo Admin</p>
            <p className="text-gray-500 text-xs">{isSuperAdmin ? "Super Admin" : "Support Agent"} · {admin?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 text-sm transition">
          Sign Out
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {isSuperAdmin && (
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
        )}

        {!isSuperAdmin && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-8 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center text-xl">🛠️</div>
            <div>
              <p className="text-white font-semibold">Support Agent Dashboard</p>
              <p className="text-gray-500 text-sm">Reply to contacts, view subscriptions and manage jobs.</p>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-8 border-b border-gray-800 pb-4 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${activeTab === tab ? "bg-blue-600 text-white" : "text-gray-500 hover:text-white"}`}
            >
              {tab}
              {tab === "contacts" && contacts.length > 0 && (
                <span className="ml-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">{contacts.length}</span>
              )}
            </button>
          ))}
        </div>

        {activeTab === "overview" && isSuperAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Latest Jobs</h3>
              <div className="flex flex-col gap-3">
                {jobs.slice(0, 5).map((job: any) => (
                  <div key={job.id} onClick={() => setActiveTab("jobs")} className="flex items-center justify-between border-b border-gray-800 pb-2 cursor-pointer hover:bg-gray-800 rounded-lg px-2 py-1">
                    <div>
                      <p className="text-white text-sm font-medium">{job.title}</p>
                      <p className="text-gray-500 text-xs">{job.company}</p>
                    </div>
                    <span className="text-green-400 text-xs">KES {job.salary_max?.toLocaleString()}</span>
                  </div>
                ))}
                <button onClick={() => setActiveTab("jobs")} className="text-blue-500 text-xs hover:underline text-left mt-2">View all jobs →</button>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Latest Subscriptions</h3>
              <div className="flex flex-col gap-3">
                {subscriptions.slice(0, 5).map((sub: any) => (
                  <div key={sub.id} onClick={() => setActiveTab("subscriptions")} className="flex items-center justify-between border-b border-gray-800 pb-2 cursor-pointer hover:bg-gray-800 rounded-lg px-2 py-1">
                    <div>
                      <p className="text-white text-sm font-medium">{sub.email}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getPlanColor(sub.plan)}`}>{getPlanLabel(sub.plan)}</span>
                    </div>
                    <p className="text-gray-500 text-xs">{new Date(sub.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
                <button onClick={() => setActiveTab("subscriptions")} className="text-blue-500 text-xs hover:underline text-left mt-2">View all →</button>
              </div>
            </div>

            {contacts.length > 0 && (
              <div className="bg-gray-900 border border-red-900 rounded-2xl p-6 md:col-span-2">
                <h3 className="text-white font-semibold mb-4">🔴 Pending Contact Requests ({contacts.length})</h3>
                <div className="flex flex-col gap-3">
                  {contacts.slice(0, 3).map((contact: any) => (
                    <div key={contact.id} className="flex items-center justify-between border-b border-gray-800 pb-2">
                      <div>
                        <p className="text-white text-sm font-medium">{contact.name} · {contact.company}</p>
                        <p className="text-gray-500 text-xs">{contact.email}</p>
                      </div>
                      <button onClick={() => { setActiveTab("contacts"); handleReply(contact); }} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700">
                        Reply →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-white text-xl font-bold mb-2">All Jobs ({jobs.length})</h2>
            {jobs.map((job: any) => (
              <div key={job.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="p-5 cursor-pointer hover:bg-gray-800 transition" onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}>
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
                    </div>
                    <span className="text-gray-600 text-xs">{expandedJob === job.id ? "▲" : "▼"}</span>
                  </div>
                </div>
                {expandedJob === job.id && (
                  <div className="border-t border-gray-800 p-5 bg-gray-950">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Contact Email</p>
                        <p className="text-white text-sm">{job.contact_email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Posted</p>
                        <p className="text-white text-sm">{new Date(job.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Level</p>
                        <p className="text-white text-sm">{job.level}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Industry</p>
                        <p className="text-white text-sm">{job.industry}</p>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs mb-1">Description</p>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">{job.description}</p>
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => handleFeatureJob(job.id, job.featured)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold ${job.featured ? "bg-orange-900 text-orange-300 hover:bg-orange-800" : "bg-green-900 text-green-300 hover:bg-green-800"}`}
                      >
                        {job.featured ? "Remove Featured" : "⭐ Make Featured"}
                      </button>
                      <a href={`/jobs/${job.id}`} target="_blank" rel="noopener noreferrer" className="bg-gray-800 text-gray-300 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-gray-700">
                        View Live →
                      </a>
                      {isSuperAdmin && (
                        <button onClick={() => handleDeleteJob(job.id)} className="bg-red-900 text-red-300 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-800">
                          Delete Job
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "subscriptions" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-white text-xl font-bold mb-2">All Subscriptions ({subscriptions.length})</h2>
            {subscriptions.map((sub: any) => (
              <div key={sub.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="p-5 cursor-pointer hover:bg-gray-800 transition" onClick={() => setExpandedSub(expandedSub === sub.id ? null : sub.id)}>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-white font-semibold">{sub.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getPlanColor(sub.plan)}`}>{getPlanLabel(sub.plan)}</span>
                        <span className="text-gray-500 text-xs">Expires: {new Date(sub.expires_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-6 text-center items-center">
                      <div>
                        <p className="text-blue-400 font-bold text-xl">{sub.posts_remaining}</p>
                        <p className="text-gray-600 text-xs">Posts left</p>
                      </div>
                      <div>
                        <p className="text-green-400 font-bold text-xl">{sub.featured_remaining}</p>
                        <p className="text-gray-600 text-xs">Featured left</p>
                      </div>
                      <span className="text-gray-600 text-xs">{expandedSub === sub.id ? "▲" : "▼"}</span>
                    </div>
                  </div>
                </div>
                {expandedSub === sub.id && (
                  <div className="border-t border-gray-800 p-5 bg-gray-950 flex gap-3 flex-wrap">
                    {sub.plan === "enterprise-plan" && (
                      <button onClick={() => handleGeneratePDF(sub)} className="bg-purple-900 text-purple-300 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-purple-800">
                        📄 Generate PDF Report
                      </button>
                    )}
                    <a href={`mailto:${sub.email}`} className="bg-blue-900 text-blue-300 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-blue-800">
                      📧 Email Employer
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-white text-xl font-bold mb-2">Contact Requests ({contacts.length})</h2>
            {contacts.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
                <p className="text-gray-500">No contact requests yet.</p>
              </div>
            ) : (
              contacts.map((contact: any) => (
                <div key={contact.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="mb-4">
                    <p className="text-white font-semibold text-lg">{contact.name}</p>
                    <p className="text-blue-400 text-sm">{contact.email}</p>
                    <p className="text-gray-500 text-sm">{contact.company} · {contact.team_size}</p>
                    <p className="text-gray-400 text-sm mt-3 leading-relaxed">{contact.message}</p>
                    <p className="text-gray-700 text-xs mt-2">{new Date(contact.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <button onClick={() => handleReply(contact)} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700">
                      ✉️ Reply
                    </button>
                    <a href={`mailto:${contact.email}`} className="bg-gray-800 text-gray-300 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-gray-700">
                      📧 Quick Email
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "team" && isSuperAdmin && (
          <div className="flex flex-col gap-6">
            <h2 className="text-white text-xl font-bold">Team Management</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Add Team Member</h3>
              <form onSubmit={handleAddAdmin} className="flex flex-col gap-4">
                <input
                  required
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="support">Support Agent</option>
                  <option value="super_admin">Super Admin</option>
                </select>
                <button type="submit" disabled={addingAdmin} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50">
                  {addingAdmin ? "Adding..." : "Add Team Member"}
                </button>
              </form>
              <p className="text-gray-600 text-xs mt-3">
                After adding, go to Supabase → Authentication → Users → Add User and create a password for this person. Share it with them to log in at luravo.com/admin
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Current Team ({admins.length})</h3>
              <div className="flex flex-col gap-3">
                {admins.map((a: any) => (
                  <div key={a.id} className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <div>
                      <p className="text-white text-sm font-medium">{a.email}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${a.role === "super_admin" ? "bg-blue-900 text-blue-300" : "bg-gray-800 text-gray-400"}`}>
                        {a.role === "super_admin" ? "Super Admin" : "Support Agent"}
                      </span>
                    </div>
                    {a.email !== admin.email ? (
                      <button onClick={() => handleRemoveAdmin(a.id, a.email)} className="text-red-500 text-xs hover:underline">
                        Remove
                      </button>
                    ) : (
                      <span className="text-gray-600 text-xs">You</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}