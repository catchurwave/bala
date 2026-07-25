import { dbGetSubscribers } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NewsletterAdminPage() {
  let subscribers: Awaited<ReturnType<typeof dbGetSubscribers>> = [];
  try {
    subscribers = await dbGetSubscribers();
  } catch {
    return (
      <div className="bg-red-900/20 border border-red-800 p-6 text-sm text-red-300">
        <p className="font-medium">⚠ DB non configurée — lance <code>/api/admin/setup</code> d&apos;abord.</p>
      </div>
    );
  }

  const csvData = `email,langue,date\n${subscribers.map((s) => `${s.email},${s.lang},${s.subscribed_at}`).join("\n")}`;
  const csvB64 = Buffer.from(csvData).toString("base64");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#F7F2E8] font-light">Newsletter</h1>
          <p className="text-[#6B6560] text-sm mt-1">{subscribers.length} abonné{subscribers.length > 1 ? "s" : ""}</p>
        </div>
        {subscribers.length > 0 && (
          <a
            href={`data:text/csv;base64,${csvB64}`}
            download="newsletter-subscribers.csv"
            className="border border-[#C8A96E] text-[#C8A96E] text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-[#C8A96E] hover:text-[#1A1917] transition-colors"
          >
            ⬇ Exporter CSV
          </a>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total", value: subscribers.length, color: "text-[#C8A96E]" },
          { label: "FR", value: subscribers.filter((s) => s.lang === "fr").length, color: "text-[#7BA3B8]" },
          { label: "EN", value: subscribers.filter((s) => s.lang === "en").length, color: "text-[#4A6741]" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#2C2A27] border border-[#3D3A36] p-5">
            <p className={`font-serif text-3xl font-light ${color}`}>{value}</p>
            <p className="text-xs tracking-widest uppercase text-[#6B6560] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {subscribers.length === 0 ? (
        <div className="bg-[#2C2A27] border border-[#3D3A36] p-12 text-center">
          <p className="font-serif text-xl italic text-[#6B6560]">Aucun abonné pour l&apos;instant</p>
        </div>
      ) : (
        <div className="bg-[#2C2A27] border border-[#3D3A36] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#3D3A36]">
                {["Email", "Langue", "Date d'inscription"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs tracking-widest uppercase text-[#6B6560]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.email} className="border-b border-[#3D3A36]/40 hover:bg-[#3D3A36]/20">
                  <td className="px-4 py-3 text-[#D4C9B6]">{s.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-[#C8A96E] border border-[#C8A96E]/40 px-2 py-0.5">
                      {s.lang.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6B6560]">
                    {new Date(s.subscribed_at).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "long", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
