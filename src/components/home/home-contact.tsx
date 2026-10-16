"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Github, Linkedin, Mail, Rss } from "lucide-react";
import { siteConfig } from "@/config/site";
import { SectionLabel } from "@/components/ui/section-label";

function linkedinHandle(url: string): string {
  try {
    const path = decodeURIComponent(new URL(url).pathname);
    return path.replace(/^\/+|\/+$/g, "");
  } catch {
    return "LinkedIn";
  }
}

export function HomeContact() {
  const t = useTranslations("home.contact");
  const ts = useTranslations("home.sections");
  const locale = useLocale();

  const links = [
    {
      key: "email",
      href: `mailto:${siteConfig.author.email}`,
      icon: Mail,
      label: t("email"),
      value: siteConfig.author.email,
      external: false,
    },
    {
      key: "github",
      href: siteConfig.social.github,
      icon: Github,
      label: t("github"),
      value: siteConfig.social.github.replace(/^https?:\/\//, ""),
      external: true,
    },
    {
      key: "linkedin",
      href: siteConfig.social.linkedin,
      icon: Linkedin,
      label: t("linkedin"),
      value: linkedinHandle(siteConfig.social.linkedin),
      external: true,
    },
    {
      key: "rss",
      href: siteConfig.social.rss,
      icon: Rss,
      label: t("rss"),
      value: siteConfig.social.rss.replace(/^https?:\/\//, ""),
      external: true,
    },
  ];

  return (
    <section id="contact" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionLabel
          index="04"
          label={ts("contact_label")}
          title={ts("contact_title")}
        />
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
          <div className="max-w-xl">
            <p className="text-base leading-relaxed text-foreground/80 md:text-lg">
              {t("bio_1")}
            </p>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {t("description")}
            </p>
            <Link
              href={`/${locale}/about_me`}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              {t("profile_link")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ul className="grid gap-2 sm:grid-cols-2">
            {links.map(({ key, href, icon: Icon, label, value, external }) => (
              <li key={key}>
                <a
                  href={href}
                  {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-accent/40"
                >
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
                  <span className="flex min-w-0 flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {label}
                    </span>
                    <span className="truncate font-mono text-xs text-muted-foreground">
                      {value}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
