"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Consent = { necessary: true; analytics: boolean; marketing: boolean };

const COOKIE_KEY = "rgpd_consent";
const COOKIE_MAX_AGE = 365 * 24 * 3600;

function saveConsent(c: Consent) {
  const val = encodeURIComponent(JSON.stringify(c));
  document.cookie = `${COOKIE_KEY}=${val}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  localStorage.setItem(COOKIE_KEY, JSON.stringify(c));
}

function getStoredConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(COOKIE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function CookieBanner({ lang }: { lang: string }) {
  const [show, setShow] = useState(false);
  const [panel, setPanel] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) setShow(true);
  }, []);

  function acceptAll() {
    saveConsent({ necessary: true, analytics: true, marketing: true });
    setShow(false);
  }

  function refuseAll() {
    saveConsent({ necessary: true, analytics: false, marketing: false });
    setShow(false);
  }

  function saveCustom() {
    saveConsent({ necessary: true, analytics, marketing });
    setShow(false);
  }

  const t = lang === "fr"
    ? {
        title: "Nous respectons votre vie privée",
        desc: "Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic. Vous pouvez personnaliser vos préférences.",
        acceptAll: "Tout accepter",
        refuseAll: "Tout refuser",
        customize: "Personnaliser",
        save: "Enregistrer mes choix",
        necessary: "Nécessaires",
        necessaryDesc: "Indispensables au fonctionnement du site (panier, session). Ne peuvent pas être désactivés.",
        analytics: "Analytiques",
        analyticsDesc: "Nous aident à comprendre comment le site est utilisé (pages visitées, temps passé).",
        marketing: "Marketing",
        marketingDesc: "Permettent d'afficher des contenus personnalisés et des publicités ciblées.",
        policy: "Politique de confidentialité",
      }
    : {
        title: "We respect your privacy",
        desc: "We use cookies to improve your experience and analyse traffic. You can customise your preferences.",
        acceptAll: "Accept all",
        refuseAll: "Refuse all",
        customize: "Customise",
        save: "Save my choices",
        necessary: "Necessary",
        necessaryDesc: "Essential for the site to function (cart, session). Cannot be disabled.",
        analytics: "Analytics",
        analyticsDesc: "Help us understand how the site is used (pages visited, time spent).",
        marketing: "Marketing",
        marketingDesc: "Allow personalised content and targeted advertising to be displayed.",
        policy: "Privacy policy",
      };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center md:justify-end pointer-events-none">
      <div
        className="pointer-events-auto w-full md:max-w-md md:m-6 bg-[#2C2A27] border border-[#3D3A36] shadow-2xl"
        role="dialog"
        aria-label="Préférences cookies"
      >
        {!panel ? (
          /* Simple banner */
          <div className="p-6">
            <p className="font-serif text-lg text-[#F7F2E8] mb-2">{t.title}</p>
            <p className="text-sm text-[#A09888] leading-relaxed mb-5">{t.desc}</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={acceptAll}
                className="bg-[#C8A96E] text-[#1A1917] text-xs tracking-widest uppercase py-3 px-6 hover:bg-[#A88748] transition-colors"
              >
                {t.acceptAll}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={refuseAll}
                  className="flex-1 border border-[#4A4843] text-[#A09888] text-xs tracking-widest uppercase py-2.5 px-4 hover:border-[#6B6560] hover:text-[#D4C9B6] transition-colors"
                >
                  {t.refuseAll}
                </button>
                <button
                  onClick={() => setPanel(true)}
                  className="flex-1 border border-[#4A4843] text-[#A09888] text-xs tracking-widest uppercase py-2.5 px-4 hover:border-[#6B6560] hover:text-[#D4C9B6] transition-colors"
                >
                  {t.customize}
                </button>
              </div>
            </div>
            <Link
              href={`/${lang}/confidentialite`}
              className="block text-center text-xs text-[#4A4843] mt-4 hover:text-[#6B6560] underline"
            >
              {t.policy}
            </Link>
          </div>
        ) : (
          /* Detailed panel */
          <div className="p-6">
            <button
              onClick={() => setPanel(false)}
              className="text-[#6B6560] text-xs mb-4 hover:text-[#D4C9B6] flex items-center gap-1"
            >
              ← Retour
            </button>
            <p className="font-serif text-lg text-[#F7F2E8] mb-5">{t.customize}</p>

            <div className="space-y-4 mb-6">
              {/* Necessary — always on */}
              <div className="flex items-start justify-between gap-4 py-3 border-b border-[#3D3A36]">
                <div>
                  <p className="text-sm text-[#D4C9B6] font-medium">{t.necessary}</p>
                  <p className="text-xs text-[#6B6560] mt-1 leading-relaxed">{t.necessaryDesc}</p>
                </div>
                <div className="shrink-0 bg-[#4A6741] text-white text-xs px-2 py-0.5 mt-0.5">ON</div>
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between gap-4 py-3 border-b border-[#3D3A36]">
                <div>
                  <p className="text-sm text-[#D4C9B6] font-medium">{t.analytics}</p>
                  <p className="text-xs text-[#6B6560] mt-1 leading-relaxed">{t.analyticsDesc}</p>
                </div>
                <button
                  onClick={() => setAnalytics((v) => !v)}
                  className={`shrink-0 mt-0.5 w-11 h-6 rounded-full transition-colors relative ${
                    analytics ? "bg-[#C8A96E]" : "bg-[#3D3A36]"
                  }`}
                  aria-checked={analytics}
                  role="switch"
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      analytics ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-start justify-between gap-4 py-3">
                <div>
                  <p className="text-sm text-[#D4C9B6] font-medium">{t.marketing}</p>
                  <p className="text-xs text-[#6B6560] mt-1 leading-relaxed">{t.marketingDesc}</p>
                </div>
                <button
                  onClick={() => setMarketing((v) => !v)}
                  className={`shrink-0 mt-0.5 w-11 h-6 rounded-full transition-colors relative ${
                    marketing ? "bg-[#C8A96E]" : "bg-[#3D3A36]"
                  }`}
                  aria-checked={marketing}
                  role="switch"
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      marketing ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            <button
              onClick={saveCustom}
              className="w-full bg-[#C8A96E] text-[#1A1917] text-xs tracking-widest uppercase py-3 hover:bg-[#A88748] transition-colors"
            >
              {t.save}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
