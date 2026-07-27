"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

type Dict = {
  nav: {
    home: string;
    gallery: string;
    shop: string;
    artist: string;
    contact: string;
  };
};

export default function Navigation({
  lang,
  dict,
  artistName = "L'atelier de Bala",
}: {
  lang: string;
  dict: Dict;
  artistName?: string;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const otherLang = lang === "fr" ? "en" : "fr";
  const otherPath = pathname.replace(`/${lang}`, `/${otherLang}`);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/galerie`, label: dict.nav.gallery },
    { href: `/${lang}/boutique`, label: dict.nav.shop },
    { href: `/${lang}/artiste`, label: dict.nav.artist },
    { href: `/${lang}/contact`, label: dict.nav.contact },
    { href: `/${lang}/mon-compte`, label: lang === "fr" ? "Mon compte" : "My account", icon: true },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== `/${lang}` && pathname.startsWith(href));

  const isHome = pathname === `/${lang}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#F7F2E8]/95 backdrop-blur-sm shadow-sm border-b border-[#EDE5D4]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo — hidden on homepage, shown on all other pages */}
        <Link
          href={`/${lang}`}
          className={`shrink-0 hover:opacity-85 transition-opacity ${isHome ? "invisible pointer-events-none" : ""}`}
          tabIndex={isHome ? -1 : undefined}
          aria-hidden={isHome}
        >
          <Image
            src="/logo-atelier.png"
            alt={artistName}
            width={210}
            height={70}
            className="h-14 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            "icon" in link && link.icon ? (
              <Link
                key={link.href}
                href={link.href}
                title={link.label}
                className={`transition-colors ${isActive(link.href) ? "text-[#C8A96E]" : "text-[#4A4843] hover:text-[#C8A96E]"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-widest uppercase transition-colors ${
                  isActive(link.href) ? "text-[#C8A96E]" : "text-[#4A4843] hover:text-[#C8A96E]"
                }`}
              >
                {link.label}
              </Link>
            )
          ))}

          {/* Lang switcher */}
          <Link
            href={otherPath}
            className="btn-outline btn-sm"
            style={{ padding: "0.35rem 0.75rem", fontSize: "0.6rem" }}
          >
            {otherLang.toUpperCase()}
          </Link>
        </div>

        {/* Mobile hamburger — 3 coups de pinceau */}
        <button
          className="md:hidden text-[#2C2A27] hover:text-[#C96844] transition-colors duration-200 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? (
            <svg className="w-7 h-6" viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4,4 C9,7 19,17 24,20" />
              <path d="M24,4 C19,7 9,17 4,20" />
            </svg>
          ) : (
            <svg className="w-7 h-6" viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M2,5 C8,4 17,6 26,5" />
              <path d="M2,12 C7,11 20,13 26,12" />
              <path d="M2,19 C9,18 18,20 26,19" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#F7F2E8]/98 backdrop-blur-sm border-t border-[#EDE5D4] px-6 py-6 flex flex-col gap-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm tracking-widest uppercase ${
                isActive(link.href) ? "text-[#C8A96E]" : "text-[#4A4843]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={otherPath}
            onClick={() => setMenuOpen(false)}
            className="btn-outline btn-sm self-start"
          >
            {otherLang.toUpperCase()}
          </Link>
        </div>
      )}
    </header>
  );
}
