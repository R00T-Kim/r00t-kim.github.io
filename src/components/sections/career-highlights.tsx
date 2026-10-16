"use client";

import { useLocale, useTranslations } from "next-intl";
import { careerHighlights, careerOverview, coreCompetencies, selfDevelopedTools } from "@/data/career-summary";
import { SectionHeading } from "@/components/ui/section-heading";
import { Bullets, Cmd, SubHeading, Tags } from "@/components/ui/term";

export function CareerHighlights() {
  const t = useTranslations("career_highlights");
  const locale = useLocale();
  const isKo = locale === "ko";

  return (
    <section id="career-highlights" className="bg-section-alt py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading>{t("heading")}</SectionHeading>

        <p className="border-l-2 border-accent/60 pl-4 text-sm leading-relaxed text-foreground/85 md:text-base">
          {isKo ? careerOverview.ko : careerOverview.en}
        </p>

        <SubHeading className="mt-12">{t("achievements_label")}</SubHeading>
        <div className="space-y-8">
          {careerHighlights.map((highlight) => (
            <div key={highlight.titleEn}>
              <h4 className="mb-2 text-sm font-semibold text-foreground">
                <span className="text-accent">#### </span>
                {isKo ? highlight.title : highlight.titleEn}
              </h4>
              <Bullets items={isKo ? highlight.items : highlight.itemsEn} />
            </div>
          ))}
        </div>

        <SubHeading>{t("self_developed_tools_label")}</SubHeading>
        <Bullets items={selfDevelopedTools.map((tool) => (isKo ? tool.ko : tool.en))} />

        <SubHeading>{t("competencies_label")}</SubHeading>
        <Tags tags={coreCompetencies.map((item) => (isKo ? item.ko : item.en))} />

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">{t("cta_description")}</p>
          <Cmd href={`/${locale}/career`} internal className="mt-2 text-foreground">
            cat about_me/stories.md
          </Cmd>
        </div>
      </div>
    </section>
  );
}
