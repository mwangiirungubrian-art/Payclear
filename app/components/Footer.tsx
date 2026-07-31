export default function Footer() {
  return (
    <footer className="py-10 px-8 border-t border-gray-100 bg-white">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 80 80" fill="none">
            <circle cx="22" cy="58" r="11" fill="none" stroke="#2196F3" strokeWidth="2.5"/>
            <circle cx="22" cy="43" r="7" fill="none" stroke="#2196F3" strokeWidth="2.5"/>
            <circle cx="58" cy="58" r="11" fill="none" stroke="#2196F3" strokeWidth="2.5"/>
            <circle cx="58" cy="43" r="7" fill="none" stroke="#2196F3" strokeWidth="2.5"/>
            <circle cx="40" cy="55" r="14" fill="#2196F3"/>
            <circle cx="40" cy="36" r="10" fill="#2196F3"/>
            <circle cx="52" cy="18" r="8" fill="#4CAF50"/>
            <circle cx="52" cy="18" r="5" fill="#81C784"/>
          </svg>
          <span className="font-semibold text-gray-900">
            lura<span className="text-blue-500">vo</span>
          </span>
        </div>
        <p className="text-sm text-gray-400">© 2026 Luravo · Built for a fairer world of work · Worldwide</p>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="/jobs" className="hover:text-blue-600">Jobs</a>
          <a href="/insights" className="hover:text-blue-600">Salary Insights</a>
          <a href="/checkout" className="hover:text-blue-600">Post a Job</a>
        </div>
      </div>
    </footer>
  );
}