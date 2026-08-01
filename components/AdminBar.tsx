import Link from "next/link";

export default function AdminBar({ currentSlug }: { currentSlug?: string }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-9 bg-[#1A1917] border-b border-[#3D3A36] flex items-center px-4 gap-4 text-xs">
      <span className="text-[#C8A96E] font-mono tracking-widest uppercase font-medium">
        ⚙ Admin
      </span>
      <div className="flex items-center gap-3 ml-2">
        <Link href="/admin" className="text-[#A09888] hover:text-[#F7F2E8] transition-colors">
          Dashboard
        </Link>
        <span className="text-[#3D3A36]">·</span>
        <Link href="/admin/oeuvres" className="text-[#A09888] hover:text-[#F7F2E8] transition-colors">
          Œuvres
        </Link>
        <span className="text-[#3D3A36]">·</span>
        <Link href="/admin/commandes" className="text-[#A09888] hover:text-[#F7F2E8] transition-colors">
          Commandes
        </Link>
        <span className="text-[#3D3A36]">·</span>
        <Link href="/admin/artiste" className="text-[#A09888] hover:text-[#F7F2E8] transition-colors">
          Biographie
        </Link>
      </div>
      {currentSlug && (
        <>
          <span className="text-[#3D3A36] ml-auto hidden sm:block">·</span>
          <Link
            href={`/admin/oeuvres/${currentSlug}`}
            className="hidden sm:flex items-center gap-1.5 bg-[#C8A96E] text-[#1A1917] px-3 py-0.5 text-[11px] uppercase tracking-widest font-medium hover:bg-[#E0C97A] transition-colors ml-auto"
          >
            ✏ Modifier ce tableau
          </Link>
        </>
      )}
      <a
        href="/api/admin/logout"
        className="text-[#6B6560] hover:text-red-400 transition-colors ml-auto text-[11px]"
      >
        Déconnexion
      </a>
    </div>
  );
}
