"use client";

export default function SizeVisualizer({
  dimensions,
  lang,
}: {
  dimensions: string;
  lang: string;
}) {
  const match = dimensions.match(/(\d+(?:[.,]\d+)?)\s*[×xX×]\s*(\d+(?:[.,]\d+)?)/);
  if (!match) return null;

  const paintW = parseFloat(match[1].replace(",", "."));
  const paintH = parseFloat(match[2].replace(",", "."));
  if (!paintW || !paintH) return null;

  const REF_H = 175; // person height cm
  const SVG_H = 200;
  const GROUND = SVG_H - 28;
  const MARGIN_L = 28;
  const PERSON_W = 22;
  const GAP = 32;

  // Scale to fit tallest element in available height
  const availH = GROUND - 12;
  const maxH = Math.max(paintH, REF_H);
  const pxPerCm = availH / maxH;

  const pW = paintW * pxPerCm;
  const pH = paintH * pxPerCm;
  const personH = REF_H * pxPerCm;

  const paintX = MARGIN_L;
  const paintY = GROUND - pH;
  const personX = MARGIN_L + pW + GAP;
  const personY = GROUND - personH;
  const SVG_W = personX + PERSON_W + MARGIN_L;

  const cx = personX + PERSON_W / 2;
  const headR = 7;

  return (
    <div className="bg-[#F7F2E8] border border-[#EDE5D4] p-4">
      <p className="text-[10px] tracking-[0.2em] uppercase text-[#A09888] mb-3">
        {lang === "fr" ? "Dimensions réelles" : "Actual dimensions"}
      </p>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full"
        style={{ maxHeight: 180 }}
        aria-hidden="true"
      >
        {/* Ground line */}
        <line x1={MARGIN_L - 8} y1={GROUND} x2={SVG_W - MARGIN_L + 8} y2={GROUND} stroke="#D4C9B6" strokeWidth="1" />

        {/* ── Painting ── */}
        {/* Outer frame */}
        <rect x={paintX} y={paintY} width={pW} height={pH} fill="#EDE5D4" stroke="#C8A96E" strokeWidth="3" />
        {/* Inner mat */}
        {pW > 14 && pH > 14 && (
          <rect x={paintX + 5} y={paintY + 5} width={pW - 10} height={pH - 10} fill="#E8DFCF" stroke="#C8A96E" strokeWidth="0.5" opacity="0.6" />
        )}

        {/* Width arrow */}
        <line x1={paintX} y1={GROUND + 10} x2={paintX + pW} y2={GROUND + 10} stroke="#C8A96E" strokeWidth="0.8" />
        <line x1={paintX} y1={GROUND + 7} x2={paintX} y2={GROUND + 13} stroke="#C8A96E" strokeWidth="0.8" />
        <line x1={paintX + pW} y1={GROUND + 7} x2={paintX + pW} y2={GROUND + 13} stroke="#C8A96E" strokeWidth="0.8" />
        <text x={paintX + pW / 2} y={GROUND + 21} textAnchor="middle" fontSize="9" fill="#A09888" fontFamily="serif">
          {paintW} cm
        </text>

        {/* Height arrow */}
        {pW > 10 && (
          <>
            <line x1={paintX - 10} y1={paintY} x2={paintX - 10} y2={GROUND} stroke="#C8A96E" strokeWidth="0.8" />
            <line x1={paintX - 13} y1={paintY} x2={paintX - 7} y2={paintY} stroke="#C8A96E" strokeWidth="0.8" />
            <line x1={paintX - 13} y1={GROUND} x2={paintX - 7} y2={GROUND} stroke="#C8A96E" strokeWidth="0.8" />
            {pH > 18 && (
              <text
                x={paintX - 14}
                y={paintY + pH / 2 + 4}
                textAnchor="middle"
                fontSize="9"
                fill="#A09888"
                fontFamily="serif"
                transform={`rotate(-90 ${paintX - 14} ${paintY + pH / 2})`}
              >
                {paintH} cm
              </text>
            )}
          </>
        )}

        {/* ── Person silhouette ── */}
        {/* Head */}
        <ellipse cx={cx} cy={personY + headR + 1} rx={headR - 1} ry={headR} fill="#C8C0B0" />
        {/* Neck */}
        <rect x={cx - 3} y={personY + headR * 2} width="6" height="5" fill="#C8C0B0" />
        {/* Torso */}
        <rect x={cx - PERSON_W / 2 + 1} y={personY + headR * 2 + 4} width={PERSON_W - 2} height={personH * 0.34} rx="3" fill="#C8C0B0" />
        {/* Left arm */}
        <rect x={cx - PERSON_W / 2 - 4} y={personY + headR * 2 + 5} width="5" height={personH * 0.25} rx="2" fill="#C8C0B0" />
        {/* Right arm */}
        <rect x={cx + PERSON_W / 2 - 1} y={personY + headR * 2 + 5} width="5" height={personH * 0.25} rx="2" fill="#C8C0B0" />
        {/* Left leg */}
        <rect x={cx - PERSON_W / 2 + 2} y={personY + headR * 2 + 4 + personH * 0.34} width={(PERSON_W - 6) / 2} height={personH * 0.37} rx="2" fill="#C8C0B0" />
        {/* Right leg */}
        <rect x={cx + 1} y={personY + headR * 2 + 4 + personH * 0.34} width={(PERSON_W - 6) / 2} height={personH * 0.37} rx="2" fill="#C8C0B0" />

        {/* Person label */}
        <text x={cx} y={GROUND + 21} textAnchor="middle" fontSize="9" fill="#C8C0B0" fontFamily="serif">
          175 cm
        </text>
      </svg>

      <p className="text-xs text-[#6B6560] mt-2 font-serif italic text-center">
        {paintW} × {paintH} cm
      </p>
    </div>
  );
}
