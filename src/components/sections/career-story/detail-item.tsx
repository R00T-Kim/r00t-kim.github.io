import React from "react";
import { type CareerDetailItem } from "@/data/career-detail";

interface DetailItemProps {
  item: CareerDetailItem;
  isKo: boolean;
}

export const DetailItem = React.memo(function DetailItem({ item, isKo }: DetailItemProps) {
  return (
    <li className="flex items-start gap-2 text-sm leading-relaxed text-foreground/85">
      <span aria-hidden="true" className="shrink-0 text-muted-foreground">
        -
      </span>
      <div className="min-w-0">
        <span>{isKo ? item.text : item.textEn}</span>
        {item.subItems && item.subItems.length > 0 && (
          <ul className="mt-1.5 space-y-1 pl-4">
            {item.subItems.map((sub, k) => (
              <li key={k} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <span aria-hidden="true" className="shrink-0">
                  -
                </span>
                {isKo ? sub.text : sub.textEn}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
});
