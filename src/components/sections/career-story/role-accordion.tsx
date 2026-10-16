"use client";

import { useState } from "react";
import { type SubSection } from "@/data/career-detail";
import { cn } from "@/lib/utils";
import { DetailItem } from "./detail-item";

interface RoleAccordionProps {
  sub: SubSection;
  isKo: boolean;
  sectionId: string;
  index: number;
}

export function RoleAccordion({ sub, isKo, sectionId, index }: RoleAccordionProps) {
  const [open, setOpen] = useState(false);
  const panelId = `accordion-${sectionId}-${index}`;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={panelId}
        className="group flex w-full items-baseline gap-2 py-2 text-left font-mono text-sm"
      >
        <span aria-hidden="true" className="text-accent">
          {open ? "▾" : "▸"}
        </span>
        <span className={cn("font-semibold transition-colors group-hover:text-accent", open ? "text-accent" : "text-foreground")}>
          {isKo ? sub.title : sub.titleEn}
        </span>
      </button>
      {open && (
        <ul id={panelId} className="mb-3 space-y-2 pl-5">
          {sub.items.map((item, k) => (
            <DetailItem key={k} item={item} isKo={isKo} />
          ))}
        </ul>
      )}
    </div>
  );
}
