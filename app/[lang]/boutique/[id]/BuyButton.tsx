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
      className="btn-primary w-full text-center"
      style={{ padding: "1rem 2rem" }}
    >
      {label}
    </button>
  );
}
