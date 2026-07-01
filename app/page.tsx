export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <span className="text-2xl font-bold text-blue-600">PayClear</span>
        <div className="flex gap-4">
          <a href="/jobs" className="text-gray-600 hover:text-blue-600 font-medium">Browse Jobs</a>
          <a href="/post-job" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700">Post a Job</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 py-28 bg-blue-50">
        <h1 className="text-5xl font-bold text-gray-900 max-w-2xl leading-tight">
          Every Job. Every Salary. <span className="text-blue-600">No Exceptions.</span>
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-xl">
          PayClear is the job platform where salary is always shown — no guessing, no wasted interviews, no surprises.
        </p>
        <div className="mt-10 flex gap-4">
          <a href="/jobs" className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700">Browse Jobs</a>
          <a href="/post-job" className="border border-blue-600 text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50">Post a Job</a>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-14">How PayClear Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div>
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800">Employers Post Jobs</h3>
            <p className="mt-2 text-gray-500">Every listing must include a salary range. No range, no posting.</p>
          </div>
          <div>
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800">Job Seekers Browse</h3>
            <p className="mt-2 text-gray-500">Filter by salary, role, level, and location. Know what you're applying for.</p>
          </div>
          <div>
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-gray-800">Better Matches</h3>
            <p className="mt-2 text-gray-500">No surprises. Candidates and employers align from the first click.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-gray-400 text-sm border-t border-gray-100">
        © 2025 PayClear. Built for a fairer world of work.
      </footer>

    </div>
  );
}