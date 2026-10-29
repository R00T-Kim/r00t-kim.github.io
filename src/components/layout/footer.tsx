"use client";

import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";

export function Footer() {
  const t = useTranslations("footer");

  const links = [
    { href: `mailto:${siteConfig.author.email}`, label: `mail ${siteConfig.author.email}`, external: false },
    { href: siteConfig.social.github, label: "open github", external: true },
    { href: siteConfig.social.linkedin, label: "open linkedin", external: true },
    { href: siteConfig.social.x, label: "open x", external: true },
    { href: siteConfig.social.blog, label: "open blog", external: true },
  ];

  // The home page opens a root shell; the footer closes it, the way an SSH session ends.
  const host = new URL(siteConfig.url).host;

  return (
    <footer className="border-t border-border bg-background font-mono">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {links.map(({ href, label, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                className="transition-colors hover:text-accent"
              >
                <span className="text-accent/70"># </span>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-6 text-sm">
          <p className="prompt">
            <span className="user">{siteConfig.author.alias}@kim</span>
            <span className="text-muted-foreground">:~ # </span>
            <span className="cmd">exit</span>
          </p>
          <p className="text-muted-foreground">logout</p>
          <p className="text-muted-foreground">Connection to {host} closed.</p>
        </div>
        <p className="mt-6 text-xs text-muted-foreground"># {t("copyright")}</p>
      </div>
    </footer>
  );
}
