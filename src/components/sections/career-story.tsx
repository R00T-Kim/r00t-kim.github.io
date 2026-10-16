"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { careerDetailSections } from "@/data/career-detail";
import { cn } from "@/lib/utils";
import { DetailItem } from "@/components/sections/career-story/detail-item";
import { RoleAccordion } from "@/components/sections/career-story/role-accordion";
import { Cmd } from "@/components/ui/term";

function Block({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h3 className="mb-3 text-sm font-semibold text-foreground">
        <span className="text-accent">### </span>
        {heading}
      </h3>
      <div className="border-l border-border pl-4">{children}</div>
    </div>
  );
}

export function CareerStoryContent() {
  const t = useTranslations("career_story");
  const locale = useLocale();
  const isKo = locale === "ko";
  const [activeSection, setActiveSection] = useState<string>(careerDetailSections[0]?.id ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    careerDetailSections.forEach((section) => {
      const el = document.getElementById(`section-${section.id}`);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(section.id);
        },
        { rootMargin: "-20% 0px -60% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const tocLink = (section: (typeof careerDetailSections)[number], i: number, compact = false) => {
    const active = activeSection === section.id;
    return (
      <a
        key={section.id}
        href={`#section-${section.id}`}
        aria-current={active ? "true" : undefined}
        className={cn(
          "flex gap-2 font-mono text-sm transition-colors",
          compact ? "py-0.5" : "py-1",
          active ? "text-accent" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <span aria-hidden="true" className="w-3 shrink-0">
          {active ? ">" : ""}
        </span>
        <span className="min-w-0">
          {String(i + 1).padStart(2, "0")} {isKo ? section.title : section.titleEn}
        </span>
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-28 sm:px-6 md:pt-36 lg:px-8">
          <p className="prompt text-sm">
            <span className="user">gnosis@kim</span>
            <span className="text-muted-foreground">:~ # </span>
            <span className="cmd">less about_me/stories.md</span>
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            <span className="text-accent"># </span>
            {t("title")}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{t("subtitle")}</p>
          <Cmd href={`/${locale}/about_me#career-highlights`} internal className="mt-6">
            cd ../about_me
          </Cmd>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="mb-2 font-mono text-xs text-muted-foreground">{t("toc")}</p>
              <nav>{careerDetailSections.map((s, i) => tocLink(s, i))}</nav>
            </div>
          </aside>

          <nav className="mb-10 border-b border-border pb-4 lg:hidden" aria-label={t("toc")}>
            {careerDetailSections.map((s, i) => tocLink(s, i, true))}
          </nav>

          <div className="space-y-20">
            {careerDetailSections.map((section, i) => (
              <article key={section.id} id={`section-${section.id}`} className="scroll-mt-24">
                <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  <span className="text-accent">## </span>
                  {String(i + 1).padStart(2, "0")} {isKo ? section.title : section.titleEn}
                </h2>
                {section.links && section.links.length > 0 && (
                  <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                    {section.links.map((link) => (
                      <Cmd key={link.url} href={link.url}>
                        open {(isKo ? link.label : link.labelEn).toLowerCase()}
                      </Cmd>
                    ))}
                  </p>
                )}

                <Block heading={t("background")}>
                  <ul className="space-y-2">
                    {section.background.map((item, j) => (
                      <DetailItem key={j} item={item} isKo={isKo} />
                    ))}
                  </ul>
                </Block>

                <Block heading={t("role")}>
                  <div className="divide-y divide-border">
                    {section.role.map((sub, j) => (
                      <RoleAccordion key={j} sub={sub} isKo={isKo} sectionId={section.id} index={j} />
                    ))}
                  </div>
                </Block>

                <Block heading={t("results")}>
                  <ul className="space-y-2">
                    {section.results.map((item, j) => (
                      <DetailItem key={j} item={item} isKo={isKo} />
                    ))}
                  </ul>
                </Block>

                <Block heading={t("lessons")}>
                  <ul className="space-y-2">
                    {section.lessons.map((item, j) => (
                      <DetailItem key={j} item={item} isKo={isKo} />
                    ))}
                  </ul>
                </Block>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
