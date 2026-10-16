"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { experiences } from "@/data/experience";
import { careerHighlights } from "@/data/career-summary";
import { SystemMap } from "@/components/home/system-map";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

export function HomeHero() {
  const t = useTranslations("home.hero");
  const locale = useLocale();
  const isKo = locale === "ko";
  const name = isKo ? siteConfig.author.name.ko : siteConfig.author.name.en;
  const current = experiences.find((item) => item.endDate === null);
  const latest = careerHighlights[0];

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-background pt-28 pb-16 md:pt-36 md:pb-24"
    >
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8">
        <div>
          <m.p
            {...fade(0)}
            className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent"
          >
            {t("eyebrow")}
          </m.p>
          <m.h1
            {...fade(0.08)}
            className="mt-4 text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl"
          >
            {name}
          </m.h1>
          <m.p
            {...fade(0.14)}
            className="mt-3 font-mono text-sm text-muted-foreground"
          >
            {siteConfig.author.handles.join(" · ")}
          </m.p>
          <m.p
            {...fade(0.18)}
            className="mt-6 max-w-xl text-xl font-medium leading-snug text-foreground md:text-2xl"
          >
            {t("tagline")}
            <span className="text-accent">.</span>
          </m.p>
          <m.p
            {...fade(0.24)}
            className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {t("intro_1")} {t("intro_2")}
          </m.p>

          <m.div {...fade(0.28)} className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
            >
              {t("cta_posts")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/${locale}/about_me`}
              className="inline-flex items-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent/50 hover:text-accent"
            >
              {t("cta_about")}
            </Link>
          </m.div>

          <m.dl
            {...fade(0.36)}
            className="mt-10 grid gap-2 font-mono text-xs sm:grid-cols-2"
          >
            {current && (
              <div className="flex items-start gap-2">
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                />
                <dt className="shrink-0 uppercase tracking-wider text-muted-foreground">
                  {t("now")}
                </dt>
                <dd className="text-foreground/80">
                  {isKo ? current.company : current.companyEn} ·{" "}
                  {isKo ? current.team : current.teamEn}
                </dd>
              </div>
            )}
            {latest && (
              <div className="flex items-start gap-2">
                <span aria-hidden="true" className="shrink-0 text-accent">
                  ★
                </span>
                <dt className="shrink-0 uppercase tracking-wider text-muted-foreground">
                  {t("latest")}
                </dt>
                <dd className="text-foreground/80">
                  {isKo ? latest.title : latest.titleEn}
                </dd>
              </div>
            )}
          </m.dl>
        </div>

        <m.div {...fade(0.2)}>
          <SystemMap />
        </m.div>
      </div>
    </section>
  );
}
