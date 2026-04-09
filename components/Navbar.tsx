// Components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#0F766E,#14B8A6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 26 26" fill="none">
              <path d="M13 2C13 2 5.5 9 5.5 14.2C5.5 18.5 8.8 22 13 22C17.2 22 20.5 18.5 20.5 14.2C20.5 9 13 2 13 2Z" fill="white" opacity="0.95"/>
              <circle cx="13" cy="14.5" r="4" fill="rgba(0,0,0,0.22)"/>
            </svg>
          </span>
          <span className="font-semibold text-[15px] text-gray-900 tracking-tight">
            Loca<span style={{ color: '#0F766E' }}>talyze</span>
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