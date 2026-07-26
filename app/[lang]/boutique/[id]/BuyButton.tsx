"use client";

import { useRouter } from "next/navigation";

export default function BuyButton({
  slug,
  lang,
  label,
}: {
  slug: string;
  titre: string;
  prix: number;
  lang: string;
  label: string;
}) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/${lang}/checkout?slug=${slug}`)}
      className="w-full bg-[#2C2A27] text-[#F7F2E8] text-sm tracking-widest uppercase py-4 hover:bg-[#C8A96E] transition-colors duration-300"
    >
      {label}
    </button>
  );
}
