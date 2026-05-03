export function Header() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#1c1917]/95 backdrop-blur-md border-b border-[#ccfbf1] dark:border-[#1e293b]" role="banner">
      <div className="max-w-xl mx-auto px-5 py-4 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0891b2] to-[#059669] flex items-center justify-center shadow-lg shadow-[#0891b2]/20">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#164e63] dark:text-[#f8fafc] leading-tight">
            Dad Tracker
          </h1>
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8] font-medium">
            {today}
          </p>
        </div>
      </div>
    </header>
  );
}
