import React from "react";
import { type CareerDetailItem } from "@/data/career-detail";

interface DetailItemProps {
  item: CareerDetailItem;
  isKo: boolean;
}

export const DetailItem = React.memo(function DetailItem({
  item,
  isKo,
}: DetailItemProps) {
  return (
    <li className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/80">
      <span
        aria-hidden="true"
        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60"
      />
      <div>
        <span>{isKo ? item.text : item.textEn}</span>
        {item.subItems && item.subItems.length > 0 && (
          <ul className="mt-2 space-y-1.5 pl-3 border-l border-border/50">
            {item.subItems.map((sub, k) => (
              <li
                key={k}
                className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed"
              >
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-secondary/50"
                />
                {isKo ? sub.text : sub.textEn}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
});
