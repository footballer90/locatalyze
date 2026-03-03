// Components/FeatureCard.tsx
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags?: string[];
  wide?: boolean;
}

export default function FeatureCard({
  icon, title, description, tags, wide = false,
}: FeatureCardProps) {
  return (
    <div className={`ui-card-p ui-card-hover flex flex-col gap-4 ${
      wide ? "md:col-span-2 md:flex-row md:items-start" : ""
    }`}>
      <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100
                      flex items-center justify-center text-gray-700 shrink-0">
        {icon}
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-[15px] text-gray-900">{title}</h3>
        <p className="text-[13.5px] text-gray-500 leading-relaxed">{description}</p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {tags.map((tag) => (
              <span key={tag} className="ui-badge-gray text-[11px]">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}