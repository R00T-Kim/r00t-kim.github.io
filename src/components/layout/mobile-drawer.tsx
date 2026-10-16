"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import { Github, Mail, Rss } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export interface NavLink {
  key: string;
  href: string;
  label: string;
  active: boolean;
}

interface MobileDrawerProps {
  links: NavLink[];
  onClose: () => void;
}

const quickLinks = [
  { href: `mailto:${siteConfig.author.email}`, icon: Mail, label: "Email" },
  { href: siteConfig.social.github, icon: Github, label: "GitHub" },
  { href: siteConfig.social.x, icon: XIcon, label: "X" },
  { href: siteConfig.social.rss, icon: Rss, label: "RSS" },
];

export function MobileDrawer({ links, onClose }: MobileDrawerProps) {
  const navRef = useRef<HTMLElement>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    const timer = setTimeout(() => {
      navRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    }, 100);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      clearTimeout(timer);
    };
  }, [handleEscape]);

  return (
    <>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
        onClick={onClose}
      />
      <m.nav
        ref={navRef}
        aria-label="Mobile navigation"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 26, stiffness: 220 }}
        className="fixed top-0 right-0 bottom-0 z-40 flex w-72 flex-col border-l border-border bg-card p-6 pt-20 shadow-xl md:hidden"
      >
        <div className="flex flex-col gap-1">
          {links.map((link, i) => (
            <m.div
              key={link.key}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={link.href}
                onClick={onClose}
                aria-current={link.active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-md px-4 py-3 text-base font-medium transition-colors",
                  link.active
                    ? "bg-muted/60 text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <span aria-hidden="true" className="font-mono text-accent">
                  /
                </span>
                {link.label}
              </Link>
            </m.div>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-1 border-t border-border pt-4">
          {quickLinks.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              {...(href.startsWith("http") && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
              aria-label={label}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </m.nav>
    </>
  );
}
