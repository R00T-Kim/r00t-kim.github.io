"use client";

import { useTranslations } from "next-intl";
import { m } from "framer-motion";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function About() {
  const t = useTranslations("about");
  const keywords: string[] = t.raw("keywords");

  return (
    <section id="about" className="bg-section-alt py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading>{t("heading")}</SectionHeading>

        {/* Profile Photo */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <div className="relative h-36 w-36 overflow-hidden rounded-full border-2 border-border shadow-lg">
            <Image
              src="/profile.png"
              alt={t("heading")}
              fill
              className="object-cover"
              sizes="144px"
              priority
            />
          </div>
        </m.div>

        {/* Text Content */}
        <div className="space-y-5">
          {(["description_1", "description_2", "description_3"] as const).map(
            (key, i) => (
              <m.p
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className={cn(
                  "text-base leading-relaxed text-foreground/80",
                  key === "description_3" && "border-l-2 border-accent pl-4"
                )}
              >
                {t(key)}
              </m.p>
            )
          )}
        </div>

        {/* Keywords */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="mt-8 flex flex-wrap gap-2.5"
        >
          {keywords.map((keyword) => (
            <Badge key={keyword} variant="accent">
              {keyword}
            </Badge>
          ))}
        </m.div>
      </div>
    </section>
  );
}
