import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Hero */}
      <section className="bg-blue-50 px-6 py-28 text-center">
        <p className="text-xs font-semibold text-blue-700 tracking-widest uppercase mb-6">The Global Salary Transparency Platform</p>
        <h1 className="text-5xl font-semibold text-gray-900 leading-tight max-w-2xl mx-auto">
          Every job.<br/>
          <span className="text-blue-700">Every salary.</span><br/>
          No exceptions.
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-lg mx-auto">
          No more guessing. No more wasted interviews. Every listing on PayClear shows a real salary range — always.
        </p>
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <a href="/jobs" className="bg-blue-700 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-blue-800">
            Browse Jobs
          </a>
          <a href="/checkout" className="border border-blue-700 text-blue-700 px-8 py-4 rounded-full text-base font-semibold hover:bg-blue-50">
            Post a Job
          </a>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-y border-gray-100 py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 divide-x divide-gray-100 text-center">
          <div className="px-6">
            <p className="text-3xl font-semibold text-blue-700">2,400+</p>
            <p className="text-sm text-gray-500 mt-1">jobs with salaries</p>
          </div>
          <div className="px-6">
            <p className="text-3xl font-semibold text-blue-700">18,000+</p>
            <p className="text-sm text-gray-500 mt-1">job seekers</p>
          </div>
          <div className="px-6">
            <p className="text-3xl font-semibold text-green-600">100%</p>
            <p className="text-sm text-gray-500 mt-1">salary disclosed</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-14">How PayClear works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold mb-4">1</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Employer posts</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Salary range is required to submit. No range, no listing. We enforce it so you never have to chase it.</p>
              <p className="text-green-600 text-sm font-medium mt-4">Mandatory ✓</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold mb-4">2</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">You browse</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Filter by salary range, job level, industry and location. Know exactly what you are applying for before you click.</p>
              <p className="text-blue-700 text-sm font-medium mt-4">No surprises ✓</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold mb-4">3</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">You apply</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Apply with full confidence knowing exactly what the job pays. No awkward salary conversations. No wasted time.</p>
              <p className="text-green-600 text-sm font-medium mt-4">Fair match ✓</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section id="insights" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-4">Why salary transparency matters</h2>
          <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">The data is clear. Hiding salaries hurts everyone — candidates, employers and the economy.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-2xl p-8 text-center">
              <p className="text-4xl font-semibold text-blue-700 mb-2">80%</p>
              <p className="text-sm text-blue-900 leading-relaxed">of candidates won't apply to a job that doesn't show a salary range</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-8 text-center">
              <p className="text-4xl font-semibold text-green-600 mb-2">20%</p>
              <p className="text-sm text-green-900 leading-relaxed">reduction in pay gaps at companies with full salary transparency</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-8 text-center">
              <p className="text-4xl font-semibold text-blue-700 mb-2">73%</p>
              <p className="text-sm text-blue-900 leading-relaxed">of workers trust employers more when salary ranges are shown upfront</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-blue-700 py-20 px-6 text-center">
        <h2 className="text-3xl font-semibold text-white mb-4">Ready to hire transparently?</h2>
        <p className="text-blue-200 mb-8 max-w-md mx-auto">Join the movement. Post your job with a salary range and attract better candidates faster.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a href="/checkout" className="bg-white text-blue-700 px-8 py-4 rounded-full font-semibold hover:bg-blue-50">
            Post a Job →
          </a>
          <a href="/jobs" className="border border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-800">
            Browse Jobs
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}