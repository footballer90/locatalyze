// Components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <span className="font-semibold text-[15px] text-gray-900 tracking-tight">
            Locatalyze
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-0.5">
          {["Features", "How it works", "Pricing"].map((item) => (
            <a
              key={item}
              href="#"
              className="px-3.5 py-1.5 rounded-xl text-[13.5px] text-gray-500 font-medium
                         hover:text-gray-900 hover:bg-gray-50 transition-all"
            >
              {item}
            </a>
          ))}
          <Link
            href="/sample-report"
            className="px-3.5 py-1.5 rounded-xl text-[13.5px] text-gray-500 font-medium
                       hover:text-gray-900 hover:bg-gray-50 transition-all"
            style={{ textDecoration: 'none' }}
          >
            Sample report
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/dashboard" className="ui-btn-secondary ui-btn-sm hidden sm:inline-flex">
            Dashboard
          </Link>
          <Link href="/onboarding" className="ui-btn-primary ui-btn-sm">
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}