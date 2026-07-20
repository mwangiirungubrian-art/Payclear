"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    team_size: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
        <Navbar />
        <div className="flex flex-col items-center justify-center flex-1 py-20 text-center px-6">
          <div className="text-6xl mb-6">🙌</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">We'll be in touch!</h1>
          <p className="text-gray-500 text-lg max-w-md mb-8">
            Thanks for reaching out. Our team will get back to you within 24 hours to discuss your custom plan.
          </p>
          <a href="/" className="bg-blue-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-800">
            Back to Home
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <section className="bg-blue-50 px-6 py-14 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Let's Talk</h1>
        <p className="mt-3 text-gray-500 text-lg max-w-xl mx-auto">
          Looking for a custom plan for your organisation? Tell us about your needs and we'll build something that works.
        </p>
      </section>

      <section className="max-w-2xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-blue-50 rounded-2xl">
            <p className="text-2xl mb-2">⚡</p>
            <p className="font-semibold text-gray-900 text-sm">Fast Response</p>
            <p className="text-gray-500 text-xs mt-1">We reply within 24 hours</p>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-2xl">
            <p className="text-2xl mb-2">🎯</p>
            <p className="font-semibold text-gray-900 text-sm">Custom Plans</p>
            <p className="text-gray-500 text-xs mt-1">Tailored to your team size</p>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-2xl">
            <p className="text-2xl mb-2">🌍</p>
            <p className="font-semibold text-gray-900 text-sm">Pan-Africa Ready</p>
            <p className="text-gray-500 text-xs mt-1">Kenya, Uganda, Nigeria and beyond</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
              <input required name="name" value={form.name} onChange={handleChange} type="text" placeholder="John Kamau" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
              <input required name="company" value={form.company} onChange={handleChange} type="text" placeholder="Safaricom PLC" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Work Email *</label>
            <input required name="email" value={form.email} onChange={handleChange} type="email" placeholder="john@company.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Team Size *</label>
            <select required name="team_size" value={form.team_size} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select team size</option>
              <option>1 - 10 employees</option>
              <option>11 - 50 employees</option>
              <option>51 - 200 employees</option>
              <option>201 - 500 employees</option>
              <option>500+ employees</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tell us about your needs *</label>
            <textarea required name="message" value={form.message} onChange={handleChange} rows={5} placeholder="How many jobs do you post per month? What features are most important to you? Any specific requirements?" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <button type="submit" disabled={loading} className="bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50">
            {loading ? "Sending..." : "Send Message →"}
          </button>

        </form>
      </section>

      <Footer />
    </div>
  );
}