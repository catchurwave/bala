"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

export default function ImageLightbox({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const lastTouchDist = useRef<number | null>(null);

  const clamp = (s: number) => Math.min(Math.max(s, 1), 5);

  const zoom = useCallback((delta: number) => {
    setScale((s) => {
      const next = clamp(s + delta);
      if (next === 1) setPos({ x: 0, y: 0 });
      return next;
    });
  }, []);

  function openLb() {
    setScale(1);
    setPos({ x: 0, y: 0 });
    setOpen(true);
  }

  // ESC + body scroll lock
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "+" || e.key === "=") zoom(0.5);
      if (e.key === "-") zoom(-0.5);
    };
    window.addEventListener("keydown", h);
    return () => {
      window.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [open, zoom]);

  // Mouse wheel zoom
  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    zoom(e.deltaY < 0 ? 0.3 : -0.3);
  }

  // Drag to pan
  function onMouseDown(e: React.MouseEvent) {
    if (scale <= 1) return;
    e.preventDefault();
    isDragging.current = false;
    dragStart.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y };
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!dragStart.current) return;
    isDragging.current = true;
    setPos({
      x: dragStart.current.ox + (e.clientX - dragStart.current.sx),
      y: dragStart.current.oy + (e.clientY - dragStart.current.sy),
    });
  }

  function onMouseUp() {
    dragStart.current = null;
  }

  // Click image to toggle zoom
  function onImgClick() {
    if (isDragging.current) { isDragging.current = false; return; }
    if (scale > 1) { setScale(1); setPos({ x: 0, y: 0 }); }
    else { setScale(2.5); }
  }

  // Touch pinch to zoom
  function getTouchDist(e: React.TouchEvent) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) lastTouchDist.current = getTouchDist(e);
  }

  function onTouchMove(e: React.TouchEvent) {
    if (e.touches.length !== 2 || lastTouchDist.current === null) return;
    const dist = getTouchDist(e);
    const delta = (dist - lastTouchDist.current) * 0.015;
    zoom(delta);
    lastTouchDist.current = dist;
  }

  function onTouchEnd() {
    lastTouchDist.current = null;
  }

  return (
    <>
      {/* Thumbnail trigger — fills parent's relative container */}
      <div className="absolute inset-0 cursor-zoom-in group" onClick={openLb}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/55 backdrop-blur-sm text-white text-[10px] px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
          Agrandir
        </div>
      </div>

      {/* Lightbox */}
      {open && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col" onClick={() => setOpen(false)}>
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-white/50 text-sm truncate max-w-[60vw] font-serif italic">{alt}</span>
            <div className="flex items-center gap-2">
              <span className="text-white/30 text-xs mr-1">{Math.round(scale * 100)}%</span>
              <button
                onClick={() => zoom(-0.5)}
                className="text-white/60 hover:text-white w-9 h-9 flex items-center justify-center border border-white/15 hover:border-white/40 transition text-xl leading-none"
              >−</button>
              <button
                onClick={() => zoom(0.5)}
                className="text-white/60 hover:text-white w-9 h-9 flex items-center justify-center border border-white/15 hover:border-white/40 transition text-xl leading-none"
              >+</button>
              <button
                onClick={() => setOpen(false)}
                className="text-white/60 hover:text-white w-9 h-9 flex items-center justify-center border border-white/15 hover:border-white/40 transition ml-1"
              >✕</button>
            </div>
          </div>

          {/* Image area */}
          <div
            className="flex-1 flex items-center justify-center overflow-hidden"
            onWheel={onWheel}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={(e) => e.stopPropagation()}
            style={{ cursor: scale > 1 ? "grab" : "zoom-in" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              draggable={false}
              onClick={onImgClick}
              style={{
                maxWidth: "92vw",
                maxHeight: "82vh",
                objectFit: "contain",
                userSelect: "none",
                transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                transition: dragStart.current ? "none" : "transform 0.2s ease",
                cursor: scale > 1 ? "grab" : "zoom-in",
              }}
            />
          </div>

          {/* Hint */}
          <p className="text-center py-3 text-white/20 text-[10px] tracking-widest uppercase shrink-0">
            Défilez pour zoomer · Cliquez pour agrandir · ESC pour fermer
          </p>
        </div>
      )}
    </>
  );
}
