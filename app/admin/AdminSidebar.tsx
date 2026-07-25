"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/admin", label: "Tableau de bord", icon: "⊞" },
  { href: "/admin/oeuvres", label: "Œuvres", icon: "🖼" },
  { href: "/admin/oeuvres/new", label: "Ajouter une œuvre", icon: "+" },
  { href: "/admin/artiste", label: "Biographie", icon: "✍" },
  { href: "/admin/newsletter", label: "Newsletter", icon: "✉" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#111009] border-r border-[#2C2A27] flex flex-col">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-[#2C2A27]">
        <Link href="/" className="font-serif text-2xl italic text-[#C8A96E]">
          Atelier
        </Link>
        <p className="text-xs tracking-widest uppercase text-[#4A4843] mt-1">
          Back office
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
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

      {/* Links to site */}
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
  );
}
