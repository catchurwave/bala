"use client";

import { createContext, useContext, useState, useCallback } from "react";

export type OeuvrePreview = {
  slug: string;
  titre: string;
  titre_en: string;
  annee: number;
  technique: string;
  dimensions: string;
  categorie: string;
  image: string;
  prix?: number | null;
  disponible: boolean;
  description: string;
  description_en: string;
};

type ModalCtx = {
  oeuvre: OeuvrePreview | null;
  open: (o: OeuvrePreview) => void;
  close: () => void;
};

const Ctx = createContext<ModalCtx>({ oeuvre: null, open: () => {}, close: () => {} });

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [oeuvre, setOeuvre] = useState<OeuvrePreview | null>(null);
  const open = useCallback((o: OeuvrePreview) => setOeuvre(o), []);
  const close = useCallback(() => setOeuvre(null), []);
  return <Ctx.Provider value={{ oeuvre, open, close }}>{children}</Ctx.Provider>;
}

export const useModal = () => useContext(Ctx);
