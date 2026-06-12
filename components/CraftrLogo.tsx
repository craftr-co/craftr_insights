"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { playfair } from "@/lib/fonts";

export function CraftrLogo({ className, size = "lg" }: { className?: string; size?: "sm" | "lg" }) {
  const dims = size === "lg" ? { w: 200, h: 200 } : { w: 120, h: 120 };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative overflow-hidden rounded-2xl border border-craftr-border bg-craftr-card p-3 shadow-glow">
        <Image
          src="/logo.png"
          alt="Craftr logo"
          width={dims.w}
          height={dims.h}
          className={cn("object-contain", size === "lg" ? "h-24 w-24" : "h-16 w-16")}
          priority
        />
      </div>
      <span className={cn(playfair.className, "text-2xl font-bold tracking-tight text-craftr-text")}>
        Craftr
      </span>
    </div>
  );
}

export function CraftrNavbarLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 44"
      preserveAspectRatio="xMinYMid meet"
      className={cn("aspect-[160/44] h-9 w-auto max-w-[140px]", className)}
      aria-hidden
    >
      <g transform="translate(4,2)">
        <polygon points="18,2 34,11 34,29 18,38 2,29 2,11" fill="#FF6B35" />
        <polygon points="18,2 34,11 18,20 2,11" fill="#FFB347" />
        <polygon points="18,20 34,11 34,29 18,38" fill="#CC5220" />
        <line x1="18" y1="2" x2="18" y2="38" stroke="#0D0D0D" strokeWidth="1.2" />
        <line x1="18" y1="2" x2="6" y2="16" stroke="#FFD4A0" strokeWidth="0.8" opacity=".4" />
        <line x1="18" y1="2" x2="30" y2="16" stroke="#FFD4A0" strokeWidth="0.8" opacity=".4" />
      </g>
      <text
        x="48"
        y="26"
        className={playfair.className}
        fontSize="22"
        fontWeight="700"
        fill="#E8E8E0"
      >
        Craftr
      </text>
    </svg>
  );
}
