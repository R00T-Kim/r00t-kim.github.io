"use client";

import { useLocale, useTranslations } from "next-intl";
import { publications } from "@/data/publications";
import { SectionHeading } from "@/components/ui/section-heading";
import { Bracket, Cmd, Line } from "@/components/ui/term";
import { cn } from "@/lib/utils";

export function Publications() {
  const t = useTranslations("publications");
  const isKo = useLocale() === "ko";

  return (
    <section id="publications" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading>{t("heading")}</SectionHeading>
        <div className="border-b border-border">
          {publications.map((pub, i) => {
            const names = isKo ? pub.authors : pub.authorsEn;
            return (
              <Line key={pub.titleEn} left={<>[{i + 1}] {pub.date}</>}>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <Bracket accent>{pub.type === "journal" ? t("journal") : t("conference")}</Bracket>
                  {pub.firstAuthor && <Bracket accent>{t("first_author")}</Bracket>}
                  {pub.award && <Bracket>{isKo ? pub.award : pub.awardEn}</Bracket>}
                </p>
                <h3 className="mt-1.5 text-sm font-semibold leading-snug text-foreground md:text-base">
                  {isKo ? pub.title : pub.titleEn}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {names.map((name, j) => (
                    <span key={`${name}-${j}`}>
                      <span className={cn(j === pub.authorIndex && "font-semibold text-foreground")}>{name}</span>
                      {j < names.length - 1 && ", "}
                    </span>
                  ))}
                </p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{isKo ? pub.venue : pub.venueEn}</p>
                {(pub.doi || pub.links?.length) && (
                  <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                    {pub.doi && <Cmd href={`https://doi.org/${pub.doi}`}>open doi:{pub.doi}</Cmd>}
                    {pub.links?.map((link) => (
                      <Cmd key={link.url} href={link.url}>
                        open {(isKo ? link.label : link.labelEn).toLowerCase()}
                      </Cmd>
                    ))}
                  </p>
                )}
              </Line>
            );
          })}
        </div>
      </div>
    </section>
  );
}
