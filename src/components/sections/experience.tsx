"use client";

import { useTranslations, useLocale } from "next-intl";
import { m } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import { experiences } from "@/data/experience";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Experience() {
  const t = useTranslations("experience");
  const locale = useLocale();
  const isKo = locale === "ko";

  return (
    <section id="experience" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading>{t("heading")}</SectionHeading>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px" />

          {experiences.map((exp, i) => {
            const isLeft = i % 2 === 0;
            const isCurrent = !exp.endDate;
            return (
              <m.div
                key={`${exp.company}-${exp.period}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className={cn(
                  "relative mb-12 last:mb-0 pl-12 md:pl-0 md:w-1/2",
                  isLeft
                    ? "md:pr-12 md:ml-0"
                    : "md:pl-12 md:ml-auto"
                )}
              >
                {/* Timeline dot */}
                <div
                  className={cn(
                    "absolute top-1 left-2 h-4 w-4 rounded-full border-2 border-accent bg-background md:top-1",
                    isLeft
                      ? "md:left-auto md:-right-[8px] md:translate-x-0"
                      : "md:-left-[8px]"
                  )}
                >
                  {isCurrent && i === 0 && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-accent/40" />
                  )}
                </div>

                {/* Card */}
                <div className="rounded-xl border border-border bg-card p-5 transition-all hover:border-accent/30 hover:shadow-md">
                  {/* Company & Role */}
                  <h3 className="text-base font-semibold text-foreground">
                    {isKo ? exp.company : exp.companyEn}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-accent">
                    {isKo ? exp.role : exp.roleEn}
                  </p>

                  {/* Meta */}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {isKo ? exp.team : exp.teamEn}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {isKo ? exp.period : exp.periodEn}
                    </span>
                  </div>

                  {/* Description */}
                  <ul className="mt-3 space-y-1.5">
                    {(isKo ? exp.description : exp.descriptionEn).map(
                      (item, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                          {item}
                        </li>
                      )
                    )}
                  </ul>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {exp.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
