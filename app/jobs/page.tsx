import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";

export default async function JobsPage() {
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <section className="bg-blue-50 px-6 py-14 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Browse Jobs</h1>
        <p className="mt-3 text-gray-500 text-lg">Every listing includes a salary range. Always.</p>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12">
        {!jobs || jobs.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">No jobs posted yet. Be the first!</p>
        ) : (
          <div className="flex flex-col gap-6">
            {jobs.map((job) => (
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