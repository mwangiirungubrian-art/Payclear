import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { supabase } from "../../lib/supabase";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-xl">Job not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <section className="bg-blue-50 px-6 py-14">
        <div className="max-w-3xl mx-auto">
          <a href="/jobs" className="text-blue-600 text-sm hover:underline">← Back to Jobs</a>
          <h1 className="text-4xl font-bold text-gray-900 mt-4">{job.title}</h1>
          <p className="text-gray-500 mt-2 text-lg">{job.company} · {job.location}</p>
          <div className="flex gap-2 mt-4">
            <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">{job.level}</span>
            <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">{job.type}</span>
            <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">{job.industry}</span>
          </div>
          <p className="text-green-600 font-bold text-2xl mt-6">
            KES {job.salary_min.toLocaleString()} – {job.salary_max.toLocaleString()}
            <span className="text-gray-400 text-base font-normal ml-2">per month</span>
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">About the Role</h2>
          <p className="text-gray-600 leading-relaxed">{job.description}</p>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Requirements</h2>
          <p className="text-gray-600 leading-relaxed">{job.requirements}</p>
        </div>
        <a href={`mailto:${job.contact_email}`} className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700">
          Apply Now →
        </a>
      </section>

      <Footer />
    </div>
  );
}