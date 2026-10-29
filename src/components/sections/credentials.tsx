"use client";

import { useLocale, useTranslations } from "next-intl";
import { awards, certifications } from "@/data/credentials";
import { SectionHeading } from "@/components/ui/section-heading";
import { Line, SubHeading } from "@/components/ui/term";
import { parseDate } from "@/lib/date-utils";

const sortedAwards = [...awards].sort((a, b) => parseDate(b.date) - parseDate(a.date));
const sortedCerts = [...certifications].sort((a, b) => parseDate(b.date) - parseDate(a.date));

export function Credentials() {
  const t = useTranslations("certified");
  const isKo = useLocale() === "ko";

  return (
    <section id="certified" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading>{t("heading")}</SectionHeading>

        <SubHeading>{t("awards")}</SubHeading>
        <div className="border-b border-border">
          {sortedAwards.map((award) => (
            <Line key={`${award.titleEn}-${award.date}`} left={award.date}>
              <h4 className="text-sm font-semibold text-foreground md:text-base">
                {award.url ? (
                  <a href={award.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
                    {isKo ? award.title : award.titleEn}
                  </a>
                ) : (
                  <>{isKo ? award.title : award.titleEn}</>
                )}
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">{isKo ? award.issuer : award.issuerEn}</p>
              {(isKo ? award.description : award.descriptionEn) && (
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/85">
                  {isKo ? award.description : award.descriptionEn}
                </p>
              )}
            </Line>
          ))}
        </div>

        {sortedCerts.length > 0 && (
          <>
            <SubHeading>{t("certifications")}</SubHeading>
            <div className="border-b border-border">
              {sortedCerts.map((cert) => (
                <Line key={`${cert.nameEn}-${cert.date}`} left={cert.date}>
                  <h4 className="text-sm font-semibold text-foreground">
                    {cert.url ? (
                      <a href={cert.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
                        {isKo ? cert.name : cert.nameEn}
                      </a>
                    ) : (
                      <>{isKo ? cert.name : cert.nameEn}</>
                    )}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground">{isKo ? cert.issuer : cert.issuerEn}</p>
                </Line>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
