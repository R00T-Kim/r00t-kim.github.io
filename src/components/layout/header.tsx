"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { AnimatePresence } from "framer-motion";
import { Github, Menu, Moon, Search, Sun, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { MobileDrawer, type NavLink } from "@/components/layout/mobile-drawer";
import { SearchDialog } from "@/components/search/search-dialog";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function Header() {
  const t = useTranslations("nav");
  const tSearch = useTranslations("search");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const links: NavLink[] = siteConfig.nav.map((item) => {
    const href = `/${locale}${item.href}`;
    const active =
      pathname === href ||
      pathname.startsWith(`${href}/`) ||
      (item.key === "about_me" && pathname.startsWith(`/${locale}/career`));
    return { key: item.key, href, label: t(item.key), active };
  });

  const switchLocale = () => {
    const next = locale === "ko" ? "en" : "ko";
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/"));
  };

  const isDark = resolvedTheme === "dark";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
          scrolled || mobileOpen
            ? "border-border/70 bg-background/85 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Wordmark */}
          <Link
            href={`/${locale}`}
            className="flex shrink-0 items-center whitespace-nowrap rounded-md font-mono text-sm font-semibold tracking-tight text-foreground"
            aria-label={t("home")}
          >
            <span className="text-accent">{siteConfig.author.alias}@kim</span>
            <span className="text-muted-foreground">:~</span>
            <span className="text-accent">#</span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                aria-current={link.active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 font-mono text-sm transition-colors",
                  link.active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={cn("text-accent", link.active ? "opacity-100" : "opacity-40")}
                >
                  /
                </span>
              </Link>
            ))}
          </nav>

          {/* Auxiliary controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={tSearch("open")}
              className="inline-flex items-center gap-2 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              <Search className="h-4 w-4" />
              <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[11px] md:inline">
                {tSearch("shortcut")}
              </kbd>
            </button>
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hidden rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground sm:inline-flex"
            >
              <Github className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={switchLocale}
              aria-label={t("switch_language")}
              className="rounded-md px-2.5 py-2 font-mono text-xs font-semibold tracking-wide text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              {locale === "ko" ? "EN" : "KO"}
            </button>
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label={t("toggle_theme")}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              {mounted && isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={t("menu")}
              aria-expanded={mobileOpen}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground md:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <MobileDrawer links={links} onClose={() => setMobileOpen(false)} />
        )}
      </AnimatePresence>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
