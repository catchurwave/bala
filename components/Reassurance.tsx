const icons = {
  shield: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  certificate: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  truck: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  brush: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
};

type Item = { icon: keyof typeof icons; title: string; desc: string };

const items: Record<string, Item[]> = {
  fr: [
    { icon: "brush", title: "Œuvre originale", desc: "Chaque tableau est unique, peint à la main par l'artiste." },
    { icon: "certificate", title: "Certificat d'authenticité", desc: "Signé par l'artiste, inclus avec chaque achat." },
    { icon: "truck", title: "Livraison assurée", desc: "Emballage professionnel, livraison sécurisée partout en France et à l'étranger." },
    { icon: "shield", title: "Paiement sécurisé", desc: "Paiement chiffré via Stripe. Vos données bancaires sont protégées." },
  ],
  en: [
    { icon: "brush", title: "Original artwork", desc: "Each painting is unique, hand-painted by the artist." },
    { icon: "certificate", title: "Certificate of authenticity", desc: "Signed by the artist, included with every purchase." },
    { icon: "truck", title: "Insured delivery", desc: "Professional packaging, secure delivery throughout France and abroad." },
    { icon: "shield", title: "Secure payment", desc: "Encrypted payment via Stripe. Your banking details are protected." },
  ],
};

export default function Reassurance({
  lang,
  variant = "light",
}: {
  lang: string;
  variant?: "light" | "dark";
}) {
  const list = items[lang] ?? items.fr;
  const isDark = variant === "dark";

  return (
    <section className={`py-12 border-t ${isDark ? "border-[#3D3A36] bg-[#2C2A27]" : "border-[#EDE5D4] bg-[#F7F2E8]"}`}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {list.map(({ icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center text-center gap-3">
            <div className={isDark ? "text-[#C8A96E]" : "text-[#C96844]"}>
              {icons[icon]}
            </div>
            <h3 className={`text-sm font-medium tracking-wide ${isDark ? "text-[#D4C9B6]" : "text-[#2C2A27]"}`}>
              {title}
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#6B6560]" : "text-[#A09888]"}`}>
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
