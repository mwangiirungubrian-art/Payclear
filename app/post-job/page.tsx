"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PostJobPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [applyMethod, setApplyMethod] = useState("email");
  const [salaryType, setSalaryType] = useState("range");

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    level: "",
    type: "",
    industry: "",
    salary_min: "",
    salary_max: "",
    salary_fixed: "",
    description: "",
    requirements: "",
    contact_email: "",
    apply_url: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.from("jobs").insert([{
      title: form.title,
      company: form.company,
      location: form.location,
      level: form.level,
      type: form.type,
      industry: form.industry,
      salary_type: salaryType,
      salary_min: salaryType === "range" ? parseInt(form.salary_min) : parseInt(form.salary_fixed),
      salary_max: salaryType === "range" ? parseInt(form.salary_max) : parseInt(form.salary_fixed),
      salary_fixed: salaryType === "fixed" ? parseInt(form.salary_fixed) : null,
      description: form.description,
      requirements: form.requirements,
      contact_email: form.contact_email,
      apply_url: applyMethod === "ats" ? form.apply_url : null,
    }]);

    setLoading(false);
    if (error) {
      setError("Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
        <Navbar />
        <div className="flex flex-col items-center justify-center flex-1 py-20">
          <div className="text-5xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900">Job Posted Successfully!</h1>
          <p className="text-gray-500 mt-3 text-lg">Your listing is live on Luravo.</p>
          <div className="flex gap-4 mt-8">
            <a href="/dashboard" className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700">
              View My Dashboard
            </a>
            <a href="/jobs" className="border border-gray-200 text-gray-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50">
              Browse Jobs
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <section className="bg-blue-50 px-6 py-14 text-center">
        <div className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
          ✅ Payment confirmed — fill in your job details below
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Post Your Job</h1>
        <p className="mt-3 text-gray-500 text-lg">Salary is required. No exceptions.</p>
      </section>

      <section className="max-w-2xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
            <input required name="title" value={form.title} onChange={handleChange} type="text" placeholder="e.g. Software Engineer" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
            <input required name="company" value={form.company} onChange={handleChange} type="text" placeholder="e.g. Safaricom" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
            <input required name="location" value={form.location} onChange={handleChange} type="text" placeholder="e.g. Nairobi, Kenya or Remote" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Job Level *</label>
              <select required name="level" value={form.level} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select level</option>
                <option>Junior</option>
                <option>Mid</option>
                <option>Senior</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type *</label>
              <select required name="type" value={form.type} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select type</option>
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Industry *</label>
            <select required name="industry" value={form.industry} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select industry</option>
              <option>Tech</option>
              <option>Finance</option>
              <option>Media</option>
              <option>Healthcare</option>
              <option>Education</option>
              <option>Retail</option>
              <option>Other</option>
            </select>
          </div>

          {/* Salary Type Toggle */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Salary Type *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSalaryType("range")}
                className={`border rounded-xl px-4 py-4 text-left transition ${salaryType === "range" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}
              >
                <p className="font-medium text-gray-800 text-sm">📊 Salary Range</p>
                <p className="text-gray-400 text-xs mt-1">e.g. KES 100,000 – 150,000</p>
              </button>
              <button
                type="button"
                onClick={() => setSalaryType("fixed")}
                className={`border rounded-xl px-4 py-4 text-left transition ${salaryType === "fixed" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}
              >
                <p className="font-medium text-gray-800 text-sm">💰 Fixed Salary</p>
                <p className="text-gray-400 text-xs mt-1">e.g. KES 120,000 exactly</p>
              </button>
            </div>
          </div>

          {/* Salary Range fields */}
          {salaryType === "range" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Salary Range (KES per month) *</label>
              <div className="grid grid-cols-2 gap-4">
                <input required name="salary_min" value={form.salary_min} onChange={handleChange} type="number" placeholder="Minimum e.g. 100000" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input required name="salary_max" value={form.salary_max} onChange={handleChange} type="number" placeholder="Maximum e.g. 150000" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <p className="text-blue-600 text-sm mt-2 font-medium">💡 Salary range is mandatory on Luravo. This is what makes us different.</p>
            </div>
          )}

          {/* Fixed Salary field */}
          {salaryType === "fixed" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fixed Salary (KES per month) *</label>
              <input required name="salary_fixed" value={form.salary_fixed} onChange={handleChange} type="number" placeholder="e.g. 120000" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <p className="text-blue-600 text-sm mt-2 font-medium">💡 Showing a fixed salary builds trust with candidates.</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description *</label>
            <textarea required name="description" value={form.description} onChange={handleChange} rows={5} placeholder="Describe the role and what success looks like..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Requirements *</label>
            <textarea required name="requirements" value={form.requirements} onChange={handleChange} rows={4} placeholder="List the key requirements for this role..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Application Method */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">How should candidates apply? *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setApplyMethod("email")}
                className={`border rounded-xl px-4 py-4 text-left transition ${applyMethod === "email" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}
              >
                <p className="font-medium text-gray-800 text-sm">📧 By Email</p>
                <p className="text-gray-400 text-xs mt-1">Candidates email you directly</p>
              </button>
              <button
                type="button"
                onClick={() => setApplyMethod("ats")}
                className={`border rounded-xl px-4 py-4 text-left transition ${applyMethod === "ats" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}
              >
                <p className="font-medium text-gray-800 text-sm">🔗 External ATS</p>
                <p className="text-gray-400 text-xs mt-1">Jazz HR, Workable, Greenhouse etc</p>
              </button>
            </div>
          </div>

          {applyMethod === "email" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email *</label>
              <input required name="contact_email" value={form.contact_email} onChange={handleChange} type="email" placeholder="hiring@yourcompany.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          )}

          {applyMethod === "ats" && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Application URL *</label>
                <input required name="apply_url" value={form.apply_url} onChange={handleChange} type="url" placeholder="https://jobs.jazzhr.com/your-job-link" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-gray-400 text-xs mt-2">Candidates will be redirected here when they click Apply</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email * (for receipts)</label>
                <input required name="contact_email" value={form.contact_email} onChange={handleChange} type="email" placeholder="hiring@yourcompany.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? "Posting..." : "Post Job →"}
          </button>

        </form>
      </section>

      <Footer />
    </div>
  );
}