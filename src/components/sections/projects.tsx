"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { projects } from "@/data/projects";
import { SectionHeading } from "@/components/ui/section-heading";
import { Bullets, Cmd, Tags } from "@/components/ui/term";
import { cn } from "@/lib/utils";

function dirName(project: { dir?: string; title: string }): string {
  return project.dir ?? project.title.split(" - ")[0].trim().replace(/\s+/g, "_");
}

export function Projects({ showHeading = true }: { showHeading?: boolean }) {
  const t = useTranslations("projects");
  const tc = useTranslations("common");
  const isKo = useLocale() === "ko";
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="projects" className="bg-section-alt py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {showHeading ? <SectionHeading>{t("heading")}</SectionHeading> : <h2 className="sr-only">{t("heading")}</h2>}

        <ol className="border-b border-border">
          {projects.map((project, i) => {
            const isOpen = open === i;
            const title = isKo ? project.title : project.titleEn;
            const subtitle = project.dir
              ? title
              : title.includes(" - ")
                ? title.split(" - ").slice(1).join(" - ")
                : "";
            const links = project.links ?? (project.url ? [{ label: "github", labelEn: "github", url: project.url }] : []);
            return (
              <li key={project.titleEn} className="border-t border-border">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`project-panel-${i}`}
                  className="grid w-full gap-1 py-4 text-left transition-colors hover:bg-muted/30 sm:grid-cols-[1.25rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-x-3"
                >
                  <span aria-hidden="true" className="hidden font-mono text-sm text-accent sm:block">
                    {isOpen ? "▾" : "▸"}
                  </span>
                  <span className="min-w-0">
                    <span className="font-mono text-base font-semibold text-foreground md:text-lg">
                      {dirName(project)}
                      <span className="text-accent">/</span>
                    </span>
                    {subtitle && <span className="ml-3 text-sm text-muted-foreground">{subtitle}</span>}
                    {!isOpen && <Tags tags={project.tags.slice(0, 4)} className="mt-1.5" />}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{isKo ? project.period : project.periodEn}</span>
                </button>

                {isOpen && (
                  <div
                    id={`project-panel-${i}`}
                    className={cn("mb-5 space-y-6 border-l border-border pl-5 sm:ml-8")}
                  >
                    {(
                      [
                        ["goal", isKo ? project.goals : project.goalsEn],
                        ["content", isKo ? project.contents : project.contentsEn],
                        ["result", isKo ? project.results : project.resultsEn],
                      ] as const
                    ).map(([key, items]) => (
                      <div key={key}>
                        <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-accent">
                          ### {tc(key)}
                        </p>
                        <Bullets items={[...items]} />
                      </div>
                    ))}
                    {links.length > 0 && (
                      <p className="flex flex-wrap gap-x-5 gap-y-1">
                        {links.map((link) => (
                          <Cmd key={link.url} href={link.url}>
                            open {(isKo ? link.label : link.labelEn).toLowerCase()}
                          </Cmd>
                        ))}
                      </p>
                    )}
                    <Tags tags={project.tags} />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
