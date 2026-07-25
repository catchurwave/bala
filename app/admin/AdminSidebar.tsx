"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const nav = [
  { href: "/admin", label: "Tableau de bord", icon: "⊞" },
  { href: "/admin/commandes", label: "Commandes", icon: "📦" },
  { href: "/admin/oeuvres", label: "Œuvres", icon: "🖼" },
  { href: "/admin/oeuvres/new", label: "Ajouter une œuvre", icon: "+" },
  { href: "/admin/artiste", label: "Biographie", icon: "✍" },
  { href: "/admin/newsletter", label: "Newsletter", icon: "✉" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => { setOpen(false); }, [pathname]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      {/* Mobile hamburger — fixed top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#111009] border-b border-[#2C2A27] flex items-center px-4 gap-4">
        <button
          onClick={() => setOpen(true)}
          className="text-[#C8A96E] p-1"
          aria-label="Ouvrir le menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-serif italic text-[#C8A96E] text-xl">Atelier</span>
        <span className="text-xs tracking-widest uppercase text-[#4A4843]">Back office</span>
      </div>

      {/* Overlay backdrop (mobile) */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-[#111009] border-r border-[#2C2A27] flex flex-col z-50
          transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo + close button on mobile */}
        <div className="px-6 py-8 border-b border-[#2C2A27] flex items-start justify-between">
          <div>
            <Link href="/" className="font-serif text-2xl italic text-[#C8A96E]">
              Atelier
            </Link>
            <p className="text-xs tracking-widest uppercase text-[#4A4843] mt-1">Back office</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-[#4A4843] hover:text-[#D4C9B6] p-1 mt-1"
            aria-label="Fermer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {nav.map(({ href, label, icon }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-[#2C2A27] text-[#C8A96E]"
                    : "text-[#6B6560] hover:text-[#D4C9B6] hover:bg-[#2C2A27]/50"
                }`}
              >
                <span className="text-base w-5 text-center">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer links */}
        <div className="px-4 py-4 border-t border-[#2C2A27] space-y-1">
          <a
            href="/fr"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 text-xs text-[#4A4843] hover:text-[#6B6560] transition-colors"
          >
            <span>↗</span> Voir le site (FR)
          </a>
          <a
            href="/en"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 text-xs text-[#4A4843] hover:text-[#6B6560] transition-colors"
          >
            <span>↗</span> View site (EN)
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-xs text-[#4A4843] hover:text-red-400 transition-colors w-full text-left"
          >
            <span>⏻</span> Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
