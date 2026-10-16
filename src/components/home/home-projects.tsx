"use client";

import { useLocale, useTranslations } from "next-intl";
import { m } from "framer-motion";
import { FileText, GitBranch } from "lucide-react";
import { projects } from "@/data/projects";
import { postById } from "@/data/posts";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";

const picks = projects.filter((project) => project.featured).slice(0, 3);

function splitTitle(title: string): [string, string | undefined] {
  const index = title.indexOf(" - ");
  return index === -1
    ? [title, undefined]
    : [title.slice(0, index), title.slice(index + 3)];
}

export function HomeProjects() {
  const t = useTranslations("home.projects");
  const ts = useTranslations("home.sections");
  const locale = useLocale();
  const isKo = locale === "ko";

  return (
    <section id="projects" className="bg-section-alt py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionLabel
          index="03"
          label={ts("projects_label")}
          title={ts("projects_title")}
          aside={{ href: `/${locale}/laboratory`, label: t("all") }}
        />
        <div className="grid gap-4 md:grid-cols-3">
          {picks.map((project, i) => {
            const [name, subtitle] = splitTitle(
              isKo ? project.title : project.titleEn
            );
            const active = project.period.includes("현재");
            const repo = project.url ?? project.links?.[0]?.url;
            const related = project.relatedPostIds
              ?.map((id) => postById(id))
              .find((post) => post !== undefined);

            return (
              <m.article
                key={project.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-mono text-lg font-semibold text-foreground">
                    {name}
                  </h3>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider",
                      active
                        ? "border-accent/40 text-accent"
                        : "border-border text-muted-foreground"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        active ? "bg-accent" : "bg-muted-foreground"
                      )}
                    />
                    {active ? t("status_active") : t("status_done")}
                  </span>
                </div>
                {subtitle && (
                  <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
                )}
                <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                  {(isKo ? project.goals : project.goalsEn)[0]}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 text-sm">
                  {repo && (
                    <a
                      href={repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
                    >
                      <GitBranch className="h-4 w-4" />
                      {t("repo")}
                    </a>
                  )}
                  {related && (
                    <a
                      href={related.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      {t("related_post")}
                    </a>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[11px] text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </m.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
