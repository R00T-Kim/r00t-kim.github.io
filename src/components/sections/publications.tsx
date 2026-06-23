"use client";

import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { m } from "framer-motion";
import { FileText, Award, ExternalLink, Calendar, Star } from "lucide-react";
import { publications, type Publication } from "@/data/publications";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

function AuthorList({
  names,
  ownerIndex,
}: {
  names: string[];
  ownerIndex: number;
}) {
  return (
    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
      {names.map((name, i) => (
        <span key={`${name}-${i}`}>
          <span
            className={cn(
              i === ownerIndex && "font-semibold text-foreground"
            )}
          >
            {name}
          </span>
          {i < names.length - 1 && <span aria-hidden="true">, </span>}
        </span>
      ))}
    </p>
  );
}

function PublicationLinks({
  pub,
  className,
}: {
  pub: Publication;
  className?: string;
}) {
  const isKo = useLocale() === "ko";
  if (!pub.links?.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {pub.links.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${isKo ? link.label : link.labelEn} - ${
            isKo ? pub.title : pub.titleEn
          }`}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
        >
          <ExternalLink className="h-3 w-3" />
          {isKo ? link.label : link.labelEn}
        </a>
      ))}
    </div>
  );
}

function TypeBadge({
  type,
  journalLabel,
  conferenceLabel,
}: {
  type: Publication["type"];
  journalLabel: string;
  conferenceLabel: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
      <FileText className="h-3 w-3" />
      {type === "journal" ? journalLabel : conferenceLabel}
    </span>
  );
}

export function Publications() {
  const t = useTranslations("publications");
  const locale = useLocale();
  const isKo = locale === "ko";

  const featured = useMemo(
    () => publications.filter((p) => p.highlight),
    []
  );
  const rest = useMemo(() => publications.filter((p) => !p.highlight), []);

  const journalLabel = t("journal");
  const conferenceLabel = t("conference");
  const firstAuthorLabel = t("first_author");

  return (
    <section id="publications" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading>{t("heading")}</SectionHeading>

        {/* Featured / headliner publications */}
        {featured.length > 0 && (
          <div className="mb-8 grid gap-4">
            {featured.map((pub, i) => (
              <m.article
                key={pub.titleEn}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="relative overflow-hidden rounded-xl border border-accent/30 bg-gradient-to-br from-accent/5 to-accent-secondary/5 p-5 shadow-sm transition-colors transition-shadow hover:border-accent/50 hover:shadow-md"
              >
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gradient-to-b from-accent to-accent-secondary"
                />
                <div className="pl-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <TypeBadge
                      type={pub.type}
                      journalLabel={journalLabel}
                      conferenceLabel={conferenceLabel}
                    />
                    {pub.firstAuthor && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent-secondary/10 px-2.5 py-0.5 text-xs font-medium text-accent-secondary">
                        <Star className="h-3 w-3" />
                        {firstAuthorLabel}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 text-base font-bold leading-snug text-foreground">
                    {isKo ? pub.title : pub.titleEn}
                  </h3>
                  <AuthorList
                    names={isKo ? pub.authors : pub.authorsEn}
                    ownerIndex={pub.authorIndex}
                  />
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground/80">
                      {isKo ? pub.venue : pub.venueEn}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {pub.date}
                    </span>
                  </div>
                  <PublicationLinks pub={pub} className="mt-3" />
                </div>
              </m.article>
            ))}
          </div>
        )}

        {/* Remaining publications */}
        <div className="space-y-3">
          {rest.map((pub, i) => (
            <m.article
              key={pub.titleEn}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card p-4 transition-colors transition-shadow hover:border-accent/30 hover:shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <TypeBadge
                  type={pub.type}
                  journalLabel={journalLabel}
                  conferenceLabel={conferenceLabel}
                />
                {pub.award && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                    <Award className="h-3 w-3" />
                    {isKo ? pub.award : pub.awardEn}
                  </span>
                )}
              </div>
              <h3 className="mt-2.5 text-sm font-semibold leading-snug text-foreground">
                {isKo ? pub.title : pub.titleEn}
              </h3>
              <AuthorList
                names={isKo ? pub.authors : pub.authorsEn}
                ownerIndex={pub.authorIndex}
              />
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground/80">
                  {isKo ? pub.venue : pub.venueEn}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {pub.date}
                </span>
              </div>
              <PublicationLinks pub={pub} className="mt-3" />
            </m.article>
          ))}
        </div>
      </div>
    </section>
  );
}
