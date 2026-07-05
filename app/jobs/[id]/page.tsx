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
    description: "We are looking for a skilled Software Engineer to join our growing tech team at Safaricom. You will be responsible for building and maintaining scalable software solutions.",
    responsibilities: [
      "Build and maintain web and mobile applications",
      "Collaborate with cross-functional teams",
      "Write clean, scalable code",
      "Participate in code reviews",
    ],
    requirements: [
      "3+ years of software development experience",
      "Proficiency in JavaScript, Python or Java",
      "Experience with REST APIs",
      "Strong problem-solving skills",
    ],
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
    description: "Equity Bank is seeking an experienced Product Manager to lead product strategy and execution across our digital banking platforms.",
    responsibilities: [
      "Define product vision and roadmap",
      "Work closely with engineering and design teams",
      "Gather and prioritize customer requirements",
      "Monitor product performance and metrics",
    ],
    requirements: [
      "5+ years of product management experience",
      "Experience in fintech or banking",
      "Strong analytical and communication skills",
      "Ability to lead cross-functional teams",
    ],
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
    description: "Nation Media Group is looking for a creative Graphic Designer to support our marketing and editorial teams with compelling visual content.",
    responsibilities: [
      "Design graphics for print and digital media",
      "Create social media visuals and banners",
      "Collaborate with editorial team on layouts",
      "Maintain brand consistency across all materials",
    ],
    requirements: [
      "1+ years of graphic design experience",
      "Proficiency in Adobe Creative Suite",
      "Strong portfolio of design work",
      "Attention to detail and creativity",
    ],
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
    description: "Twiga Foods is hiring a Data Analyst to help us make data-driven decisions across our supply chain and distribution network.",
    responsibilities: [
      "Analyze large datasets to identify trends",
      "Build dashboards and reports",
      "Support business teams with data insights",
      "Maintain data quality and integrity",
    ],
    requirements: [
      "2+ years of data analysis experience",
      "Proficiency in SQL and Excel",
      "Experience with data visualization tools",
      "Strong attention to detail",
    ],
  },
];

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = jobs.find((j) => j.id === parseInt(id));

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-xl">Job not found.</p>
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

      {/* Job Header */}
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
            KES {job.salaryMin.toLocaleString()} – {job.salaryMax.toLocaleString()}
            <span className="text-gray-400 text-base font-normal ml-2">per month</span>
          </p>
        </div>
      </section>

      {/* Job Details */}
      <section className="max-w-3xl mx-auto px-6 py-12">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">About the Role</h2>
          <p className="text-gray-600 leading-relaxed">{job.description}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Responsibilities</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            {job.responsibilities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Requirements</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            {job.requirements.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <a href="#" className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700">
          Apply Now
        </a>

      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-gray-400 text-sm border-t border-gray-100">
        © 2025 PayClear. Built for a fairer world of work.
      </footer>

    </div>
  );
}