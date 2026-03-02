"use client";

import { useTranslations } from "next-intl";
import { m } from "framer-motion";
import { Github, Linkedin, BookOpen, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { SectionHeading } from "@/components/ui/section-heading";

const links = [
  {
    key: "linkedin",
    href: profile.links.linkedin,
    icon: Linkedin,
  },
  {
    key: "blog",
    href: profile.links.blog,
    icon: BookOpen,
  },
  {
    key: "github",
    href: profile.links.github,
    icon: Github,
  },
  {
    key: "email",
    href: `mailto:${profile.links.email}`,
    icon: Mail,
  },
] as const;

export function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="relative overflow-hidden bg-background py-20 md:py-28">
      {/* Subtle background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(14,165,233,0.06),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_20%_80%,rgba(16,185,129,0.04),transparent)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <SectionHeading className="flex flex-col items-center">
          {t("heading")}
        </SectionHeading>

        <m.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mb-10 text-muted-foreground"
        >
          {t("description")}
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {links.map(({ key, href, icon: Icon }, i) => (
            <m.a
              key={key}
              href={href}
              {...(key !== "email" && { target: "_blank", rel: "noopener noreferrer" })}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.45, delay: 0.25 + i * 0.08 }}
              className="group flex items-center gap-2.5 rounded-xl border border-border bg-card px-5 py-3 transition-colors transition-shadow hover:border-accent/40 hover:shadow-md"
            >
              <Icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-accent" />
              <span className="text-sm font-medium text-foreground">
                {t(key)}
              </span>
            </m.a>
          ))}
        </m.div>
      </div>
    </section>
  );
}
