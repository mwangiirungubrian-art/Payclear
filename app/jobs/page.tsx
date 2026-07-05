"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [level, setLevel] = useState("");
  const [location, setLocation] = useState("");
  const [minSalary, setMinSalary] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) {
        setJobs(data);
        setFiltered(data);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    let results = jobs;

    if (search) {
      results = results.filter(
        (job) =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.company.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (industry) {
      results = results.filter((job) => job.industry === industry);
    }

    if (level) {
      results = results.filter((job) => job.level === level);
    }

    if (location) {
      results = results.filter((job) =>
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (minSalary) {
      results = results.filter((job) => job.salary_min >= parseInt(minSalary));
    }

    setFiltered(results);
  }, [search, industry, level, location, minSalary, jobs]);

  const clearFilters = () => {
    setSearch("");
    setIndustry("");
    setLevel("");
    setLocation("");
    setMinSalary("");
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <section className="bg-blue-50 px-6 py-14 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Browse Jobs</h1>
        <p className="mt-3 text-gray-500 text-lg">Every listing includes a salary range. Always.</p>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Industries</option>
              <option>Tech</option>
              <option>Finance</option>
              <option>Media</option>
              <option>Healthcare</option>
              <option>Education</option>
              <option>Retail</option>
              <option>Other</option>
            </select>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              <option>Junior</option>
              <option>Mid</option>
              <option>Senior</option>
            </select>
            <input
              type="text"
              placeholder="Location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Min salary (KES)..."
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{filtered.length} job{filtered.length !== 1 ? "s" : ""} found</p>
            {(search || industry || level || location || minSalary) && (
              <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline">
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No jobs match your search.</p>
            <button onClick={clearFilters} className="mt-4 text-blue-600 hover:underline text-sm">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filtered.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                    <p className="text-gray-500 mt-1">{job.company} · {job.location}</p>
                    <div className="flex gap-2 mt-3">
                      <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">{job.level}</span>
                      <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">{job.type}</span>
                      <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">{job.industry}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-bold text-lg">
                      KES {job.salary_min.toLocaleString()} – {job.salary_max.toLocaleString()}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">per month</p>
                    <a href={`/jobs/${job.id}`} className="mt-3 inline-block bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700">
                      View Job
                    </a>
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