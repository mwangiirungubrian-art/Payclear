export default function JobsPage() {
  const jobs = [
    {
      id: 1,
      title: "Software Engineer",
      company: "Safaricom",
      location: "Nairobi, Kenya",
      type: "Full Time",
      level: "Mid",
      salaryMin: 150000,
      salaryMax: 250000,
      industry: "Tech",
    },
    {
      id: 2,
      title: "Product Manager",
      company: "Equity Bank",
      location: "Nairobi, Kenya",
      type: "Full Time",
      level: "Senior",
      salaryMin: 300000,
      salaryMax: 450000,
      industry: "Finance",
    },
    {
      id: 3,
      title: "Graphic Designer",
      company: "Nation Media",
      location: "Remote",
      type: "Contract",
      level: "Junior",
      salaryMin: 60000,
      salaryMax: 100000,
      industry: "Media",
    },
    {
      id: 4,
      title: "Data Analyst",
      company: "Twiga Foods",
      location: "Nairobi, Kenya",
      type: "Full Time",
      level: "Mid",
      salaryMin: 120000,
      salaryMax: 180000,
      industry: "Tech",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <a href="/" className="text-2xl font-bold text-blue-600">PayClear</a>
        <div className="flex gap-4">
          <a href="/jobs" className="text-blue-600 font-medium">Browse Jobs</a>
          <a href="/post-job" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700">Post a Job</a>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-blue-50 px-6 py-14 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Browse Jobs</h1>
        <p className="mt-3 text-gray-500 text-lg">Every listing includes a salary range. Always.</p>
      </section>

      {/* Job Listings */}
      <section className="max-w-4xl mx-auto px-6 py-12">
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
                    KES {job.salaryMin.toLocaleString()} – {job.salaryMax.toLocaleString()}
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
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-gray-400 text-sm border-t border-gray-100">
        © 2025 PayClear. Built for a fairer world of work.
      </footer>

    </div>
  );
}