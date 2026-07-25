"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { Oeuvre } from "@/lib/oeuvres";

type ModalCtx = {
  oeuvre: Oeuvre | null;
  open: (o: Oeuvre) => void;
  close: () => void;
};

const Ctx = createContext<ModalCtx>({ oeuvre: null, open: () => {}, close: () => {} });

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [oeuvre, setOeuvre] = useState<Oeuvre | null>(null);
  const open = useCallback((o: Oeuvre) => setOeuvre(o), []);
  const close = useCallback(() => setOeuvre(null), []);
  return <Ctx.Provider value={{ oeuvre, open, close }}>{children}</Ctx.Provider>;
}

export const useModal = () => useContext(Ctx);
