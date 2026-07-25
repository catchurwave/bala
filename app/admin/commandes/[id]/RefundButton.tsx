"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  sessionId: string;
  maxAmount: number;
  alreadyRefunded: number;
};

const REASONS = [
  { value: "requested_by_customer", label: "Demande du client" },
  { value: "duplicate", label: "Commande en double" },
  { value: "fraudulent", label: "Fraude" },
];

export default function RefundButton({ sessionId, maxAmount, alreadyRefunded }: Props) {
  const router = useRouter();
  const remaining = maxAmount - alreadyRefunded;
  const [mode, setMode] = useState<"full" | "partial">("full");
  const [amount, setAmount] = useState(remaining.toFixed(2));
  const [reason, setReason] = useState("requested_by_customer");
  const [restoreStock, setRestoreStock] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function handleRefund() {
    if (!confirm(`Rembourser ${mode === "full" ? remaining.toLocaleString("fr-FR") : amount} € ? Cette action est irréversible.`)) return;

    setStatus("loading");
    setErrMsg("");

    const body: Record<string, unknown> = {
      reason,
      restore_stock: mode === "full" ? restoreStock : false,
    };
    if (mode === "partial") body.amount = parseFloat(amount);

    const res = await fetch(`/api/admin/commandes/${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    if (res.ok) {
      setStatus("done");
      router.refresh();
    } else {
      setStatus("error");
      setErrMsg(json.error ?? "Erreur inconnue");
    }
  }

  if (status === "done") {
    return <p className="text-[#4A6741] text-sm">✓ Remboursement effectué</p>;
  }

  const inp = "bg-[#1A1917] text-[#D4C9B6] px-3 py-2 border border-[#3D3A36] focus:outline-none focus:border-[#C8A96E] text-sm";

  return (
    <div className="space-y-4">
      {/* Mode */}
      <div className="flex gap-3">
        {(["full", "partial"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`text-xs tracking-widest uppercase px-4 py-2 border transition-colors ${
              mode === m
                ? "bg-[#3D3A36] text-[#D4C9B6] border-[#3D3A36]"
                : "text-[#6B6560] border-[#3D3A36] hover:border-[#6B6560]"
            }`}
          >
            {m === "full" ? `Total (${remaining.toLocaleString("fr-FR")} €)` : "Partiel"}
          </button>
        ))}
      </div>

      {/* Partial amount */}
      {mode === "partial" && (
        <div>
          <label className="block text-xs tracking-widest uppercase text-[#6B6560] mb-2">Montant (€)</label>
          <input
            type="number"
            className={inp}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            max={remaining}
            step="0.01"
          />
        </div>
      )}

      {/* Reason */}
      <div>
        <label className="block text-xs tracking-widest uppercase text-[#6B6560] mb-2">Motif</label>
        <select className={`${inp} w-full`} value={reason} onChange={(e) => setReason(e.target.value)}>
          {REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </div>

      {/* Restore stock (full only) */}
      {mode === "full" && (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={restoreStock}
            onChange={(e) => setRestoreStock(e.target.checked)}
            className="w-4 h-4 accent-[#C8A96E]"
          />
          <span className="text-sm text-[#D4C9B6]">Remettre le tableau en vente</span>
        </label>
      )}

      {errMsg && <p className="text-red-400 text-sm">{errMsg}</p>}

      <button
        onClick={handleRefund}
        disabled={status === "loading"}
        className="border border-red-800 text-red-400 text-sm tracking-widest uppercase px-6 py-3 hover:bg-red-900/20 transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Remboursement en cours..." : "Rembourser"}
      </button>
    </div>
  );
}
