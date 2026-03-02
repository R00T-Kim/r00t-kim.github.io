"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { Shield, Sun, Moon, Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { MobileDrawer } from "@/components/layout/mobile-drawer";

const navKeys = siteConfig.nav;

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isSubPage = pathname.includes("/career");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);


  const switchLocale = () => {
    const next = locale === "ko" ? "en" : "ko";
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/"));
  };

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    if (isSubPage) {
      router.push(`/${locale}#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const targetLang = locale === "ko" ? "EN" : "KO";

  return (
    <>
      <m.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-border/50 shadow-sm"
            : "bg-transparent border-transparent"
        )}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => {
                if (isSubPage) {
                  router.push(`/${locale}`);
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="group flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-muted/50"
              aria-label="Back to top"
            >
              <Shield className="h-5 w-5 text-accent transition-transform group-hover:scale-110" />
            </button>

            {/* Desktop Nav */}
            {!isSubPage && (
              <nav className="hidden md:flex items-center gap-1">
                {navKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => scrollTo(key)}
                    className="px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-muted/50"
                  >
                    {t(key)}
                  </button>
                ))}
              </nav>
            )}

            {/* Controls */}
            <div className="flex items-center gap-1">
              {/* Lang Switcher */}
              <button
                onClick={switchLocale}
                className="flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-2 text-sm text-muted-foreground transition-all hover:border-accent/30 hover:text-foreground hover:bg-muted/50"
                aria-label="Switch language"
              >
                <Globe className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wide text-accent">
                  {targetLang}
                </span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50"
                aria-label="Toggle theme"
              >
                {mounted ? (
                  theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>

              {/* Mobile Menu Button */}
              
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50 md:hidden"
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              
            </div>
          </div>
        </div>
      </m.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileDrawer
            navKeys={navKeys}
            onClose={() => setMobileOpen(false)}
            onNavigate={scrollTo}
          />
        )}
      </AnimatePresence>
    </>
  );
}
