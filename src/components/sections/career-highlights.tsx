"use client";

import { useTranslations, useLocale } from "next-intl";
import { m } from "framer-motion";
import { ArrowRight, Wrench } from "lucide-react";
import Link from "next/link";
import {
  careerOverview,
  careerHighlights,
  coreCompetencies,
  selfDevelopedTools,
} from "@/data/career-summary";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function CareerHighlights() {
  const t = useTranslations("career_highlights");
  const locale = useLocale();
  const isKo = locale === "ko";

  return (
    <section id="career-highlights" className="bg-section-alt py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading>{t("heading")}</SectionHeading>

        {/* Overview */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="mb-12"
        >
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
            {t("overview_label")}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            {isKo ? careerOverview.ko : careerOverview.en}
          </p>
        </m.div>

        {/* Achievements */}
        <m.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-6 text-sm font-semibold uppercase tracking-wider text-accent"
        >
          {t("achievements_label")}
        </m.h3>

        <div className="mb-12 grid gap-4 md:grid-cols-2">
          {careerHighlights.map((highlight, i) => {
            const isLast = i === careerHighlights.length - 1;
            return (
              <m.div
                key={highlight.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className={cn(
                  "rounded-xl border border-border bg-card p-5 transition-colors transition-shadow hover:border-accent/30 hover:shadow-md",
                  isLast && careerHighlights.length % 2 !== 0 && "md:col-span-2"
                )}
              >
                <h4 className="text-base font-semibold text-foreground">
                  {isKo ? highlight.title : highlight.titleEn}
                </h4>
                <ul className="mt-3 space-y-1.5">
                  {(isKo ? highlight.items : highlight.itemsEn).map(
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

                {/* Self-developed tools for the last card */}
                {isLast && (
                  <div className="mt-4 rounded-lg border border-border/60 bg-background/50 p-3">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-accent">
                      <Wrench className="h-3 w-3" />
                      {t("self_developed_tools_label")}
                    </div>
                    <ul className="space-y-1">
                      {selfDevelopedTools.map((tool, k) => (
                        <li
                          key={k}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-secondary/60" />
                          {isKo ? tool.ko : tool.en}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </m.div>
            );
          })}
        </div>

        {/* Core Competencies */}
        <m.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent"
        >
          {t("competencies_label")}
        </m.h3>

        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="mb-12 flex flex-wrap gap-2"
        >
          {coreCompetencies.map((comp, i) => (
            <Badge key={`${comp.ko}-${comp.en}`} variant="accent">
              {isKo ? comp.ko : comp.en}
            </Badge>
          ))}
        </m.div>

        {/* CTA Card */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
        >
          <Link
            href={`/${locale}/career`}
            className="group block rounded-xl border border-accent/30 bg-gradient-to-br from-accent/5 to-accent-secondary/5 p-6 transition-all hover:border-accent/50 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-foreground">
                  {t("cta_title")}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("cta_description")}
                </p>
              </div>
              <div className="flex items-center gap-1 text-accent transition-transform group-hover:translate-x-1">
                <span className="hidden text-sm font-medium sm:inline">
                  {t("cta_button")}
                </span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </Link>
        </m.div>
      </div>
    </section>
  );
}
