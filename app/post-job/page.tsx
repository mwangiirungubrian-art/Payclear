"use client";

import { useState } from "react";

export default function PostJobPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
        <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <a href="/" className="text-2xl font-bold text-blue-600">PayClear</a>
          <div className="flex gap-4">
            <a href="/jobs" className="text-gray-600 hover:text-blue-600 font-medium">Browse Jobs</a>
            <a href="/post-job" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700">Post a Job</a>
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center flex-1 py-20">
          <div className="text-5xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900">Job Posted Successfully!</h1>
          <p className="text-gray-500 mt-3 text-lg">Your listing is under review and will go live shortly.</p>
          <a href="/jobs" className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700">
            Browse Jobs
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <a href="/" className="text-2xl font-bold text-blue-600">PayClear</a>
        <div className="flex gap-4">
          <a href="/jobs" className="text-gray-600 hover:text-blue-600 font-medium">Browse Jobs</a>
          <a href="/post-job" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700">Post a Job</a>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-blue-50 px-6 py-14 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Post a Job</h1>
        <p className="mt-3 text-gray-500 text-lg">Salary range is required. No exceptions.</p>
      </section>

      {/* Form */}
      <section className="max-w-2xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
            <input required type="text" placeholder="e.g. Software Engineer" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
            <input required type="text" placeholder="e.g. Safaricom" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
            <input required type="text" placeholder="e.g. Nairobi, Kenya or Remote" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Job Level *</label>
              <select required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select level</option>
                <option>Junior</option>
                <option>Mid</option>
                <option>Senior</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type *</label>
              <select required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
            <select required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
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

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Salary Range (KES per month) *</label>
            <div className="grid grid-cols-2 gap-4">
              <input required type="number" placeholder="Minimum e.g. 150000" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input required type="number" placeholder="Maximum e.g. 250000" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <p className="text-blue-600 text-sm mt-2 font-medium">💡 Salary range is mandatory on PayClear. This is what makes us different.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description *</label>
            <textarea required rows={5} placeholder="Describe the role, what the team does, and what success looks like..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Requirements *</label>
            <textarea required rows={4} placeholder="List the key requirements for this role..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email *</label>
            <input required type="email" placeholder="hiring@yourcompany.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition">
            Post Job →
          </button>

        </form>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-gray-400 text-sm border-t border-gray-100">
        © 2025 PayClear. Built for a fairer world of work.
      </footer>

    </div>
  );
}