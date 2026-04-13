// Components/Hero.tsx
import Link from "next/link";

function MiniBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[12px] text-gray-500">{label}</span>
        <span className="text-[12px] font-semibold text-gray-700">{value}</span>
      </div>
      <div className="ui-score-track">
        <div className="ui-score-fill bg-gray-900" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
      {/* Subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#111 1px,transparent 1px),linear-gradient(90deg,#111 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div className="ui-fade-up">
            <div className="ui-badge-blue mb-6 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
              AI Location Intelligence
            </div>

            <h1 className="text-[44px] md:text-[56px] font-bold leading-[1.07] tracking-[-0.03em] text-gray-900 mb-5">
              Find sites that{" "}
              <span className="text-blue-600 italic not-italic">actually</span>{" "}
              perform.
            </h1>

            <p className="text-[17px] text-gray-500 leading-[1.7] max-w-[440px] mb-10">
              Locatalyze scores every commercial location in your market by predicted
              revenue, foot traffic, and competitive advantage — before you sign a lease.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/onboarding" className="ui-btn-primary ui-btn-lg">
                Start for free
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <button className="ui-btn-secondary ui-btn-lg">Watch demo</button>
            </div>

            <p className="text-[13px] text-gray-400">
              <span className="font-semibold text-gray-700">1,200+</span> operators across 40 markets
            </p>
          </div>

          {/* Right — preview card */}
          <div>
            <div
              className="ui-card overflow-hidden"
              style={{
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.05), 0 16px 40px 0 rgba(0,0,0,0.08)"
              }}
            >
              {/* Fake browser bar */}
              <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-50 border-b border-gray-100">
                <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-300" />
                <div className="flex-1 mx-3 h-5 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-[11px] text-gray-400">app.locatalyze.com</span>
                </div>
              </div>

              {/* Map mock */}
              <div
                className="h-36 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg,#dde8e4 0%,#c8dbd5 100%)" }}
              >
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(#2e6b5a 1px,transparent 1px),linear-gradient(90deg,#2e6b5a 1px,transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
                {[
                  { top: "28%", left: "42%", score: 94, dark: true },
                  { top: "55%", left: "63%", score: 78, dark: false },
                  { top: "40%", left: "22%", score: 61, dark: false },
                ].map((pin, i) => (
                  <div
                    key={i}
                    className="absolute flex flex-col items-center"
                    style={{ top: pin.top, left: pin.left, transform: "translate(-50%,-100%)" }}
                  >
                    <div
                      className="text-[11px] font-bold text-white px-2 py-0.5 rounded-full"
                      style={{ background: pin.dark ? "#111827" : "#6b7280" }}
                    >
                      {pin.score}
                    </div>
                    <div
                      className="w-0 h-0"
                      style={{
                        borderLeft: "4px solid transparent",
                        borderRight: "4px solid transparent",
                        borderTop: `6px solid ${pin.dark ? "#111827" : "#6b7280"}`,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Score bars */}
              <div className="p-5 space-y-3.5">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="font-semibold text-[14px] text-gray-900">420 Crown St, Surry Hills</p>
                    <p className="text-[12px] text-gray-400">Sydney, NSW · Hospitality Strip</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-lg font-bold">94</div>
                </div>
                <MiniBar label="Foot Traffic" value={91} />
                <MiniBar label="Competitor Density" value={72} />
                <MiniBar label="Demand Score" value={87} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}