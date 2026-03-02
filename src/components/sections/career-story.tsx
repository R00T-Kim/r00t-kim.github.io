"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { m } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { careerDetailSections } from "@/data/career-detail";
import { cn } from "@/lib/utils";
import { DetailItem } from "@/components/sections/career-story/detail-item";
import { RoleAccordion } from "@/components/sections/career-story/role-accordion";

export function CareerStoryContent() {
  const t = useTranslations("career_story");
  const locale = useLocale();
  const isKo = locale === "ko";
  const [activeSection, setActiveSection] = useState<string>(
    careerDetailSections[0]?.id ?? ""
  );

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    careerDetailSections.forEach((section) => {
      const el = document.getElementById(`section-${section.id}`);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(section.id);
          }
        },
        { rootMargin: "-20% 0px -60% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="border-b border-border bg-gradient-to-b from-accent/5 to-transparent">
        <div className="mx-auto max-w-4xl px-4 pb-14 pt-28 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}/#career-highlights`}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            aria-label={isKo ? "포트폴리오 목록으로 돌아가기" : "Go back to portfolio overview"}
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Link>
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-foreground md:text-4xl"
          >
            {t("title")}
          </m.h1>
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-base text-foreground/70 md:text-lg"
          >
            {t("subtitle")}
          </m.p>
        </div>
      </div>

      {/* Content with TOC */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-12">
          {/* Desktop TOC sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t("toc")}
              </h4>
              <nav className="space-y-1">
                {careerDetailSections.map((section) => (
                  <a
                    key={section.id}
                    href={`#section-${section.id}`}
                    aria-current={activeSection === section.id ? "true" : undefined}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm transition-all",
                      activeSection === section.id
                        ? "bg-accent/10 font-medium text-accent border-l-2 border-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {isKo ? section.title : section.titleEn}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile TOC */}
          <div className="mb-8 lg:hidden">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {careerDetailSections.map((section) => (
                <a
                  key={section.id}
                  href={`#section-${section.id}`}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2.5 text-xs font-medium transition-all",
                    activeSection === section.id
                      ? "bg-accent/10 text-accent border border-accent/30"
                      : "bg-card border border-border text-muted-foreground"
                  )}
                >
                  {isKo ? section.title : section.titleEn}
                </a>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-20">
            {careerDetailSections.map((section, i) => (
              <m.article
                key={section.id}
                id={`section-${section.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-24"
              >
                {/* Section Title */}
                <div className="mb-10">
                  <div className="mb-3 text-base font-bold tracking-wider text-accent/70">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {isKo ? section.title : section.titleEn}
                  </h2>
                  <div aria-hidden="true" className="mt-3 h-1 w-16 rounded-full bg-accent" />
                </div>

                {/* Background */}
                <div className="mb-10">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-accent">
                    <span aria-hidden="true" className="h-px w-4 bg-accent/40" />
                    {t("background")}
                  </h3>
                  <div className="rounded-xl border border-border bg-card p-6">
                    <ul className="space-y-3">
                      {section.background.map((item, j) => (
                        <DetailItem
                          key={j}
                          item={item}
                          isKo={isKo}
                        />
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Role (accordion) */}
                <div className="mb-10">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-accent">
                    <span aria-hidden="true" className="h-px w-4 bg-accent/40" />
                    {t("role")}
                  </h3>
                  <div className="space-y-3">
                    {section.role.map((sub, j) => (
                      <RoleAccordion
                        key={j}
                        sub={sub}
                        isKo={isKo}
                        sectionId={section.id}
                        index={j}
                      />
                    ))}
                  </div>
                </div>

                {/* Results & Impact */}
                <div className="mb-10">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-accent-secondary">
                    <span aria-hidden="true" className="h-px w-4 bg-accent-secondary/40" />
                    {t("results")}
                  </h3>
                  <div className="rounded-xl border border-accent-secondary/20 bg-gradient-to-br from-accent-secondary/5 to-transparent p-6">
                    <ul className="space-y-3">
                      {section.results.map((item, j) => (
                        <DetailItem
                          key={j}
                          item={item}
                          isKo={isKo}
                        />
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Lessons Learned */}
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                    <span aria-hidden="true" className="h-px w-4 bg-muted-foreground/40" />
                    {t("lessons")}
                  </h3>
                  <div className="rounded-xl border border-border bg-card/50 p-6">
                    <ul className="space-y-3">
                      {section.lessons.map((item, j) => (
                        <DetailItem
                          key={j}
                          item={item}
                          isKo={isKo}
                        />
                      ))}
                    </ul>
                  </div>
                </div>
              </m.article>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
