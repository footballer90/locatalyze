"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

function PinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function HomeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}
function TargetIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  );
}
function FileIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
    </svg>
  );
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: <HomeIcon /> },
  { href: "/dashboard#sites", label: "Site Scores", icon: <PinIcon /> },
  { href: "/dashboard#traffic", label: "Foot Traffic", icon: <ChartIcon /> },
  { href: "/dashboard#competition", label: "Competition", icon: <TargetIcon /> },
  { href: "/report", label: "Reports", icon: <FileIcon /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] shrink-0 h-screen sticky top-0 flex flex-col bg-white border-r border-gray-100 py-5 px-3">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 px-3 mb-7">
        <span className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
        </span>
        <span className="font-semibold text-[15px] text-gray-900 tracking-tight">Locatalyze</span>
      </Link>

      {/* Section label */}
      <p className="ui-section-label px-3 mb-2">Navigation</p>

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href.split("#")[0]));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all ${
                isActive
                  ? "bg-neutral-75 text-gray-900"
                  : "text-gray-500 hover:text-gray-800 hover:bg-neutral-50"
              }`}
            >
              <span className={isActive ? "text-gray-900" : "text-gray-400"}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User chip */}
      <div className="mt-4 px-1">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-neutral-50 border border-gray-100">
          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[11px] font-bold text-gray-600 shrink-0">
            JD
          </div>
          <div className="min-w-0">
            <p className="text-[12.5px] font-semibold text-gray-800 truncate leading-tight">Jane Doe</p>
            <p className="text-[11px] text-gray-400 truncate leading-tight">Growth plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}