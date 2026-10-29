"use client";

import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tags } from "@/components/ui/term";

export function About() {
  const t = useTranslations("about");
  const keywords: string[] = t.raw("keywords");

  return (
    <section id="about" className="bg-section-alt py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading>{t("heading")}</SectionHeading>

        <div className="max-w-3xl">
          <div className="space-y-5">
            {(["description_1", "description_2", "description_3"] as const).map((key) => (
              <p key={key} className="text-base leading-relaxed text-foreground/90">
                {t(key)}
              </p>
            ))}
            <Tags tags={keywords} className="pt-2" />
          </div>
        </div>
      </div>
    </section>
  );
}
