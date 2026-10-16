"use client";

import { useLocale, useTranslations } from "next-intl";
import { experiences } from "@/data/experience";
import { SectionHeading } from "@/components/ui/section-heading";
import { Bullets, Line, Tags } from "@/components/ui/term";

export function Experience() {
  const t = useTranslations("experience");
  const isKo = useLocale() === "ko";

  return (
    <section id="experience" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading>{t("heading")}</SectionHeading>
        <div className="border-b border-border">
          {experiences.map((exp) => (
            <Line key={`${exp.company}-${exp.period}`} left={isKo ? exp.period : exp.periodEn}>
              <h3 className="text-base font-semibold text-foreground">
                {exp.url ? (
                  <a href={exp.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
                    {isKo ? exp.company : exp.companyEn}
                  </a>
                ) : (
                  <>{isKo ? exp.company : exp.companyEn}</>
                )}
                <span className="font-normal text-muted-foreground"> · {isKo ? exp.team : exp.teamEn}</span>
              </h3>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">{isKo ? exp.role : exp.roleEn}</p>
              <Bullets items={isKo ? exp.description : exp.descriptionEn} className="mt-3" />
              <Tags tags={exp.tags} className="mt-3" />
            </Line>
          ))}
        </div>
      </div>
    </section>
  );
}
