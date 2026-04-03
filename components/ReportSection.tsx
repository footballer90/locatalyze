// Components/ReportSection.tsx
"use client";

import { useState } from "react";

interface ReportSectionProps {
  icon: React.ReactNode;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function ReportSection({
  icon,
  title,
  defaultOpen = false,
  children,
}: ReportSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="ui-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4
                   hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-gray-500">{icon}</span>
          <span className="font-semibold text-[14.5px] text-gray-900">{title}</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0
                         ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="pt-5">{children}</div>
        </div>
      )}
    </div>
  );
}