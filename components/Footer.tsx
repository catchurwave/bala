import Link from "next/link";
import Image from "next/image";

type Dict = {
  footer: { rights: string; made_with: string };
  nav: {
    home: string;
    gallery: string;
    shop: string;
    artist: string;
    contact: string;
  };
};

export default function Footer({
  lang,
  dict,
  bio = {},
}: {
  lang: string;
  dict: Dict;
  bio?: Record<string, string>;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#2C2A27] text-[#D4C9B6] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link href={`/${lang}`} className="inline-block mb-4 hover:opacity-80 transition-opacity">
              <Image
                src="/logo-atelier.png"
                alt={bio.nom_atelier || bio.nom_complet || "L'atelier de Bala"}
                width={160}
                height={54}
                className="h-14 w-auto object-contain brightness-0 invert opacity-80"
              />
            </Link>
            <p className="text-sm leading-relaxed text-[#A09888] max-w-xs">
              {lang === "fr"
                ? (bio.bio_court_fr || "Peintre impressionniste inspiré par la lumière, la nature et la tradition de Sisley.")
                : (bio.bio_court_en || "Impressionist painter inspired by light, nature, and the tradition of Sisley.")}
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs tracking-widest uppercase text-[#C8A96E] mb-6">
              {lang === "fr" ? "Navigation" : "Navigation"}
            </p>
            <nav className="flex flex-col gap-3">
              {[
                { href: `/${lang}`, label: dict.nav.home },
                { href: `/${lang}/galerie`, label: dict.nav.gallery },
                { href: `/${lang}/boutique`, label: dict.nav.shop },
                { href: `/${lang}/artiste`, label: dict.nav.artist },
                { href: `/${lang}/contact`, label: dict.nav.contact },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-[#A09888] hover:text-[#C8A96E] transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs tracking-widest uppercase text-[#C8A96E] mb-6">
              Contact
            </p>
            <Link
              href={`/${lang}/contact`}
              className="btn-outline btn-sm"
              style={{ borderColor: "#C8A96E", color: "#C8A96E", boxShadow: "3px 3px 0 rgba(200,169,110,0.3)" }}
            >
              {lang === "fr" ? "Contacter l'artiste" : "Contact the artist"}
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[#4A4843] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#6B6560]">
          <p>
            © {year} — {dict.footer.rights}
          </p>
          <p className="italic">{dict.footer.made_with}</p>
        </div>
      </div>
    </footer>
  );
}
