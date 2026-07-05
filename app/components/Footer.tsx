export default function Footer() {
  return (
    <footer className="py-10 px-8 border-t border-gray-100 bg-white">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
            <path d="M18 2 L32 7 L32 20 Q32 30 18 35 Q4 30 4 20 L4 7 Z" fill="#185FA5"/>
            <polyline points="11,18 16,24 26,12" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="28" cy="8" r="5" fill="#1D9E75"/>
          </svg>
          <span className="font-semibold text-gray-900">PayClear</span>
        </div>
        <p className="text-sm text-gray-400">© 2026 PayClear · Built for a fairer world of work · Worldwide</p>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="/jobs" className="hover:text-blue-700">Jobs</a>
          <a href="/post-job" className="hover:text-blue-700">Post a Job</a>
        </div>
      </div>
    </footer>
  );
}