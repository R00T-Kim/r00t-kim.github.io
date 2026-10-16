"use client";

import { useLocale, useTranslations } from "next-intl";
import { communities, talks } from "@/data/speaking";
import { SectionHeading } from "@/components/ui/section-heading";
import { Bracket, Cmd, Line, SubHeading } from "@/components/ui/term";
import { parseDate } from "@/lib/date-utils";

const sortedTalks = [...talks].sort((a, b) => parseDate(b.date) - parseDate(a.date));

export function Speaking() {
  const t = useTranslations("speaking");
  const tc = useTranslations("common");
  const isKo = useLocale() === "ko";

  return (
    <section id="speaking" className="bg-section-alt py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading>{t("heading")}</SectionHeading>

        <SubHeading>{t("talks")}</SubHeading>
        <div className="border-b border-border">
          {sortedTalks.map((talk, i) => (
            <Line key={`${talk.titleEn}-${i}`} left={talk.date}>
              <h4 className="text-sm font-semibold text-foreground md:text-base">
                {isKo ? talk.title : talk.titleEn}
                {talk.highlight && (
                  <>
                    {" "}
                    <Bracket accent>{tc("featured").toLowerCase()}</Bracket>
                  </>
                )}
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">{isKo ? talk.venue : talk.venueEn}</p>
              {(talk.slidesUrl || talk.videoUrl) && (
                <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                  {talk.slidesUrl && <Cmd href={talk.slidesUrl}>open slides.pdf</Cmd>}
                  {talk.videoUrl && <Cmd href={talk.videoUrl}>play video</Cmd>}
                </p>
              )}
            </Line>
          ))}
        </div>

        <SubHeading>{t("community")}</SubHeading>
        <div className="border-b border-border">
          {communities.map((com, i) => (
            <Line key={`${com.organizationEn}-${i}`} left={isKo ? com.period : com.periodEn}>
              <h4 className="text-sm font-semibold text-foreground">
                {isKo ? com.organization : com.organizationEn}
                {com.active && (
                  <>
                    {" "}
                    <Bracket accent>{tc("active")}</Bracket>
                  </>
                )}
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">{isKo ? com.role : com.roleEn}</p>
            </Line>
          ))}
        </div>
      </div>
    </section>
  );
}
