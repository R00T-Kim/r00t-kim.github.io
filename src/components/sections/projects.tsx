"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { m, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { projects } from "@/data/projects";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Projects() {
  const t = useTranslations("projects");
  const tc = useTranslations("common");
  const locale = useLocale();
  const isKo = locale === "ko";
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const isSingle = projects.length === 1;

  const toggle = (i: number) => {
    setExpandedIndex(expandedIndex === i ? null : i);
  };

  return (
    <section id="projects" className="bg-section-alt py-20 md:py-28">
      <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", isSingle ? "max-w-3xl" : "max-w-4xl")}>
        <SectionHeading>{t("heading")}</SectionHeading>

        <div className="space-y-4">
          {projects.map((project, i) => {
            const isOpen = expandedIndex === i;
            return (
              <m.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-colors transition-shadow hover:border-accent/20"
              >
                {/* Header (clickable) */}
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`project-panel-${i}`}
                  aria-label={`${isKo ? project.title : project.titleEn} — ${isOpen ? "collapse" : "expand"}`}
                  className="flex w-full items-start justify-between gap-4 p-5 text-left"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    {/* Subtle left gradient bar on collapsed */}
                    <div aria-hidden="true" className="hidden h-12 w-1 shrink-0 rounded-full bg-gradient-to-b from-accent to-accent-secondary/60 sm:block" />
                    <div className="min-w-0">
                      <h3 id={`project-heading-${i}`} className="text-base font-semibold text-foreground">
                        {isKo ? project.title : project.titleEn}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {isKo ? project.period : project.periodEn}
                      </p>
                      {/* Tags on collapsed view */}
                      {!isOpen && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {project.tags.slice(0, 5).map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 5 && (
                            <span className="text-xs text-muted-foreground">
                              +{project.tags.length - 5}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Expandable detail */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <m.div
                      id={`project-panel-${i}`}
                      role="region"
                      aria-labelledby={`project-heading-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border px-5 pb-5 pt-4 space-y-5">
                        {/* Goals */}
                        <div>
                          <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                            <span aria-hidden="true" className="h-px w-4 bg-accent/40" />
                            {tc("goal")}
                          </h4>
                          <ul className="space-y-1">
                            {(isKo
                              ? project.goals
                              : project.goalsEn
                            ).map((item, j) => (
                              <li
                                key={j}
                                className="flex items-start gap-2 text-sm text-foreground/80"
                              >
                                <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Contents */}
                        <div>
                          <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                            <span aria-hidden="true" className="h-px w-4 bg-accent/40" />
                            {tc("content")}
                          </h4>
                          <ul className="space-y-1">
                            {(isKo
                              ? project.contents
                              : project.contentsEn
                            ).map((item, j) => (
                              <li
                                key={j}
                                className="flex items-start gap-2 text-sm text-foreground/80"
                              >
                                <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Results */}
                        <div>
                          <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-secondary">
                            <span aria-hidden="true" className="h-px w-4 bg-accent-secondary/40" />
                            {tc("result")}
                          </h4>
                          <ul className="space-y-1">
                            {(isKo
                              ? project.results
                              : project.resultsEn
                            ).map((item, j) => (
                              <li
                                key={j}
                                className="flex items-start gap-2 text-sm text-foreground/80"
                              >
                                <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-secondary/60" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Link */}
                        {project.url && (
                          <div className="pt-1">
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {tc("view_more")}
                            </a>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {project.tags.map((tag) => (
                            <Badge key={tag} variant="accent">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
