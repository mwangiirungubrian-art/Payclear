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
    .slice(0, 5);

  const maxAvg = Math.max(...byIndustry.map((i) => i.avg));

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <section className="bg-blue-50 px-6 py-14 text-center">
        <p className="text-xs font-semibold text-blue-700 tracking-widest uppercase mb-3">Data from real job listings</p>
        <h1 className="text-4xl font-bold text-gray-900">Salary Insights</h1>
        <p className="mt-3 text-gray-500 text-lg max-w-xl mx-auto">
          Real salary data from every job posted on PayClear. No estimates. No guesses.
        </p>
      </section>

      <section className="border-b border-gray-100 py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 divide-x divide-gray-100 text-center">
          <div className="px-6">
            <p className="text-3xl font-semibold text-blue-700">KES {avgSalary.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Average monthly salary</p>
          </div>
          <div className="px-6">
            <p className="text-3xl font-semibold text-blue-700">{jobs.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total jobs analysed</p>
          </div>
          <div className="px-6">
            <p className="text-3xl font-semibold text-green-600">{industries.length}</p>
            <p className="text-sm text-gray-500 mt-1">Industries tracked</p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12">

        <div className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Average Salary by Industry</h2>
          <p className="text-gray-500 text-sm mb-6">Based on all jobs posted on PayClear</p>
          <div className="flex flex-col gap-4">
            {byIndustry.map(({ industry, avg, count }) => (
              <div key={industry}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{industry}</span>
                  <span className="text-sm text-gray-500">{count} job{count !== 1 ? "s" : ""} · KES {avg.toLocaleString()}/mo</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${Math.round((avg / maxAvg) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Average Salary by Job Level</h2>
          <p className="text-gray-500 text-sm mb-6">How experience affects pay</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {byLevel.map(({ level, avg, count }) => (
              <div key={level} className="border border-gray-200 rounded-2xl p-6 text-center">
                <p className="text-sm font-semibold text-blue-700 mb-2">{level}</p>
                <p className="text-3xl font-bold text-gray-900">KES {avg.toLocaleString()}</p>
                <p className="text-gray-400 text-sm mt-1">per month</p>
                <p className="text-gray-400 text-xs mt-2">{count} job{count !== 1 ? "s" : ""} analysed</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Top Paying Jobs Right Now</h2>
          <p className="text-gray-500 text-sm mb-6">Highest paying open positions on PayClear</p>
          <div className="flex flex-col gap-4">
            {topJobs.map((job, index) => (
              <div key={job.id} className="flex items-center justify-between border border-gray-200 rounded-2xl p-5 hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-blue-200 w-8">#{index + 1}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{job.title}</p>
                    <p className="text-gray-500 text-sm">{job.company} · {job.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-bold">KES {job.salary_max.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs">up to / month</p>
                  <a href={`/jobs/${job.id}`} className="text-blue-600 text-xs hover:underline">View job</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-700 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Want deeper salary data?</h2>
          <p className="text-blue-200 mb-6">Post a job with a salary range and contribute to the most accurate compensation database.</p>
          <a href="/checkout" className="bg-white text-blue-700 px-8 py-4 rounded-full font-semibold hover:bg-blue-50">
            Post a Job →
          </a>
        </div>

      </section>

      <Footer />
    </div>
  );
}