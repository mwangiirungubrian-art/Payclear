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
    setJobs(jobs.filter((j) => j.id !== id));
    showNotification("Job deleted successfully");
  };

  const handleFeatureJob = async (id: number, featured: boolean) => {
    await supabase.from("jobs").update({ featured: !featured }).eq("id", id);
    setJobs(jobs.map((j) => j.id === id ? { ...j, featured: !featured } : j));
    showNotification(featured ? "Featured removed" : "Job featured successfully");
  };

  const handleReply = async (contact: any) => {
    setReplyingTo(contact);
    setReplyMessage(`Hi ${contact.name},\n\nThank you for reaching out to Luravo.\n\n`);
  };

  const handleSendReply = () => {
    const subject = `Re: Your Luravo Enterprise Inquiry - ${replyingTo.company}`;
    const body = encodeURIComponent(replyMessage);
    window.open(`mailto:${replyingTo.email}?subject=${encodeURIComponent(subject)}&body=${body}`);
    setReplyingTo(null);
    setReplyMessage("");
    showNotification("Email client opened!");
  };

  const handleGeneratePDF = async (sub: any) => {
    const { data: subJobs } = await supabase
      .from("jobs")
      .select("*")
      .eq("contact_email", sub.email);

    const avgSalary = subJobs && subJobs.length > 0
  ? Math.round(subJobs.reduce((sum: number, j: any) => sum + (j.salary_min + j.salary_max) / 2, 0) / subJobs.length)
  : 0;

    const content = `
LURAVO SALARY BENCHMARKING REPORT
Generated: ${new Date().toLocaleDateString()}
Prepared for: ${sub.email}
Plan: ${sub.plan}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
Total Jobs Posted: ${subJobs?.length || 0}
Average Salary: KES ${avgSalary.toLocaleString()} per month

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR JOB LISTINGS
${subJobs?.map((j: any, i: number) => `
${i + 1}. ${j.title} - ${j.company}
   Location: ${j.location}
   Level: ${j.level} | Type: ${j.type}
   Salary: ${j.salary_type === "fixed" ? `KES ${j.salary_min?.toLocaleString()} fixed` : `KES ${j.salary_min?.toLocaleString()} - KES ${j.salary_max?.toLocaleString()}`}
`).join("") || "No jobs posted yet"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PLATFORM INSIGHTS
Total Jobs on Luravo: ${jobs.length}
Your Share of Listings: ${subJobs ? Math.round((subJobs.length / jobs.length) * 100) : 0}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

luravo.com | hello@luravo.com
Every Job. Every Salary. No Exceptions.
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Luravo_Report_${sub.email}_${new Date().toLocaleDateString().replace(/\//g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification("Report downloaded! Attach to email and send to employer.");
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingAdmin(true);
    await supabase.from("admins").insert([{ email: newAdminEmail, role: newAdminRole }]);
    const { data } = await supabase.from("admins").select("*").order("created_at", { ascending: false });
    if (data) setAdmins(data);
    setNewAdminEmail("");
    setAddingAdmin(false);
    showNotification(`${newAdminEmail} added as ${newAdminRole}`);
  };

  const handleRemoveAdmin = async (id: number, email: string) => {
    if (email === admin.email) { showNotification("You cannot remove yourself!"); return; }
    if (!confirm(`Remove ${email} from admin?`)) return;
    await supabase.from("admins").delete().eq("id", id);
    setAdmins(admins.filter((a) => a.id !== id));
    showNotification("Admin removed");
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
    if (plan === "enterprise-plan") return "bg-purple-900 text-purple-300";
    if (plan === "pro-plan") return "bg-blue-900 text-blue-300";
    if (plan === "growth-plan") return "bg-green-900 text-green-300";
    return "bg-gray-800 text-gray-400";
  };

  const totalRevenue = subscriptions.reduce((sum: number, sub: any) => {
    if (sub.plan === "standard-listing") return sum + 1500;
    if (sub.plan === "featured-listing") return sum + 5000;
    if (sub.plan === "growth-plan") return sum + 9999;
    if (sub.plan === "pro-plan") return sum + 24999;
    if (sub.plan === "enterprise-plan") return sum + 79999;
    return sum;
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 font-sans">

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-800 text-green-200 px-6 py-3 rounded-xl text-sm font-medium z-50 shadow-lg">
          ✓ {notification}
        </div>
      )}

      {/* Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-white font-bold mb-1">Reply to {replyingTo.name}</h3>
            <p className="text-gray-500 text-sm mb-4">{replyingTo.email} · {replyingTo.company}</p>
            <div className="bg-gray-800 rounded-xl p-3 mb-4 text-gray-400 text-xs">
              <p className="font-semibold text-gray-300 mb-1">Their message:</p>
              <p>{replyingTo.message}</p>
            </div>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={8}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleSendReply}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 flex-1"
              >
                Open in Email Client →
              </button>
              <button
                onClick={() => setReplyingTo(null)}
                className="bg-gray-800 text-gray-400 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

        {/* Stats */}
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
        <div className="flex gap-2 mb-8 border-b border-gray-800 pb-4 flex-wrap">
          {["overview", "jobs", "subscriptions", "contacts", ...(admin?.role === "super_admin" ? ["team"] : [])].map((tab) => (
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

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Latest Jobs</h3>
              <div className="flex flex-col gap-3">
                {jobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{job.title}</p>
                      <p className="text-gray-500 text-xs">{job.company}</p>
                    </div>
                    <span className="text-green-400 text-xs">KES {job.salary_max?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
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
                    <p className="text-gray-500 text-xs">{new Date(sub.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* JOBS TAB */}
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
                    <p className="text-gray-700 text-xs">{new Date(job.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col gap-2 text-right">
                    <button
                      onClick={() => handleFeatureJob(job.id, job.featured)}
                      className={`text-xs font-medium hover:underline ${job.featured ? "text-orange-400" : "text-green-400"}`}
                    >
                      {job.featured ? "Remove Featured" : "⭐ Make Featured"}
                    </button>
                    {admin?.role === "super_admin" && (
                      <button onClick={() => handleDeleteJob(job.id)} className="text-red-500 text-xs font-medium hover:underline">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SUBSCRIPTIONS TAB */}
        {activeTab === "subscriptions" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-white text-xl font-bold mb-2">All Subscriptions ({subscriptions.length})</h2>
            {subscriptions.map((sub) => (
              <div key={sub.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
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
                  {sub.plan === "enterprise-plan" && (
                    <button
                      onClick={() => handleGeneratePDF(sub)}
                      className="bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-purple-600"
                    >
                      📄 Generate PDF Report
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CONTACTS TAB */}
        {activeTab === "contacts" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-white text-xl font-bold mb-2">Contact Requests ({contacts.length})</h2>
            {contacts.length === 0 ? (
              <p className="text-gray-500">No contact requests yet.</p>
            ) : (
              contacts.map((contact) => (
                <div key={contact.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      <p className="text-white font-semibold">{contact.name} · {contact.company}</p>
                      <p className="text-blue-400 text-sm mt-1">{contact.email}</p>
                      <p className="text-gray-500 text-xs mt-1">Team size: {contact.team_size}</p>
                      <p className="text-gray-400 text-sm mt-3 max-w-lg leading-relaxed">{contact.message}</p>
                      <p className="text-gray-700 text-xs mt-2">{new Date(contact.created_at).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => handleReply(contact)}
                      className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700"
                    >
                      Reply →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TEAM TAB — Super Admin Only */}
        {activeTab === "team" && admin?.role === "super_admin" && (
          <div className="flex flex-col gap-6">
            <h2 className="text-white text-xl font-bold">Team Management</h2>

            {/* Add Admin */}
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
                <button
                  type="submit"
                  disabled={addingAdmin}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {addingAdmin ? "Adding..." : "Add Team Member"}
                </button>
              </form>
              <p className="text-gray-600 text-xs mt-3">
  ⚠️ Next step: Go to Supabase → Authentication → Users → Add User and create a password for this person. Share the password with them so they can log in at luravo.com/admin
</p>
            </div>

            {/* Current Team */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Current Team ({admins.length})</h3>
              <div className="flex flex-col gap-3">
                {admins.map((a) => (
                  <div key={a.id} className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <div>
                      <p className="text-white text-sm font-medium">{a.email}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${a.role === "super_admin" ? "bg-blue-900 text-blue-300" : "bg-gray-800 text-gray-400"}`}>
                        {a.role === "super_admin" ? "Super Admin" : "Support Agent"}
                      </span>
                    </div>
                    {a.email !== admin.email && (
                      <button
                        onClick={() => handleRemoveAdmin(a.id, a.email)}
                        className="text-red-500 text-xs hover:underline"
                      >
                        Remove
                      </button>
                    )}
                    {a.email === admin.email && (
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