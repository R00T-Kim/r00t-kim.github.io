"use client";

import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { m } from "framer-motion";
import { ExternalLink, Play, Calendar, MapPin, Globe } from "lucide-react";
import { talks, communities, type Talk } from "@/data/speaking";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import { parseDate } from "@/lib/date-utils";

function TalkCard({
  talk,
  index,
  featured,
  isKo,
  slidesLabel,
  videoLabel,
}: {
  talk: Talk;
  index: number;
  featured?: boolean;
  isKo: boolean;
  slidesLabel: string;
  videoLabel: string;
}) {
  const title = isKo ? talk.title : talk.titleEn;
  const venue = isKo ? talk.venue : talk.venueEn;

  const linksContent = (
    <div className={cn("flex flex-wrap gap-2", featured ? "mt-3" : "mt-2.5")}>
      {talk.slidesUrl && (
        <a
          href={talk.slidesUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${slidesLabel} - ${title}`}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
        >
          <ExternalLink className="h-3 w-3" />
          {slidesLabel}
        </a>
      )}
      {talk.videoUrl && (
        <a
          href={talk.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${videoLabel} - ${title}`}
          className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
        >
          <Play className="h-3 w-3" />
          {videoLabel}
        </a>
      )}
    </div>
  );

  const showLinks = featured || talk.slidesUrl || talk.videoUrl;

  const cardContent = (
    <>
      <h4
        className={cn(
          "leading-snug text-foreground",
          featured ? "text-base font-bold" : "text-sm font-medium"
        )}
      >
        {title}
      </h4>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {talk.date}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {venue}
        </span>
      </div>
      {showLinks && linksContent}
    </>
  );

  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className={
        featured
          ? "relative overflow-hidden rounded-xl border border-accent/30 bg-gradient-to-br from-accent/5 to-accent-secondary/5 p-5 shadow-sm transition-colors transition-shadow hover:shadow-md hover:border-accent/50"
          : "rounded-xl border border-border bg-card p-4 transition-colors transition-shadow hover:border-accent/30 hover:shadow-sm"
      }
    >
      {featured && (
        <>
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gradient-to-b from-accent to-accent-secondary"
          />
          <div className="pl-3">{cardContent}</div>
        </>
      )}
      {!featured && cardContent}
    </m.div>
  );
}

export function Speaking() {
  const t = useTranslations("speaking");
  const tc = useTranslations("common");
  const locale = useLocale();
  const isKo = locale === "ko";

  const highlightTalks = useMemo(
    () => talks.filter((talk) => talk.highlight),
    []
  );
  const otherTalks = useMemo(
    () =>
      talks
        .filter((talk) => !talk.highlight)
        .sort((a, b) => parseDate(b.date) - parseDate(a.date)),
    []
  );

  const slidesLabel = tc("view_slides");
  const videoLabel = tc("view_video");

  return (
    <section id="speaking" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading>{t("heading")}</SectionHeading>

        {/* Talks sub-heading */}
        <m.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-6 text-lg font-semibold text-foreground"
        >
          {t("talks")}
        </m.h3>

        {/* Featured Talks */}
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          {highlightTalks.map((talk, i) => (
            <TalkCard
              key={talk.title}
              talk={talk}
              index={i}
              featured
              isKo={isKo}
              slidesLabel={slidesLabel}
              videoLabel={videoLabel}
            />
          ))}
        </div>

        {/* Other Talks */}
        <div className="mb-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {otherTalks.map((talk, i) => (
            <TalkCard
              key={talk.title}
              talk={talk}
              index={i}
              isKo={isKo}
              slidesLabel={slidesLabel}
              videoLabel={videoLabel}
            />
          ))}
        </div>

        {/* Community */}
        <m.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-6 text-lg font-semibold text-foreground"
        >
          {t("community")}
        </m.h3>

        <div className="grid gap-3 sm:grid-cols-2">
          {communities.map((com, i) => (
            <m.div
              key={com.organization}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className={cn(
                "rounded-xl border bg-card p-4 transition-colors transition-shadow",
                com.active
                  ? "border-accent/30 shadow-sm"
                  : "border-border hover:border-accent/20"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 shrink-0 text-accent" />
                    <h4 className="text-sm font-semibold text-foreground">
                      {isKo ? com.organization : com.organizationEn}
                    </h4>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {isKo ? com.role : com.roleEn}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {isKo ? com.period : com.periodEn}
                </span>
              </div>
              {com.active && (
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-accent-secondary/10 px-2 py-0.5 text-xs font-medium text-accent-secondary">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary" />
                  {tc("active")}
                </div>
              )}
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
