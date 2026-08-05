import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";

export default async function InsightsPage() {
  const { data: jobs } = await supabase.from("jobs").select("*");

  if (!jobs || jobs.length === 0) {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
        <Navbar />
        <div className="flex flex-col items-center justify-center flex-1 py-20">
          <p className="text-gray-400 text-lg">Not enough data yet. Check back soon!</p>
        </div>
        <Footer />
      </div>
    );
  }

  const avgSalary = Math.round(
    jobs.reduce((sum, job) => sum + (job.salary_min + job.salary_max) / 2, 0) / jobs.length
  );

  const industries = [...new Set(jobs.map((j) => j.industry))];
  const byIndustry = industries.map((industry) => {
    const filtered = jobs.filter((j) => j.industry === industry);
    const avg = Math.round(
      filtered.reduce((sum, j) => sum + (j.salary_min + j.salary_max) / 2, 0) / filtered.length
    );
    return { industry, avg, count: filtered.length };
  }).sort((a, b) => b.avg - a.avg);

  const levels = ["Junior", "Mid", "Senior"];
  const byLevel = levels.map((level) => {
    const filtered = jobs.filter((j) => j.level === level);
    if (filtered.length === 0) return { level, avg: 0, count: 0 };
    const avg = Math.round(
      filtered.reduce((sum, j) => sum + (j.salary_min + j.salary_max) / 2, 0) / filtered.length
    );
    return { level, avg, count: filtered.length };
  }).filter((l) => l.count > 0);

  const topJobs = [...jobs]
    .sort((a, b) => b.salary_max - a.salary_max)
    .slice(0, 3);

  const topJobsPro = [...jobs]
    .sort((a, b) => b.salary_max - a.salary_max)
    .slice(0, 10);

  const maxAvg = Math.max(...byIndustry.map((i) => i.avg));
  const colors = ["#2196F3", "#4CAF50", "#FF9800", "#9C27B0", "#F44336", "#00BCD4", "#FF5722"];

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <section className="bg-blue-50 px-6 py-14 text-center">
        <p className="text-xs font-semibold text-blue-600 tracking-widest uppercase mb-3">Powered by real job listings</p>
        <h1 className="text-4xl font-bold text-gray-900">Salary Insights</h1>
        <p className="mt-3 text-gray-500 text-lg max-w-xl mx-auto">
          Real salary data from every job posted on Luravo. No estimates. No guesses.
        </p>
      </section>

      {/* FREE — Stats Strip */}
      <section className="border-b border-gray-100 py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 divide-x divide-gray-100 text-center">
          <div className="px-6">
            <p className="text-3xl font-semibold text-blue-600">{jobs.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total jobs tracked</p>
          </div>
          <div className="px-6">
            <p className="text-3xl font-semibold text-blue-600">{industries.length}</p>
            <p className="text-sm text-gray-500 mt-1">Industries covered</p>
          </div>
          <div className="px-6">
            <p className="text-3xl font-semibold text-green-600">100%</p>
            <p className="text-sm text-gray-500 mt-1">Salary disclosed</p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12">

        {/* FREE — Top 3 Jobs */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Top Paying Jobs</h2>
            <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">✅ FREE</span>
          </div>
          <p className="text-gray-500 text-sm mb-6">The highest paying open positions right now</p>
          <div className="flex flex-col gap-4">
            {topJobs.map((job, index) => (
              <div key={job.id} className="flex items-center justify-between border border-gray-200 rounded-2xl p-5 hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-blue-100 w-8">#{index + 1}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{job.title}</p>
                    <p className="text-gray-500 text-sm">{job.company} · {job.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-bold">KES {job.salary_max.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs">up to / month</p>
                  <a href={`/jobs/${job.id}`} className="text-blue-500 text-xs hover:underline">View job</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRO — Average Salary BLURRED */}
        <div className="mb-14 relative">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Average Monthly Salary</h2>
            <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full">🔒 PRO</span>
          </div>
          <p className="text-gray-500 text-sm mb-6">Platform-wide salary average across all industries</p>
          <div className="relative">
            <div className="blur-sm pointer-events-none select-none">
              <div className="bg-blue-50 rounded-2xl p-10 text-center border border-blue-100">
                <p className="text-6xl font-bold text-blue-600">KES {avgSalary.toLocaleString()}</p>
                <p className="text-gray-500 mt-2">average per month across all listings</p>
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 rounded-2xl">
              <p className="text-gray-900 font-bold text-lg mb-2">🔒 Pro Feature</p>
              <p className="text-gray-500 text-sm mb-4 text-center max-w-xs">Unlock average salary data with a Pro plan</p>
              <a href="/checkout#pro" className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-blue-700">
                Upgrade to Pro →
              </a>
            </div>
          </div>
        </div>

        {/* PRO — Salary by Industry BLURRED */}
        <div className="mb-14 relative">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Salary by Industry</h2>
            <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full">🔒 PRO</span>
          </div>
          <p className="text-gray-500 text-sm mb-6">Average monthly salary broken down by industry</p>
          <div className="relative">
            <div className="blur-sm pointer-events-none select-none">
              <div className="flex flex-col gap-4">
                {byIndustry.map(({ industry, avg, count }, i) => (
                  <div key={industry}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{industry}</span>
                      <span className="text-sm text-gray-500">{count} job{count !== 1 ? "s" : ""} · KES {avg.toLocaleString()}/mo</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-4">
                      <div
                        className="h-4 rounded-full"
                        style={{ width: `${Math.round((avg / maxAvg) * 100)}%`, backgroundColor: colors[i % colors.length] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 rounded-2xl">
              <p className="text-gray-900 font-bold text-lg mb-2">🔒 Pro Feature</p>
              <p className="text-gray-500 text-sm mb-4 text-center max-w-xs">See salary breakdowns by industry with a Pro plan</p>
              <a href="/checkout#pro" className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-blue-700">
                Upgrade to Pro →
              </a>
            </div>
          </div>
        </div>

        {/* PRO — Salary by Level BLURRED */}
        <div className="mb-14 relative">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Salary by Job Level</h2>
            <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full">🔒 PRO</span>
          </div>
          <p className="text-gray-500 text-sm mb-6">How experience level affects your salary</p>
          <div className="relative">
            <div className="blur-sm pointer-events-none select-none">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {byLevel.map(({ level, avg, count }, i) => (
                  <div key={level} className="rounded-2xl p-6 text-center" style={{ backgroundColor: `${colors[i]}15`, border: `1px solid ${colors[i]}30` }}>
                    <p className="text-sm font-semibold mb-2" style={{ color: colors[i] }}>{level}</p>
                    <p className="text-3xl font-bold text-gray-900">KES {avg.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm mt-1">per month</p>
                    <p className="text-gray-400 text-xs mt-2">{count} job{count !== 1 ? "s" : ""} analysed</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 rounded-2xl">
              <p className="text-gray-900 font-bold text-lg mb-2">🔒 Pro Feature</p>
              <p className="text-gray-500 text-sm mb-4 text-center max-w-xs">Understand how experience affects pay with a Pro plan</p>
              <a href="/checkout#pro" className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-blue-700">
                Upgrade to Pro →
              </a>
            </div>
          </div>
        </div>

        {/* ENTERPRISE — Full Report BLURRED */}
        <div className="mb-14 relative">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Full Salary Report</h2>
            <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-3 py-1 rounded-full">🔒 ENTERPRISE</span>
          </div>
          <p className="text-gray-500 text-sm mb-6">Top 10 paying jobs, salary distribution and downloadable PDF report</p>
          <div className="relative">
            <div className="blur-sm pointer-events-none select-none">
              <div className="flex flex-col gap-4">
                {topJobsPro.map((job, index) => (
                  <div key={job.id} className="flex items-center justify-between border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-gray-200 w-8">#{index + 1}</span>
                      <div>
                        <p className="font-semibold text-gray-900">{job.title}</p>
                        <p className="text-gray-500 text-sm">{job.company} · {job.location}</p>
                      </div>
                    </div>
                    <p className="text-green-600 font-bold">KES {job.salary_max.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 rounded-2xl">
              <p className="text-gray-900 font-bold text-lg mb-2">🔒 Enterprise Feature</p>
              <p className="text-gray-500 text-sm mb-4 text-center max-w-xs">Get full salary reports and monthly PDF benchmarking with Enterprise</p>
              <a href="/checkout#enterprise" className="bg-purple-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-purple-700">
                View Enterprise Plan →
              </a>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-600 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Unlock the full picture</h2>
          <p className="text-blue-200 mb-6 max-w-md mx-auto">Upgrade to Pro or Enterprise to access full salary analytics and benchmarking reports.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="/checkout#pro" className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50">
              View Pro Plan →
            </a>
            <a href="/checkout#enterprise" className="border border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700">
              View Enterprise Plan →
            </a>
          </div>
        </div>

      </section>

      <Footer />
    </div>
  );
}