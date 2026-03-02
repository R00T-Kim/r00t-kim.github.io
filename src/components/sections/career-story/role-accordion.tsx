"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { type SubSection } from "@/data/career-detail";
import { cn } from "@/lib/utils";
import { DetailItem } from "./detail-item";

interface RoleAccordionProps {
  sub: SubSection;
  isKo: boolean;
  sectionId: string;
  index: number;
}

export function RoleAccordion({
  sub,
  isKo,
  sectionId,
  index,
}: RoleAccordionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border shadow-sm transition-all duration-200",
        open
          ? "border-accent/40 bg-accent/5 shadow-accent/10"
          : "border-border/60 bg-card hover:shadow-md hover:border-border"
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`accordion-${sectionId}-${index}`}
        className="group flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-all hover:bg-accent/5 cursor-pointer"
      >
        <span
          className={cn(
            "text-sm font-semibold transition-colors",
            open
              ? "text-accent"
              : "text-foreground group-hover:text-accent"
          )}
        >
          {isKo ? sub.title : sub.titleEn}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "h-5 w-5 shrink-0 text-accent transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={`accordion-${sectionId}-${index}`}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/40 px-5 pb-5 pt-3">
              <ul className="space-y-3">
                {sub.items.map((item, j) => (
                  <DetailItem key={j} item={item} isKo={isKo} />
                ))}
              </ul>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
