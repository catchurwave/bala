// Decorative impressionist ornament elements for section headings and dividers

export function BrushStroke({
  className = "",
  color = "#C8A96E",
  width = 180,
}: {
  className?: string;
  color?: string;
  width?: number;
}) {
  return (
    <svg
      viewBox="0 0 180 14"
      width={width}
      height={14}
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M 2 9 C 18 5, 38 12, 62 7 C 84 3, 106 11, 130 6 C 150 3, 168 9, 178 7"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.75"
      />
      <path
        d="M 8 11 C 30 8, 55 13, 80 9 C 104 5, 128 12, 155 8 C 165 6, 174 10, 178 9"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
      />
    </svg>
  );
}

export function Diamond({
  className = "",
  color = "#C8A96E",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-3 ${className}`}
      aria-hidden="true"
    >
      <span
        className="block h-px w-10 opacity-40"
        style={{ backgroundColor: color }}
      />
      <svg viewBox="0 0 10 10" width="8" height="8" aria-hidden="true">
        <polygon
          points="5,0.5 9.5,5 5,9.5 0.5,5"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.8"
        />
      </svg>
      <span
        className="block h-px w-10 opacity-40"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

export function PaletteDots({
  className = "",
}: {
  className?: string;
}) {
  const colors = ["#C8A96E", "#7BA3B8", "#4A6741", "#8B4513", "#D4C9B6", "#C4674B"];
  return (
    <div className={`flex gap-1.5 ${className}`} aria-hidden="true">
      {colors.map((c, i) => (
        <span
          key={i}
          className="w-3 h-3 rounded-full opacity-70"
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  dark = false,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  dark?: boolean;
  className?: string;
}) {
  const textColor = dark ? "#F7F2E8" : "#2C2A27";
  const eyebrowColor = "#C8A96E";

  return (
    <div className={`text-center ${className}`}>
      {eyebrow && (
        <p
          className="text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: eyebrowColor }}
        >
          {eyebrow}
        </p>
      )}
      <Diamond />
      <h2
        className="font-serif text-4xl md:text-5xl font-light mt-4 mb-3"
        style={{ color: textColor }}
      >
        {title}
      </h2>
      <div className="flex justify-center">
        <BrushStroke />
      </div>
    </div>
  );
}
