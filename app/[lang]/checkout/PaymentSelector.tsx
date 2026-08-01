"use client";

import { useState } from "react";
import CheckoutEmbed from "./CheckoutEmbed";

const TABS = [
  { id: "card", labelFr: "Carte bancaire", labelEn: "Card" },
  { id: "transfer", labelFr: "Virement bancaire", labelEn: "Bank transfer" },
  { id: "cheque", labelFr: "Chèque", labelEn: "Cheque" },
];

export default function PaymentSelector({
  slug,
  titre,
  prix,
  lang,
  iban,
  bic,
  titulaire,
  chequeLibelle,
  chequeAdresse,
}: {
  slug: string;
  titre: string;
  prix: number;
  lang: string;
  iban: string;
  bic: string;
  titulaire: string;
  chequeLibelle: string;
  chequeAdresse: string;
}) {
  const [tab, setTab] = useState<"card" | "transfer" | "cheque">("card");
  const fr = lang === "fr";

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-[#EDE5D4] mb-8">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`px-5 py-3 text-xs tracking-widest uppercase transition-colors border-b-2 -mb-px ${
              tab === t.id
                ? "border-[#C8A96E] text-[#2C2A27]"
                : "border-transparent text-[#A09888] hover:text-[#2C2A27]"
            }`}
          >
            {fr ? t.labelFr : t.labelEn}
          </button>
        ))}
      </div>

      {/* Card */}
      {tab === "card" && (
        <CheckoutEmbed slug={slug} titre={titre} prix={prix} lang={lang} />
      )}

      {/* Virement */}
      {tab === "transfer" && (
        <div className="space-y-6 text-sm text-[#2C2A27]">
          <p className="text-[#6B6560] leading-relaxed">
            {fr
              ? "Effectuez un virement bancaire en utilisant les coordonnées ci-dessous. Indiquez le titre de l'œuvre en référence. Votre commande sera confirmée dès réception du paiement."
              : "Please transfer using the details below. Quote the painting title as reference. Your order will be confirmed upon receipt of payment."}
          </p>
          <dl className="space-y-3 bg-[#FAF7F2] border border-[#EDE5D4] p-6">
            {[
              { label: fr ? "Titulaire" : "Account holder", value: titulaire },
              { label: "IBAN", value: iban },
              { label: "BIC / SWIFT", value: bic },
              { label: fr ? "Référence" : "Reference", value: titre },
              { label: fr ? "Montant" : "Amount", value: prix.toLocaleString(fr ? "fr-FR" : "en-GB", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-xs uppercase tracking-wider text-[#A09888] shrink-0">{label}</dt>
                <dd className="font-mono text-xs text-right">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-xs text-[#A09888]">
            {fr
              ? "Une fois le virement effectué, contactez-nous par email pour confirmer votre commande."
              : "Once transferred, please email us to confirm your order."}
          </p>
        </div>
      )}

      {/* Chèque */}
      {tab === "cheque" && (
        <div className="space-y-6 text-sm text-[#2C2A27]">
          <p className="text-[#6B6560] leading-relaxed">
            {fr
              ? "Envoyez votre chèque à l'ordre de l'artiste à l'adresse ci-dessous. Indiquez le titre de l'œuvre au dos. L'œuvre sera expédiée après encaissement."
              : "Send your cheque payable to the artist at the address below. Write the painting title on the back. The work will ship once the cheque clears."}
          </p>
          <dl className="space-y-3 bg-[#FAF7F2] border border-[#EDE5D4] p-6">
            {[
              { label: fr ? "À l'ordre de" : "Payable to", value: chequeLibelle },
              { label: fr ? "Adresse" : "Address", value: chequeAdresse },
              { label: fr ? "Montant" : "Amount", value: prix.toLocaleString(fr ? "fr-FR" : "en-GB", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-xs uppercase tracking-wider text-[#A09888] shrink-0">{label}</dt>
                <dd className="text-xs text-right whitespace-pre-line">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-xs text-[#A09888]">
            {fr
              ? "Après envoi, contactez-nous par email pour nous prévenir."
              : "After posting, please email us to let us know."}
          </p>
        </div>
      )}
    </div>
  );
}
