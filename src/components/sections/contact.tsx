"use client";

import { useTranslations } from "next-intl";
import { profile } from "@/data/profile";
import { SectionHeading } from "@/components/ui/section-heading";
import { Cmd } from "@/components/ui/term";
import { cn } from "@/lib/utils";

export function Contact({ className }: { className?: string }) {
  const t = useTranslations("contact");

  const commands = [
    { href: `mailto:${profile.links.email}`, label: `mail ${profile.links.email}` },
    { href: profile.links.github, label: "open github" },
    { href: profile.links.linkedin, label: "open linkedin" },
    { href: profile.links.x, label: "open x" },
    { href: profile.links.blog, label: "open blog" },
  ];

  return (
    <section id="contact" className={cn("bg-background py-20 md:py-28", className)}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading>{t("heading")}</SectionHeading>
        <p className="text-sm text-muted-foreground md:text-base">{t("description")}</p>
        <ul className="mt-6 space-y-2">
          {commands.map((cmd) => (
            <li key={cmd.label}>
              <Cmd href={cmd.href} className="text-foreground">
                {cmd.label}
              </Cmd>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
