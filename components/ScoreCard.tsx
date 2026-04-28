// Components/ScoreCard.tsx
import Link from "next/link";

type Status = "recommended" | "review" | "pass";

interface ScoreCardProps {
  id: string;          // used to link to /dashboard/[id]
  address: string;
  city: string;
  score: number;
  traffic: number;
  fit: number;
  edge: number;
  status: Status;
}

const STATUS: Record<Status, { label: string; cls: string }> = {
  recommended: { label: "Recommended", cls: "ui-badge-green" },
  review:      { label: "Review",       cls: "ui-badge-yellow" },
  pass:        { label: "Pass",         cls: "ui-badge-gray"  },
};

function Bar({ value }: { value: number }) {
  return (
    <div className="ui-score-track">
      <div className="ui-score-fill bg-gray-900" style={{ width: `${value}%` }} />
    </div>
  );
}

export default function ScoreCard({
  id, address, city, score, traffic, fit, edge, status,
}: ScoreCardProps) {
  const { label, cls } = STATUS[status];
  const ring = score >= 85 ? "bg-gray-900" : score >= 70 ? "bg-gray-600" : "bg-gray-400";

  return (
    <div className="ui-card-p ui-card-hover flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-[14.5px] text-gray-900 truncate">{address}</p>
          <p className="text-[12.5px] text-gray-400 mt-0.5">{city}</p>
        </div>
        <div className={`w-12 h-12 shrink-0 rounded-2xl ${ring}
                         flex items-center justify-center text-white text-[17px] font-bold`}>
          {score}
        </div>
      </div>

      <div className="space-y-2.5">
        {[
          { label: "Traffic", value: traffic },
          { label: "Demo fit", value: fit },
          { label: "Edge", value: edge },
        ].map(({ label: l, value }) => (
          <div key={l}>
            <div className="flex justify-between text-[11.5px] mb-1">
              <span className="text-gray-400">{l}</span>
              <span className="font-medium text-gray-600">{value}</span>
            </div>
            <Bar value={value} />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <span className={cls}>{label}</span>
        {/* Links to your existing dynamic route /dashboard/[id] */}
        <Link href={`/dashboard/${id}?tab=decision`}
          className="text-[12.5px] font-semibold text-gray-500 hover:text-gray-900
                     transition-colors flex items-center gap-1">
          View report
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}